export const accessTokenCookieName = "triptrip_access_token";
export const refreshTokenCookieName = "refreshToken";
const authenticationErrorPattern = /unauth|로그인|인증|access.?token|jwt|cannot read propert(?:y|ies) ['"]?_id['"]? of null/i;

type JsonRecord = Record<string, unknown>;

const record = (value: unknown): JsonRecord | undefined => (
  typeof value === "object" && value !== null ? value as JsonRecord : undefined
);

export function isAuthenticationErrorMessage(message: string) {
  return authenticationErrorPattern.test(message);
}

export function hasAuthSession(accessToken?: string, refreshToken?: string) {
  return Boolean(accessToken || refreshToken);
}

export function getProxyOrigin(requestUrl: string, originHeader: string | null) {
  return originHeader || new URL(requestUrl).origin;
}

export function getAccessToken(body: unknown) {
  const data = record(record(body)?.data);
  const token = record(data?.loginUser)?.accessToken ?? record(data?.restoreAccessToken)?.accessToken;
  return typeof token === "string" && token ? token : undefined;
}

export function isLogoutSuccess(body: unknown) {
  return record(record(body)?.data)?.logoutUser === true;
}

export function hasAuthenticationError(body: unknown) {
  const errors = record(body)?.errors;
  if (!Array.isArray(errors)) return false;

  return errors.some((item) => {
    const message = record(item)?.message;
    return typeof message === "string" && isAuthenticationErrorMessage(message);
  });
}

export function containsOperation(body: unknown, operation: string) {
  const query = record(body)?.query;
  return typeof query === "string" && query.includes(operation);
}

export function redactAccessToken(body: unknown) {
  const root = record(body);
  const data = record(root?.data);
  if (!root || !data) return body;

  const nextData = { ...data };
  let changed = false;
  for (const field of ["loginUser", "restoreAccessToken"]) {
    const token = record(nextData[field]);
    if (typeof token?.accessToken !== "string") continue;
    nextData[field] = { ...token, accessToken: "" };
    changed = true;
  }

  return changed ? { ...root, data: nextData } : body;
}

export function accessTokenCookie(token = "", secure = false) {
  return [
    `${accessTokenCookieName}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${token ? 3600 : 0}`,
    secure ? "Secure" : "",
  ].filter(Boolean).join("; ");
}

export function clearRefreshTokenCookie() {
  return `${refreshTokenCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function normalizeUpstreamCookie(cookie: string) {
  const withoutDomain = cookie.replace(/;\s*Domain=[^;]*/gi, "");
  return /;\s*Path=/i.test(withoutDomain)
    ? withoutDomain.replace(/;\s*Path=[^;]*/i, "; Path=/")
    : `${withoutDomain}; Path=/`;
}

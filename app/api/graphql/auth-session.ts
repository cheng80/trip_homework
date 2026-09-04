/**
 * 역할: GraphQL 프록시가 사용하는 인증 쿠키와 응답 판별 규칙을 모은 순수 유틸리티입니다.
 * 처리 흐름: 토큰 추출·민감정보 제거·인증 오류 감지·쿠키 수명주기를 한곳에서 처리합니다.
 * 주의사항: 클라이언트 코드에서도 쓰이는 함수가 있으므로 서버 전용 API에 의존하지 않습니다.
 */
export const accessTokenCookieName = "triptrip_access_token";
export const refreshTokenCookieName = "refreshToken";
const authenticationErrorPattern = /unauth|로그인|인증|access.?token|jwt|cannot read propert(?:y|ies) ['"]?_id['"]? of null/i;

type JsonRecord = Record<string, unknown>;

const record = (value: unknown): JsonRecord | undefined => (
  typeof value === "object" && value !== null ? value as JsonRecord : undefined
);

/** 서버가 돌려준 오류 문구가 로그인 만료나 인증 실패를 의미하는지 판별합니다. */
export function isAuthenticationErrorMessage(message: string) {
  return authenticationErrorPattern.test(message);
}

/** access token 또는 refresh token 중 하나라도 있으면 복원 가능한 세션으로 간주합니다. */
export function hasAuthSession(accessToken?: string, refreshToken?: string) {
  return Boolean(accessToken || refreshToken);
}

/** 프록시가 업스트림에 전달할 Origin을 요청 헤더 우선으로 결정합니다. */
export function getProxyOrigin(requestUrl: string, originHeader: string | null) {
  return originHeader || new URL(requestUrl).origin;
}

/** 로그인과 토큰 복원 응답의 서로 다른 경로에서 access token을 안전하게 추출합니다. */
export function getAccessToken(body: unknown) {
  const data = record(record(body)?.data);
  const token = record(data?.loginUser)?.accessToken ?? record(data?.restoreAccessToken)?.accessToken;
  return typeof token === "string" && token ? token : undefined;
}

export function isLogoutSuccess(body: unknown) {
  return record(record(body)?.data)?.logoutUser === true;
}

/** GraphQL errors 배열 중 하나라도 인증 관련 메시지를 포함하는지 확인합니다. */
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

/** access token을 1시간짜리 HttpOnly 쿠키로 만들며 빈 토큰은 즉시 만료를 뜻합니다. */
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

/** 업스트림 쿠키의 Domain 제한을 제거하고 현재 앱 경로에서 사용하게 만듭니다. HTTP에서는 Secure/SameSite=None을 빼 refresh token이 저장되게 합니다. */
export function normalizeUpstreamCookie(cookie: string, secure = false) {
  const withoutDomain = cookie.replace(/;\s*Domain=[^;]*/gi, "");
  const withPath = /;\s*Path=/i.test(withoutDomain)
    ? withoutDomain.replace(/;\s*Path=[^;]*/i, "; Path=/")
    : withoutDomain + "; Path=/";
  if (secure) return withPath;
  return withPath.replace(/;\s*Secure/gi, "").replace(/;\s*SameSite=None/gi, "; SameSite=Lax");
}

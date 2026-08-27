import { RESTORE_ACCESS_TOKEN } from "../../../graphql/mutations";
import {
  accessTokenCookie,
  accessTokenCookieName,
  clearRefreshTokenCookie,
  containsOperation,
  getAccessToken,
  getProxyOrigin,
  hasAuthenticationError,
  isLogoutSuccess,
  normalizeUpstreamCookie,
  redactAccessToken,
} from "./auth-session";

const endpoint = process.env.GRAPHQL_API_URL || "https://main-practice.codebootcamp.co.kr/graphql";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.startsWith("application/json") && !contentType.startsWith("multipart/form-data")) {
    return Response.json({ errors: [{ message: "지원하지 않는 Content-Type입니다." }] }, { status: 415 });
  }

  const body = await request.arrayBuffer();
  const cookie = request.headers.get("cookie") || "";
  const origin = getProxyOrigin(request.url, request.headers.get("origin"));
  const accessToken = cookie.match(new RegExp(`(?:^|;\\s*)${accessTokenCookieName}=([^;]+)`))?.[1];
  let requestJson: unknown;
  if (contentType.startsWith("application/json")) {
    try {
      requestJson = JSON.parse(new TextDecoder().decode(body)) as unknown;
    } catch {
      return Response.json({ errors: [{ message: "올바른 JSON 요청이 아닙니다." }] }, { status: 400 });
    }
  }
  const logoutRequest = containsOperation(requestJson, "logoutUser");

  const send = (requestBody: BodyInit, token?: string, replaceAuthorization = false) => {
    const headers = new Headers({ "content-type": contentType, origin });
    const authorization = request.headers.get("authorization");
    if (authorization && !replaceAuthorization) headers.set("authorization", authorization);
    else if (token) headers.set("authorization", `Bearer ${decodeURIComponent(token)}`);
    if (cookie) headers.set("cookie", cookie);

    return fetch(endpoint, {
      method: "POST",
      headers,
      body: requestBody,
      cache: "no-store",
    });
  };

  try {
    let upstream = await send(body, accessToken);
    let responseBody = await upstream.arrayBuffer();
    let responseJson = upstream.headers.get("content-type")?.includes("application/json")
      ? JSON.parse(new TextDecoder().decode(responseBody)) as unknown
      : undefined;
    const setCookies: string[] = [];
    const collectCookies = (response: Response) => {
      const headers = response.headers as Headers & { getSetCookie?: () => string[] };
      const values = headers.getSetCookie?.() ?? [response.headers.get("set-cookie")].filter(Boolean) as string[];
      setCookies.push(...values.map(normalizeUpstreamCookie));
    };
    collectCookies(upstream);

    const canRestore = requestJson
      && !containsOperation(requestJson, "loginUser")
      && !containsOperation(requestJson, "logoutUser")
      && !containsOperation(requestJson, "restoreAccessToken");
    if (canRestore && hasAuthenticationError(responseJson) && cookie) {
      const restore = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", cookie, origin },
        body: JSON.stringify({ query: RESTORE_ACCESS_TOKEN, variables: {} }),
        cache: "no-store",
      });
      const restoreBody = await restore.json() as unknown;
      const restoredToken = getAccessToken(restoreBody);
      collectCookies(restore);

      if (restoredToken) {
        upstream = await send(body, restoredToken, true);
        responseBody = await upstream.arrayBuffer();
        responseJson = upstream.headers.get("content-type")?.includes("application/json")
          ? JSON.parse(new TextDecoder().decode(responseBody)) as unknown
          : undefined;
        collectCookies(upstream);
        setCookies.push(accessTokenCookie(restoredToken, process.env.NODE_ENV === "production"));
      } else {
        setCookies.push(accessTokenCookie());
      }
    }

    const nextToken = getAccessToken(responseJson);
    if (nextToken) setCookies.push(accessTokenCookie(nextToken, process.env.NODE_ENV === "production"));
    if (logoutRequest || isLogoutSuccess(responseJson)) {
      setCookies.push(accessTokenCookie(), clearRefreshTokenCookie());
    }

    const responseHeaders = new Headers();
    const upstreamContentType = upstream.headers.get("content-type");
    if (upstreamContentType) responseHeaders.set("content-type", upstreamContentType);
    setCookies.forEach((value) => responseHeaders.append("set-cookie", value));

    const publicBody = responseJson === undefined
      ? responseBody
      : JSON.stringify(redactAccessToken(responseJson));

    return new Response(publicBody, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    const headers = new Headers();
    if (logoutRequest) {
      headers.append("set-cookie", accessTokenCookie());
      headers.append("set-cookie", clearRefreshTokenCookie());
    }
    return Response.json(
      { errors: [{ message: "GraphQL 서버에 연결하지 못했습니다." }] },
      { status: 502, headers },
    );
  }
}

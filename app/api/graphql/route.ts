/**
 * 역할: 브라우저와 공용 GraphQL 서버 사이의 인증 프록시 Route Handler입니다.
 * 처리 흐름: 요청 정제, 쿠키 토큰 전달, 만료 토큰 복원, 응답 토큰 비공개 처리를 순서대로 수행합니다.
 * 주의사항: 업스트림 access token은 HttpOnly 쿠키로 옮기고 공개 응답 본문에서는 제거합니다.
 */
import { RESTORE_ACCESS_TOKEN } from "../../../graphql/mutations";
import { sanitizeRichTextRequest } from "@/domain/sanitize-rich-text";
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
  // JSON GraphQL 요청과 파일 업로드용 multipart 요청만 프록시 대상으로 허용합니다.
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.startsWith("application/json") && !contentType.startsWith("multipart/form-data")) {
    return Response.json({ errors: [{ message: "지원하지 않는 Content-Type입니다." }] }, { status: 415 });
  }

  let body: BodyInit = await request.arrayBuffer();
  const cookie = request.headers.get("cookie") || "";
  const origin = getProxyOrigin(request.url, request.headers.get("origin"));
  const accessToken = cookie.match(new RegExp(`(?:^|;\\s*)${accessTokenCookieName}=([^;]+)`))?.[1];
  let requestJson: unknown;
  if (contentType.startsWith("application/json")) {
    try {
      requestJson = sanitizeRichTextRequest(JSON.parse(new TextDecoder().decode(body)) as unknown);
      body = new TextEncoder().encode(JSON.stringify(requestJson));
    } catch {
      return Response.json({ errors: [{ message: "올바른 JSON 요청이 아닙니다." }] }, { status: 400 });
    }
  }
  const logoutRequest = containsOperation(requestJson, "logoutUser");

  // 최초 요청과 토큰 복원 후 재요청이 동일한 헤더·쿠키 조립 경로를 사용하게 합니다.
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
    // 1차 요청 결과를 바이너리로 보관해 JSON이 아닌 업로드 응답도 그대로 전달할 수 있게 합니다.
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

    // 인증 실패 시 refresh token 쿠키로 access token을 한 번만 복원한 뒤 원 요청을 재시도합니다.
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

    // 로그인·복원으로 받은 새 토큰은 본문 대신 HttpOnly 쿠키에 저장하고 로그아웃 시 모두 만료시킵니다.
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

    // 업스트림 상태 코드는 유지하되 외부 도메인용 헤더는 전달하지 않습니다.
    return new Response(publicBody, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch {
    // 네트워크 장애 중 로그아웃 요청이었다면 로컬 인증 쿠키만이라도 제거합니다.
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

import assert from "node:assert/strict";
import test from "node:test";
import {
  accessTokenCookie,
  clearRefreshTokenCookie,
  containsOperation,
  getAccessToken,
  getProxyOrigin,
  hasAuthSession,
  hasAuthenticationError,
  isAuthenticationErrorMessage,
  isLogoutSuccess,
  normalizeUpstreamCookie,
} from "./auth-session.ts";

test("upstream 요청에는 항상 유효한 Origin을 사용한다", () => {
  assert.equal(getProxyOrigin("http://localhost:3000/api/graphql", null), "http://localhost:3000");
  assert.equal(
    getProxyOrigin("http://localhost:3000/api/graphql", "https://triptrip.example.com"),
    "https://triptrip.example.com",
  );
});

test("인증 응답의 access token은 본문에서 읽고 HttpOnly 쿠키로도 저장한다", () => {
  const body = { data: { loginUser: { accessToken: "secret.token" } } };

  assert.equal(getAccessToken(body), "secret.token");
  assert.match(accessTokenCookie("secret.token"), /HttpOnly/);
  assert.match(accessTokenCookie("secret.token", true), /SameSite=Lax; Max-Age=3600; Secure/);
});

test("로그아웃과 인증 오류만 토큰 수명주기 대상으로 판별한다", () => {
  assert.equal(isLogoutSuccess({ data: { logoutUser: true } }), true);
  assert.match(clearRefreshTokenCookie(), /^refreshToken=;.*Max-Age=0$/);
  assert.equal(hasAuthenticationError({ errors: [{ message: "로그인을 먼저 해주세요." }] }), true);
  assert.equal(isAuthenticationErrorMessage("Cannot read property '_id' of null"), true);
  assert.equal(hasAuthenticationError({ errors: [{ message: "상품을 찾을 수 없습니다." }] }), false);
  assert.equal(hasAuthSession("access", undefined), true);
  assert.equal(hasAuthSession(undefined, "refresh"), true);
  assert.equal(hasAuthSession(undefined, undefined), false);
  assert.equal(containsOperation({ query: "mutation { restoreAccessToken { accessToken } }" }, "restoreAccessToken"), true);
});

test("외부 refresh token 쿠키는 현재 앱 전체 경로에서만 사용한다", () => {
  assert.equal(
    normalizeUpstreamCookie("refreshToken=value; Domain=codebootcamp.co.kr; Path=/graphql; HttpOnly"),
    "refreshToken=value; Path=/; HttpOnly",
  );
});

test("HTTP에서는 refresh token의 Secure와 SameSite=None을 제거한다", () => {
  assert.equal(
    normalizeUpstreamCookie("refreshToken=value; Path=/; SameSite=None; Secure; httpOnly"),
    "refreshToken=value; Path=/; SameSite=Lax; httpOnly",
  );
  assert.equal(
    normalizeUpstreamCookie("refreshToken=value; Path=/; SameSite=None; Secure; httpOnly", true),
    "refreshToken=value; Path=/; SameSite=None; Secure; httpOnly",
  );
});

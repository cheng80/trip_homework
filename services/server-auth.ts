/**
 * 역할: 보호된 서버 페이지가 공통으로 사용하는 쿠키 기반 인증 검사입니다.
 * 처리 흐름: access token 또는 refresh token 쿠키가 있는지 확인하고 없으면 로그인 경로로 리다이렉트합니다.
 * 주의사항: 사용자 상세 권한 검증이 아니라 인증 세션 존재 여부만 판단합니다.
 */
import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  accessTokenCookieName,
  hasAuthSession,
  refreshTokenCookieName,
} from "@/app/api/graphql/auth-session";

export async function requireAuthSession() {
  const cookieStore = await cookies();
  if (!hasAuthSession(
    cookieStore.get(accessTokenCookieName)?.value,
    cookieStore.get(refreshTokenCookieName)?.value,
  )) redirect("/login");
}

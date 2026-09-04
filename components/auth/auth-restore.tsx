/**
 * 역할: 앱 시작 시 refresh token 쿠키로 access token을 복구합니다.
 * 처리 흐름: restoreAccessToken을 한 번 호출하고 성공한 token만 Zustand에 저장합니다.
 * 주의사항: 복구 전에 로그인이 끝나면 빈 응답으로 token을 덮어쓰지 않습니다.
 */
"use client";

import { useEffect, useRef } from "react";
import { restoreAccessToken } from "@/services/account";
import { useAuthStore } from "@/stores/auth-store";

export default function AuthRestore() {
  const hasRestored = useRef(false);
  const setAccessToken = useAuthStore((store) => store.setAccessToken);
  const finishAuth = useAuthStore((store) => store.finishAuth);

  useEffect(() => {
    if (hasRestored.current) return;
    hasRestored.current = true;

    async function restoreLogin() {
      try {
        const accessToken = await restoreAccessToken();
        if (accessToken) setAccessToken(accessToken);
      } catch {
        if (!useAuthStore.getState().accessToken) setAccessToken("");
      } finally {
        finishAuth();
      }
    }

    void restoreLogin();
  }, [finishAuth, setAccessToken]);

  return null;
}

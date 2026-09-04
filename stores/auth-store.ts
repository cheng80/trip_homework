/**
 * 역할: 여러 화면이 함께 사용하는 access token과 인증 준비 상태를 보관합니다.
 * 처리 흐름: 로그인·복구 성공 시 token을 저장하고 로그아웃 시 비웁니다.
 * 주의사항: refresh token은 HttpOnly 쿠키에 있으므로 이 store에는 두지 않습니다.
 */
import { create } from "zustand";

type AuthStore = {
  accessToken: string;
  isAuthReady: boolean;
  setAccessToken: (accessToken: string) => void;
  finishAuth: () => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  accessToken: "",
  isAuthReady: false,
  setAccessToken: (accessToken) => set({ accessToken }),
  finishAuth: () => set({ isAuthReady: true }),
  clearAuth: () => set({ accessToken: "", isAuthReady: true }),
}));

if (typeof window !== "undefined") {
  (globalThis as { __triptripGetAccessToken?: () => string }).__triptripGetAccessToken = () => (
    useAuthStore.getState().accessToken
  );
}

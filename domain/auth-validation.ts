/**
 * 역할: 로그인과 회원가입 입력값을 UI와 분리해 검증합니다.
 * 처리 흐름: 이메일 형식, 비밀번호 길이와 이름 필수값을 모드에 맞춰 검사합니다.
 * 주의사항: 첫 번째 오류 메시지를 반환하며 빈 문자열은 유효함을 뜻합니다.
 */
export type AuthMode = "login" | "signup";
export type AuthField = "email" | "name" | "password" | "passwordCheck";
export type AuthInput = Partial<Record<AuthField, string>>;
export type AuthErrors = Partial<Record<AuthField, string>>;

const loginError = "아이디 또는 비밀번호를 확인해 주세요.";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuthInput(mode: AuthMode, input: AuthInput): AuthErrors {
  const errors: AuthErrors = {};
  const email = input.email?.trim() ?? "";
  const password = input.password ?? "";

  if (!email || !emailPattern.test(email)) {
    errors.email = mode === "login" ? loginError : email ? "이메일 형식으로 입력해 주세요." : "이메일을 입력해 주세요.";
  }

  if (mode === "signup" && !input.name?.trim()) errors.name = "이름을 입력해 주세요.";
  if (!password) errors.password = mode === "login" ? loginError : "비밀번호를 입력해 주세요.";

  if (mode === "signup") {
    if (!input.passwordCheck) errors.passwordCheck = "비밀번호를 한번 더 입력해 주세요.";
    else if (password !== input.passwordCheck) errors.passwordCheck = "비밀번호가 서로 달라요.";
  }

  return errors;
}

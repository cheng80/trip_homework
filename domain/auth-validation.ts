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

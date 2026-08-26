export type PasswordError = {
  field: "newPassword" | "passwordCheck";
  message: string;
} | null;

export function validatePasswordChange(
  currentPassword: string,
  newPassword: string,
  passwordCheck: string,
): PasswordError {
  if (currentPassword === newPassword) {
    return {
      field: "newPassword",
      message: "현재 비밀번호와 다른 비밀번호를 입력해 주세요.",
    };
  }

  if (newPassword !== passwordCheck) {
    return { field: "passwordCheck", message: "새 비밀번호가 서로 달라요." };
  }

  return null;
}

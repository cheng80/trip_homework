/**
 * 역할: 비밀번호 변경 입력을 화면과 분리해 검증하는 순수 함수 모듈입니다.
 * 처리 흐름: 현재 비밀번호, 새 비밀번호, 확인값의 필수 여부와 일치 조건을 순서대로 검사합니다.
 * 주의사항: 반환 문자열이 비어 있으면 제출 가능한 상태를 의미합니다.
 */
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

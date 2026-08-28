/**
 * 역할: 회원가입 라우트의 서버 진입점입니다.
 * 처리 흐름: 공용 AuthForm을 회원가입 모드로 구성해 이름·이메일·비밀번호 입력을 노출합니다.
 * 주의사항: 가입 완료 후 이동과 오류 표시는 AuthForm이 담당합니다.
 */
import AuthForm from "@/components/auth/auth-form";

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}

/**
 * 역할: 로그인 라우트의 서버 진입점입니다.
 * 처리 흐름: 화면 구성은 공용 AuthForm에 위임하고 로그인 모드와 문구만 전달합니다.
 * 주의사항: 실제 입력 검증과 인증 요청은 클라이언트 폼 내부에서 처리합니다.
 */
import AuthForm from "@/components/auth/auth-form";

export default function LoginPage() {
  return <AuthForm mode="login" />;
}

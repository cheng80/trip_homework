/**
 * 역할: 운영 화면과 분리된 GraphQL API 테스트 라우트입니다.
 * 처리 흐름: API 작업 목록과 요청 실행 UI는 ApiTestPage 컴포넌트에 위임합니다.
 * 주의사항: 개발 보조 화면이므로 실제 사용자 흐름의 레이아웃에는 포함하지 않습니다.
 */
import { notFound } from "next/navigation";
import ApiTestPage from "@/components/dev/api-test-page";

export default function DevApiTestPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <ApiTestPage />;
}

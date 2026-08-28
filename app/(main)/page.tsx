/**
 * 역할: 메인 경로의 기본 이동 목적지를 정의하는 서버 컴포넌트입니다.
 * 처리 흐름: 별도 랜딩 화면 대신 핵심 기능인 숙박권 목록으로 즉시 리다이렉트합니다.
 * 주의사항: 화면을 렌더링하지 않으므로 클라이언트 상태를 만들지 않습니다.
 */
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/travelproducts");
}

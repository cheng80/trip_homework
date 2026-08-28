/**
 * 역할: 숙박권 판매 등록 화면의 서버 진입점입니다.
 * 처리 흐름: 인증 세션을 확인한 사용자에게만 작성 모드의 상품 폼을 렌더링합니다.
 * 주의사항: 등록 데이터 조립과 이미지 업로드는 클라이언트 훅에서 처리합니다.
 */
import TravelProductForm from "@/components/travelproducts/travel-product-form";
import { requireAuthSession } from "@/services/server-auth";

export default async function NewTravelProductPage() {
  await requireAuthSession();
  return <TravelProductForm mode="create" />;
}

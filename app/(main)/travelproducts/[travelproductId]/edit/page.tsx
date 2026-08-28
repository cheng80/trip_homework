/**
 * 역할: 숙박권 수정 화면의 인증과 초기 데이터 조회를 담당하는 서버 컴포넌트입니다.
 * 처리 흐름: 세션 확인 후 상품을 조회하고 상세 설명을 안전한 HTML로 정제해 폼에 전달합니다.
 * 주의사항: 비로그인 사용자에게 상품 데이터가 노출되지 않도록 인증 검사를 먼저 수행합니다.
 */
import TravelProductForm from "@/components/travelproducts/travel-product-form";
import { sanitizeRichText } from "@/domain/sanitize-rich-text";
import { requireAuthSession } from "@/services/server-auth";
import { getTravelproductForm } from "@/services/travel-products";

type EditTravelProductPageProps = {
  params: Promise<{ travelproductId: string }>;
};

export default async function EditTravelProductPage({ params }: EditTravelProductPageProps) {
  await requireAuthSession();
  const { travelproductId } = await params;
  const initialValues = await getTravelproductForm(travelproductId);

  return (
    <TravelProductForm
      mode="edit"
      productId={travelproductId}
      initialValues={{ ...initialValues, description: sanitizeRichText(initialValues.description) }}
    />
  );
}

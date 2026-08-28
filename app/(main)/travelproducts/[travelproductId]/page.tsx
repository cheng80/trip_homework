/**
 * 역할: 숙박권 상세 데이터와 위치 정보를 조합하는 서버 컴포넌트입니다.
 * 처리 흐름: 상품 조회·본문 정제·주소 좌표 변환을 수행한 뒤 개요, 설명, 문의 영역으로 나눠 전달합니다.
 * 주의사항: 지도 좌표를 얻지 못해도 상품 본문은 정상적으로 렌더링될 수 있게 구성합니다.
 */
import BackLink from "@/components/commons/back-link";
import ProductInformation from "@/components/travelproducts/product-information";
import ProductInquiries from "@/components/travelproducts/product-inquiries";
import ProductOverview from "@/components/travelproducts/product-overview";
import { geocodeAddress } from "@/services/naver-maps";
import { sanitizeRichText } from "@/domain/sanitize-rich-text";
import { getTravelproductDetail } from "@/services/travel-products";
import styles from "./page.module.css";

type TravelProductDetailPageProps = {
  params: Promise<{ travelproductId: string }>;
};

export default async function TravelProductDetailPage({ params }: TravelProductDetailPageProps) {
  const { travelproductId } = await params;
  const product = await getTravelproductDetail(travelproductId);
  const safeProduct = { ...product, description: sanitizeRichText(product.description) };
  const coordinates = await geocodeAddress(product.location);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <BackLink className={styles.back} href="/travelproducts">숙박권 목록</BackLink>
        <ProductOverview productId={travelproductId} product={safeProduct} />
        <ProductInformation product={safeProduct} coordinates={coordinates} />
        <ProductInquiries
          productId={travelproductId}
          sellerId={safeProduct.seller.id}
          inquiries={safeProduct.inquiries}
        />
      </div>
    </main>
  );
}

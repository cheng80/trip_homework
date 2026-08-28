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

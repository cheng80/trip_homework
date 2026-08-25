import BackLink from "@/components/commons/back-link";
import ProductInformation from "@/components/travelproducts/product-information";
import ProductInquiries from "@/components/travelproducts/product-inquiries";
import ProductOverview from "@/components/travelproducts/product-overview";
import { travelProductDetail } from "@/data/travel-products";
import styles from "./page.module.css";

type TravelProductDetailPageProps = {
  params: Promise<{ travelproductId: string }>;
};

export default async function TravelProductDetailPage({ params }: TravelProductDetailPageProps) {
  const { travelproductId } = await params;

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <BackLink className={styles.back} href="/travelproducts">숙박권 목록</BackLink>
        <ProductOverview productId={travelproductId} product={travelProductDetail} />
        <ProductInformation product={travelProductDetail} />
        <ProductInquiries inquiries={travelProductDetail.inquiries} />
      </div>
    </main>
  );
}

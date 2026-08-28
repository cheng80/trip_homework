/**
 * 역할: 숙박권 목록과 추천 상품을 조회하는 서버 컴포넌트입니다.
 * 처리 흐름: 검색어를 정규화한 뒤 일반 상품과 인기 상품을 병렬로 불러와 각 섹션에 전달합니다.
 * 주의사항: 판매 완료 상품은 기본 목록 조회에서 제외합니다.
 */
import FeaturedProducts from "@/components/travelproducts/featured-products";
import HeroBanner from "@/components/travelproducts/hero-banner";
import ProductCatalog from "@/components/travelproducts/product-catalog";
import PromotionBanner from "@/components/travelproducts/promotion-banner";
import RecentProducts from "@/components/travelproducts/recent-products";
import { travelBanners, travelCategories } from "@/data/travel-products";
import { getBestTravelproducts, getTravelproducts } from "@/services/travel-products";
import styles from "./page.module.css";

type TravelProductsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function TravelProductsPage({ searchParams }: TravelProductsPageProps) {
  const { q = "" } = await searchParams;
  const search = q.trim();
  const [products, bestProducts] = await Promise.all([
    getTravelproducts({ page: 1, search, isSoldout: false }),
    getBestTravelproducts(),
  ]);

  return (
    <main className={styles.page}>
      <HeroBanner banners={travelBanners} />
      <div className={styles.content}>
        <FeaturedProducts products={bestProducts} />
        <PromotionBanner />
        <ProductCatalog categories={travelCategories} products={products} search={search} />
      </div>
      <RecentProducts products={products} />
    </main>
  );
}

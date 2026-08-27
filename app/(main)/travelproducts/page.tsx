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

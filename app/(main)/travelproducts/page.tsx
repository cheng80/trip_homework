import FeaturedProducts from "@/components/travelproducts/featured-products";
import HeroBanner from "@/components/travelproducts/hero-banner";
import ProductCatalog from "@/components/travelproducts/product-catalog";
import PromotionBanner from "@/components/travelproducts/promotion-banner";
import RecentProducts from "@/components/travelproducts/recent-products";
import { travelBanners, travelCategories, travelProducts } from "@/data/travel-products";
import styles from "./page.module.css";

export default function TravelProductsPage() {
  return (
    <main className={styles.page}>
      <HeroBanner banners={travelBanners} />
      <div className={styles.content}>
        <FeaturedProducts products={travelProducts} />
        <PromotionBanner />
        <ProductCatalog categories={travelCategories} products={travelProducts} />
      </div>
      <RecentProducts products={travelProducts} />
    </main>
  );
}

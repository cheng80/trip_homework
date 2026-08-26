import Image from "next/image";
import Link from "next/link";
import type { TravelProduct } from "@/types/travel-products";
import styles from "./recent-products.module.css";

type RecentProductsProps = {
  products: TravelProduct[];
};

export default function RecentProducts({ products }: RecentProductsProps) {
  return (
    <aside className={styles.recent} aria-label="최근 본 숙박권">
      <strong>최근 본</strong>
      {products.slice(0, 3).map((product) => (
        <Link href={`/travelproducts/${product.id}`} key={product.id}>
          <Image
            src={product.image}
            alt={`${product.location} 숙박권`}
            fill
            sizes="56px"
          />
        </Link>
      ))}
    </aside>
  );
}

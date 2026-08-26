import Image from "next/image";
import Link from "next/link";
import type { TravelProduct } from "@/types/travel-products";
import styles from "./travel-product-card.module.css";

type TravelProductCardProps = {
  product: TravelProduct;
  priority?: boolean;
};

export default function TravelProductCard({ product, priority }: TravelProductCardProps) {
  return (
    <Link className={styles.card} href={`/travelproducts/${product.id}`}>
      <div className={styles.image}>
        <Image
          src={product.image}
          alt={`${product.location} ${product.title}`}
          fill
          loading={priority ? "eager" : undefined}
          sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <span className={styles.imageCount}>▧ {product.imageCount}</span>
      </div>
      <div className={styles.content}>
        <h3>{product.location}: {product.title}</h3>
        <p>{product.tags}</p>
        <div className={styles.meta}>
          <span className={styles.seller}>
            <Image
              src={product.seller.profile}
              alt=""
              width={24}
              height={24}
            />
            {product.seller.name}
          </span>
          <strong>{product.price}</strong>
        </div>
      </div>
    </Link>
  );
}

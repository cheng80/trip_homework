import Image from "next/image";
import Link from "next/link";
import type { TravelProduct } from "@/types/travel-products";
import styles from "./travel-product-card.module.css";

type TravelProductCardProps = {
  product: TravelProduct;
  productId: number;
};

export default function TravelProductCard({ product, productId }: TravelProductCardProps) {
  return (
    <Link className={styles.card} href={`/travelproducts/${productId}`}>
      <div className={styles.image}>
        <Image
          src={product.image}
          alt={`${product.location} ${product.title}`}
          fill
          loading={productId === 1 ? "eager" : undefined}
          sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <span className={styles.imageCount}>▧ 2</span>
      </div>
      <div className={styles.content}>
        <h3>{product.location}: {product.title}</h3>
        <p>{product.tags}</p>
        <div className={styles.meta}>
          <span className={styles.seller}>
            <Image
              src={`/images/프로필 이미지/0${productId}.png`}
              alt=""
              width={24}
              height={24}
            />
            트립호스트
          </span>
          <strong>{product.price}</strong>
        </div>
      </div>
    </Link>
  );
}

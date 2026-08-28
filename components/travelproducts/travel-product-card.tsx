/**
 * 역할: 숙박권 한 건의 이미지, 위치, 이름, 가격과 상태를 표시하는 공통 카드입니다.
 * 처리 흐름: 상품 ID로 상세 링크를 만들고 판매 상태와 가격 형식을 일관되게 보여줍니다.
 * 주의사항: 카드 자체는 데이터 변경이나 네트워크 요청을 수행하지 않습니다.
 */
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

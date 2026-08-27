import Image from "next/image";
import type { TravelProductDetailData } from "@/types/travel-products";
import PurchaseActions from "./purchase-actions";
import styles from "./product-overview.module.css";

type ProductOverviewProps = {
  productId: string;
  product: TravelProductDetailData;
};

export default function ProductOverview({ productId, product }: ProductOverviewProps) {
  return (
    <section className={styles.product} aria-labelledby="product-title">
      <div className={styles.gallery}>
        <div className={styles.mainImage}>
          <Image
            src={product.images[0]}
            alt={`${product.location} ${product.title}`}
            fill
            priority
            sizes="(max-width: 780px) 100vw, 55vw"
          />
        </div>
        {product.images.slice(1).map((image, index) => (
          <div className={styles.subImage} key={image}>
            <Image
              src={image}
              alt={`숙소 상세 이미지 ${index + 2}`}
              fill
              sizes="(max-width: 780px) 33vw, 18vw"
            />
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <p className={styles.location}>{product.location}</p>
        <h1 id="product-title">{product.title}</h1>
        <p className={styles.tags}>{product.tags}</p>
        <strong className={styles.price}>{product.price}</strong>

        <div className={styles.seller}>
          <Image src={product.seller.profile} alt={`${product.seller.name} 프로필`} width={48} height={48} />
          <div>
            <span>판매자</span>
            <strong>{product.seller.name}</strong>
          </div>
        </div>

        <dl className={styles.info}>
          <div>
            <dt>사용 기한</dt>
            <dd>{product.validity}</dd>
          </div>
          <div>
            <dt>이용 인원</dt>
            <dd>{product.capacity}</dd>
          </div>
        </dl>

        <PurchaseActions
          productId={productId}
          price={product.price}
          currentPoints={product.currentPoints}
          sellerId={product.seller.id}
          initialPickedCount={product.pickedCount ?? 0}
        />
      </div>
    </section>
  );
}

/**
 * 역할: 인기 숙박권을 가로 카드 목록으로 보여주는 추천 섹션입니다.
 * 처리 흐름: 상품 판매 여부에 맞는 상태 문구를 계산해 공통 상품 카드에 전달합니다.
 * 주의사항: 정렬과 조회는 서버 페이지에서 완료된 데이터를 사용합니다.
 */
import Image from "next/image";
import SectionTitle from "@/components/commons/section-title";
import type { TravelProduct } from "@/types/travel-products";
import styles from "./featured-products.module.css";

type FeaturedProductsProps = {
  products: TravelProduct[];
};

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section aria-labelledby="season-title">
      <SectionTitle as="h1" id="season-title">
        2024 끝여름 낭만있게 마무리 하고 싶다면?
      </SectionTitle>
      <div className={styles.grid}>
        {products.slice(0, 2).map((product, index) => (
          <article className={styles.card} key={product.id}>
            <Image
              src={product.image}
              alt=""
              fill
              priority={index === 0}
              loading={index === 0 ? undefined : "eager"}
              sizes="(max-width: 780px) 100vw, 50vw"
            />
            <div className={styles.content}>
              <strong>{product.location}: {product.title}</strong>
              <span>{product.price}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

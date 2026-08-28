/**
 * 역할: 최근 본 숙박권 영역을 현재 상품 데이터로 구성합니다.
 * 처리 흐름: 표시 가능한 일부 상품을 작은 카드 형태로 반복 렌더링합니다.
 * 주의사항: 별도 브라우저 기록 저장 없이 전달된 목록을 사용합니다.
 */
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

/**
 * 역할: 카테고리, 검색 폼과 숙박권 카드 그리드를 묶는 목록 본문입니다.
 * 처리 흐름: 검색어·카테고리를 URL 링크와 GET 폼으로 유지하고 상품별 상태와 가격을 카드에 전달합니다.
 * 주의사항: 검색 실행은 GET 폼으로 URL을 갱신해 서버 조회와 동기화합니다.
 */
import Image from "next/image";
import Link from "next/link";
import DateRangeField from "@/components/commons/date-range-field";
import SectionTitle from "@/components/commons/section-title";
import type { TravelCategory, TravelProduct } from "@/types/travel-products";
import TravelProductCard from "./travel-product-card";
import styles from "./product-catalog.module.css";

type ProductCatalogProps = {
  categories: TravelCategory[];
  products: TravelProduct[];
  search?: string;
  startDate?: string;
  endDate?: string;
  selectedCategory?: string;
};

export default function ProductCatalog({
  categories,
  products,
  search = "",
  startDate = "",
  endDate = "",
  selectedCategory = "",
}: ProductCatalogProps) {
  const catalogQuery = (nextCategory = "") => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (nextCategory) params.set("category", nextCategory);
    const query = params.toString();
    return query ? `/travelproducts?${query}` : "/travelproducts";
  };
  return (
    <section aria-labelledby="exclusive-title">
      <SectionTitle as="h2" id="exclusive-title">여기에서만 예약할 수 있는 숙소</SectionTitle>

      <div className={styles.tabs}>
        <span className={styles.activeTab}>여행 가능 숙소</span>
        <span>예약 마감 숙소</span>
      </div>

      <form className={styles.filters} action="/travelproducts">
        {selectedCategory ? <input type="hidden" name="category" value={selectedCategory} /> : null}
        <DateRangeField
          className={styles.field}
          label="여행 날짜"
          startName="startDate"
          endName="endDate"
          startDate={startDate}
          endDate={endDate}
        />

        <label className={styles.srOnly} htmlFor="keyword">숙소 검색어</label>
        <div className={`${styles.field} ${styles.searchField}`}>
          <Image src="/icon/outline/search.svg" alt="" width={20} height={20} />
          <input id="keyword" name="q" defaultValue={search} placeholder="지역을 검색해 주세요." />
        </div>

        <button className={styles.searchButton} type="submit">검색</button>
        <Link className={styles.sellButton} href="/travelproducts/new">숙박권 판매하기</Link>
      </form>

      <ul className={styles.categories} aria-label="숙소 유형">
        {categories.map(([label, icon]) => {
          const isActive = selectedCategory === label;
          const href = isActive
            ? catalogQuery()
            : catalogQuery(label);

          return (
            <li className={isActive ? styles.activeCategory : ""} key={label}>
              <Link href={href} scroll={false} aria-current={isActive ? "page" : undefined}>
                <Image src={`/icon/outline/${icon}`} alt="" width={24} height={24} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className={styles.productGrid}>
        {products.length > 0 ? products.map((product, index) => (
          <TravelProductCard product={product} eager={index === 0} key={product.id} />
        )) : (
          <div className={styles.empty}>
            <strong>검색 결과가 없습니다.</strong>
            <span>날짜 또는 검색어를 바꿔 다시 검색해 주세요.</span>
          </div>
        )}
      </div>
    </section>
  );
}

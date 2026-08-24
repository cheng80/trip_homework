import Image from "next/image";
import styles from "./styles.module.css";

const categories = [
  "1인 전용",
  "아파트",
  "호텔",
  "캠핑",
  "룸 서비스 가능",
  "불멍",
  "반신욕&스파",
  "바다 위 숙소",
  "플랜테리어",
];

export default function TravelProductsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.banner}>
        <Image
          src="/images/배너 이미지/01.png"
          alt="푸른 바다와 파라솔"
          fill
          priority
          sizes="100vw"
        />
      </section>

      <div className={styles.container}>
        <h1>숙박권 구매</h1>

        <section className={styles.searchArea} aria-label="숙박권 검색">
          <input aria-label="여행 날짜" placeholder="YYYY. MM. DD - YYYY. MM. DD" />
          <input aria-label="숙소 검색어" placeholder="지역을 검색해 주세요." />
          <button type="button">검색</button>
          <button className={styles.sellButton} type="button">
            숙박권 판매하기
          </button>
        </section>

        <ul className={styles.categories} aria-label="숙소 유형">
          {categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>

        {/* 숙박권 카드 목록은 다음 작업에서 구현 */}
      </div>
    </main>
  );
}

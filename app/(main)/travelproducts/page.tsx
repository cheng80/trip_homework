import Image from "next/image";
import styles from "./styles.module.css";

const categories = [
  ["1인 전용", "Single-person-accommodation.svg"],
  ["아파트", "apartment.svg"],
  ["호텔", "hotel.svg"],
  ["캠핑", "camp.svg"],
  ["룸 서비스 가능", "room-service.svg"],
  ["불멍", "fire.svg"],
  ["반신욕&스파", "spa.svg"],
  ["바다 위 숙소", "house-on-the-sea.svg"],
  ["플랜테리어", "planterior.svg"],
];

const products = [
  {
    image: "a.png",
    location: "포항",
    title: "당장 가고 싶은 숲속 감성 스테이",
    tags: "#플랜테리어 #룸서비스",
    price: "32,900원",
  },
  {
    image: "b.png",
    location: "강릉",
    title: "마을까지 깨끗해지는 하얀 숙소",
    tags: "#바다위숙소 #반신욕&스파",
    price: "32,900원",
  },
  {
    image: "c.png",
    location: "제주",
    title: "조용히 쉬어 가기 좋은 작은 호텔",
    tags: "#호텔 #플랜테리어",
    price: "49,000원",
  },
  {
    image: "d.png",
    location: "서울",
    title: "햇살이 머무는 하루를 위한 아지트",
    tags: "#1인전용 #룸서비스",
    price: "38,500원",
  },
];

const imagePath = "/images/숙박권 구매화면 이미지";

export default function TravelProductsPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-label="추천 여행지">
        <Image
          src="/images/배너 이미지/01.png"
          alt="푸른 바다와 오렌지색 파라솔이 있는 해변"
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.heroText}>
          <p>나를 위한 잠깐의 쉼</p>
          <strong>이번 주말, 어디로 떠나볼까요?</strong>
        </div>
        <span className={styles.indicator} aria-hidden="true" />
      </section>

      <div className={styles.content}>
        <section aria-labelledby="season-title">
          <h1 id="season-title" className={styles.sectionTitle}>
            2024 끝여름 낭만있게 마무리 하고 싶다면?
          </h1>
          <div className={styles.featuredGrid}>
            {products.slice(0, 2).map((product) => (
              <article className={styles.featuredCard} key={product.image}>
                <Image
                  src={`${imagePath}/${product.image}`}
                  alt=""
                  fill
                  sizes="(max-width: 780px) 100vw, 50vw"
                />
                <div className={styles.featuredContent}>
                  <strong>
                    {product.location}: {product.title}
                  </strong>
                  <span>{product.price}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className={styles.promotion}>
          <Image
            src="/images/배너 이미지/03.png"
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div className={styles.promotionContent}>
            <span>솔로트립 독점 숙소</span>
            <span>9.24 얼리버드 오픈 예약</span>
            <strong>
              천만 관객이 사랑한
              <br />빌 페소 르꼬 전시회 근처 숙소 특가 예약
            </strong>
          </div>
        </aside>

        <section aria-labelledby="exclusive-title">
          <h2 id="exclusive-title" className={styles.sectionTitle}>
            여기에서만 예약할 수 있는 숙소
          </h2>

          <div className={styles.tabs}>
            <span className={styles.activeTab}>여행 가능 숙소</span>
            <span>예약 마감 숙소</span>
          </div>

          <form className={styles.filters} action="/travelproducts">
            <label className={styles.srOnly} htmlFor="dates">
              여행 날짜
            </label>
            <div className={styles.field}>
              <Image
                src="/icon/outline/calendar.svg"
                alt=""
                width={20}
                height={20}
              />
              <input id="dates" name="dates" placeholder="YYYY. MM. DD - YYYY. MM. DD" />
            </div>

            <label className={styles.srOnly} htmlFor="keyword">
              숙소 검색어
            </label>
            <div className={`${styles.field} ${styles.searchField}`}>
              <Image
                src="/icon/outline/search.svg"
                alt=""
                width={20}
                height={20}
              />
              <input id="keyword" name="q" placeholder="지역을 검색해 주세요." />
            </div>

            <button className={styles.searchButton} type="submit">
              검색
            </button>
            <span className={styles.sellButton}>숙박권 판매하기</span>
          </form>

          <ul className={styles.categories} aria-label="숙소 유형">
            {categories.map(([label, icon], index) => (
              <li className={index === 0 ? styles.activeCategory : ""} key={label}>
                <Image
                  src={`/icon/outline/${icon}`}
                  alt=""
                  width={24}
                  height={24}
                />
                <span>{label}</span>
              </li>
            ))}
          </ul>

          <div className={styles.productGrid}>
            {products.map((product, index) => (
              <article className={styles.productCard} key={product.image}>
                <div className={styles.productImage}>
                  <Image
                    src={`${imagePath}/${product.image}`}
                    alt={`${product.location} ${product.title}`}
                    fill
                    sizes="(max-width: 600px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <span className={styles.imageCount}>▧ 2</span>
                </div>
                <div className={styles.productContent}>
                  <h3>
                    {product.location}: {product.title}
                  </h3>
                  <p>{product.tags}</p>
                  <div className={styles.productMeta}>
                    <span className={styles.seller}>
                      <Image
                        src={`/images/프로필 이미지/0${index + 1}.png`}
                        alt=""
                        width={24}
                        height={24}
                      />
                      트립호스트
                    </span>
                    <strong>{product.price}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

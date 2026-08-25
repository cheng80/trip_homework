"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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

const banners = [
  {
    image: "01.png",
    eyebrow: "나를 위한 잠깐의 쉼",
    title: "이번 주말, 어디로 떠나볼까요?",
    alt: "푸른 바다와 오렌지색 파라솔이 있는 해변",
  },
  {
    image: "02.png",
    eyebrow: "일상에서 한 걸음 멀리",
    title: "오래 기억될 하루를 만나보세요",
    alt: "여행지 풍경",
  },
  {
    image: "03.png",
    eyebrow: "지금 떠나기 좋은 곳",
    title: "나만의 숙소를 찾아보세요",
    alt: "여행 숙소 풍경",
  },
];

export default function TravelProductsPage() {
  const [bannerIndex, setBannerIndex] = useState(0);
  const banner = banners[bannerIndex];

  const moveBanner = (direction: number) => {
    setBannerIndex((current) => (current + direction + banners.length) % banners.length);
  };

  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-label="추천 여행지">
        <Image
          key={banner.image}
          src={`/images/배너 이미지/${banner.image}`}
          alt={banner.alt}
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.heroText}>
          <p>{banner.eyebrow}</p>
          <strong>{banner.title}</strong>
        </div>
        <div className={styles.heroControls}>
          <button type="button" onClick={() => moveBanner(-1)} aria-label="이전 배너">
            <Image src="/icon/outline/left_arrow.svg" alt="" width={24} height={24} />
          </button>
          <div
            className={styles.dots}
            role="group"
            aria-label={`${bannerIndex + 1} / ${banners.length}`}
          >
            {banners.map((item, index) => (
              <button
                className={index === bannerIndex ? styles.activeDot : ""}
                type="button"
                onClick={() => setBannerIndex(index)}
                aria-label={`${index + 1}번 배너 보기`}
                aria-current={index === bannerIndex ? "true" : undefined}
                key={item.image}
              />
            ))}
          </div>
          <button type="button" onClick={() => moveBanner(1)} aria-label="다음 배너">
            <Image src="/icon/outline/right_arrow.svg" alt="" width={24} height={24} />
          </button>
        </div>
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
                  loading="eager"
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
            <Link className={styles.sellButton} href="/travelproducts/new">
              숙박권 판매하기
            </Link>
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
              <Link
                className={styles.productCard}
                href={`/travelproducts/${index + 1}`}
                key={product.image}
              >
                <div className={styles.productImage}>
                  <Image
                    src={`${imagePath}/${product.image}`}
                    alt={`${product.location} ${product.title}`}
                    fill
                    loading={index === 0 ? "eager" : undefined}
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
              </Link>
            ))}
          </div>
        </section>
      </div>

      <aside className={styles.recent} aria-label="최근 본 숙박권">
        <strong>최근 본</strong>
        {products.slice(0, 3).map((product, index) => (
          <Link href={`/travelproducts/${index + 1}`} key={product.image}>
            <Image
              src={`${imagePath}/${product.image}`}
              alt={`${product.location} 숙박권`}
              fill
              sizes="56px"
            />
          </Link>
        ))}
      </aside>
    </main>
  );
}

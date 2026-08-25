"use client";

import Image from "next/image";
import { useState } from "react";
import type { TravelBanner } from "@/types/travel-products";
import styles from "./hero-banner.module.css";

type HeroBannerProps = {
  banners: TravelBanner[];
};

export default function HeroBanner({ banners }: HeroBannerProps) {
  const [bannerIndex, setBannerIndex] = useState(0);
  const banner = banners[bannerIndex];

  if (!banner) return null;

  const moveBanner = (direction: number) => {
    setBannerIndex((current) => (current + direction + banners.length) % banners.length);
  };

  return (
    <section className={styles.hero} aria-label="추천 여행지">
      <Image
        key={banner.image}
        src={banner.image}
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
  );
}

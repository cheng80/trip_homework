import Image from "next/image";
import styles from "./promotion-banner.module.css";

export default function PromotionBanner() {
  return (
    <aside className={styles.promotion}>
      <Image
        src="/images/배너 이미지/03.png"
        alt=""
        fill
        sizes="(max-width: 1280px) 100vw, 1280px"
      />
      <div className={styles.content}>
        <span>솔로트립 독점 숙소</span>
        <span>9.24 얼리버드 오픈 예약</span>
        <strong>
          천만 관객이 사랑한
          <br />빌 페소 르꼬 전시회 근처 숙소 특가 예약
        </strong>
      </div>
    </aside>
  );
}

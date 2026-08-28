/**
 * 역할: 숙박권 목록 중간의 정적 프로모션 메시지를 표시합니다.
 * 처리 흐름: 배경 이미지와 예약 유도 문구를 하나의 시각적 배너로 제공합니다.
 * 주의사항: 데이터나 상호작용이 없는 장식성 콘텐츠입니다.
 */
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

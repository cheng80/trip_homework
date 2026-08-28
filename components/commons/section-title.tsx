/**
 * 역할: 화면 섹션 제목과 선택적 보조 링크를 일관된 레이아웃으로 표시합니다.
 * 처리 흐름: 제목 수준과 링크 문구를 호출부 데이터로 받아 재사용합니다.
 * 주의사항: 데이터 조회나 상태를 갖지 않는 표시 전용 컴포넌트입니다.
 */
import type { ReactNode } from "react";
import styles from "./section-title.module.css";

type SectionTitleProps = {
  as: "h1" | "h2";
  id: string;
  children: ReactNode;
};

export default function SectionTitle({ as: Title, id, children }: SectionTitleProps) {
  return <Title className={styles.title} id={id}>{children}</Title>;
}

/**
 * 역할: 이전 목록이나 상위 화면으로 이동하는 공통 링크입니다.
 * 처리 흐름: 일관된 뒤로가기 아이콘과 스타일을 제공하면서 목적지와 문구는 호출부에서 받습니다.
 * 주의사항: 실제 URL을 가진 Link를 사용해 키보드와 새 탭 탐색을 지원합니다.
 */
import Image from "next/image";
import Link from "next/link";
import styles from "./back-link.module.css";

type BackLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function BackLink({ href, children, className = "" }: BackLinkProps) {
  return (
    <Link className={`${styles.backLink} ${className}`} href={href}>
      <Image src="/icon/outline/left_arrow.svg" alt="" width={20} height={20} />
      {children}
    </Link>
  );
}

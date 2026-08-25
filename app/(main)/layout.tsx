import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./layout.module.css";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link className={styles.logo} href="/" aria-label="트립트립 홈">
            <Image src="/logo/logo.svg" alt="" width={164} height={112} />
          </Link>

          <nav className={styles.navigation} aria-label="주 메뉴">
            <span>트립토크</span>
            <Link href="/travelproducts" aria-current="page">
              숙박권 구매
            </Link>
            <span>마이 페이지</span>
          </nav>

          <span className={styles.login}>로그인</span>
          <Image
            className={styles.mobileMenu}
            src="/icon/outline/menu.svg"
            alt=""
            width={24}
            height={24}
          />
        </div>
      </header>
      {children}
    </>
  );
}

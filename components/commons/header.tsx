"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.logo} href="/" aria-label="트립트립 홈">
          <Image src="/logo/logo.svg" alt="" width={164} height={112} />
        </Link>

        <nav className={styles.navigation} aria-label="주 메뉴">
          <Link href="/boards" aria-current={pathname.startsWith("/boards") ? "page" : undefined}>
            트립토크
          </Link>
          <Link
            href="/travelproducts"
            aria-current={pathname.startsWith("/travelproducts") ? "page" : undefined}
          >
            숙박권 구매
          </Link>
          <Link href="/mypage" aria-current={pathname.startsWith("/mypage") ? "page" : undefined}>
            마이 페이지
          </Link>
        </nav>

        <Link className={styles.login} href="/login">로그인</Link>
        <Image
          className={styles.mobileMenu}
          src="/icon/outline/menu.svg"
          alt=""
          width={24}
          height={24}
        />
      </div>
    </header>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MypageMember } from "@/types/mypage";
import styles from "./header.module.css";

const navigationItems = [
  ["트립토크", "/boards"],
  ["숙박권 구매", "/travelproducts"],
  ["마이 페이지", "/mypage"],
] as const;

export default function Header({ user }: { user: MypageMember }) {
  const pathname = usePathname();
  const isLoggedIn = pathname.startsWith("/mypage");

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.logo} href="/" aria-label="트립트립 홈">
          <Image src="/logo/logo.svg" alt="" width={164} height={112} />
        </Link>

        <nav className={styles.navigation} aria-label="주 메뉴">
          {navigationItems.map(([label, href]) => (
            <Link href={href} aria-current={pathname.startsWith(href) ? "page" : undefined} key={href}>
              {label}
            </Link>
          ))}
        </nav>

        {isLoggedIn ? (
          <details className={styles.profile}>
            <summary aria-label="프로필 메뉴">
              <Image
                className={styles.profileImage}
                src={user.profile}
                alt=""
                width={36}
                height={36}
              />
              <Image
                className={styles.profileArrow}
                src="/icon/filled/down_arrow.svg"
                alt=""
                width={16}
                height={16}
              />
            </summary>

            <div className={styles.profileMenu}>
              <Link className={styles.profileInfo} href="/mypage">
                <Image src={user.profile} alt="" width={44} height={44} />
                <span>
                  <strong>{user.name}님</strong>
                  <small>{user.email}</small>
                </span>
              </Link>
              <Link className={styles.profileRow} href="/mypage?section=points">
                <Image src="/icon/outline/point.svg" alt="" width={22} height={22} />
                <strong>{user.points.toLocaleString()} P</strong>
              </Link>
              <Link className={styles.profileRow} href="/mypage?charge=1">
                <Image src="/icon/filled/charge.svg" alt="" width={22} height={22} />
                포인트 충전
              </Link>
              <Link className={styles.profileRow} href="/login">
                <Image src="/icon/outline/logout.svg" alt="" width={22} height={22} />
                로그아웃
              </Link>
            </div>
          </details>
        ) : (
          <Link className={styles.login} href="/login">
            로그인 <span aria-hidden="true">›</span>
          </Link>
        )}

        <details className={styles.mobileNavigation}>
          <summary aria-label="모바일 메뉴">
            <Image src="/icon/outline/menu.svg" alt="" width={24} height={24} />
          </summary>
          <div className={styles.mobilePanel}>
            <nav aria-label="모바일 주 메뉴">
              {navigationItems.map(([label, href]) => (
                <Link
                  href={href}
                  aria-current={pathname.startsWith(href) ? "page" : undefined}
                  key={href}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className={styles.mobileAuth}>
              {isLoggedIn ? (
                <>
                  <Link className={styles.mobileProfile} href="/mypage">
                    <Image src={user.profile} alt="" width={40} height={40} />
                    <span>
                      <strong>{user.name}님</strong>
                      <small>{user.points.toLocaleString()} P</small>
                    </span>
                  </Link>
                  <Link href="/login">로그아웃</Link>
                </>
              ) : (
                <Link href="/login">로그인</Link>
              )}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}

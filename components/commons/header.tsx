/**
 * 역할: 주요 서비스 라우트를 연결하는 공통 헤더입니다.
 * 처리 흐름: 현재 경로를 기준으로 활성 메뉴를 표시하고 데스크톱·모바일 탐색 구조를 공유합니다.
 * 주의사항: 인증 복구가 끝나기 전에는 로그인 버튼을 확정하지 않습니다.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getLoggedInUser, logout } from "@/services/account";
import { useAuthStore } from "@/stores/auth-store";
import type { MypageMember } from "@/types/mypage";
import styles from "./header.module.css";

const navigationItems = [
  ["트립토크", "/boards"],
  ["숙박권 구매", "/travelproducts"],
  ["마이 페이지", "/mypage"],
] as const;

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const accessToken = useAuthStore((store) => store.accessToken);
  const isAuthReady = useAuthStore((store) => store.isAuthReady);
  const clearAuth = useAuthStore((store) => store.clearAuth);
  const [user, setUser] = useState<MypageMember | null>(null);

  useEffect(() => {
    if (!isAuthReady || !accessToken) return;
    getLoggedInUser().then(setUser).catch(() => setUser(null));
  }, [accessToken, isAuthReady, pathname]);
  const visibleUser = accessToken ? user : null;

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearAuth();
      setUser(null);
      router.replace("/login");
      router.refresh();
    }
  };

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

        {visibleUser ? (
          <details className={styles.profile}>
            <summary aria-label="프로필 메뉴">
              <Image
                className={styles.profileImage}
                src={visibleUser.profile}
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
                <Image src={visibleUser.profile} alt="" width={44} height={44} />
                <span>
                  <strong>{visibleUser.name}님</strong>
                  <small>{visibleUser.email}</small>
                </span>
              </Link>
              <Link className={styles.profileRow} href="/mypage?section=points">
                <Image src="/icon/outline/point.svg" alt="" width={22} height={22} />
                <strong>{visibleUser.points.toLocaleString()} P</strong>
              </Link>
              <Link className={styles.profileRow} href="/mypage?charge=1">
                <Image src="/icon/filled/charge.svg" alt="" width={22} height={22} />
                포인트 충전
              </Link>
              <Link className={styles.profileRow} href="/login" onClick={(event) => {
                event.preventDefault();
                void handleLogout();
              }}>
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
              {visibleUser ? (
                <>
                  <Link className={styles.mobileProfile} href="/mypage">
                    <Image src={visibleUser.profile} alt="" width={40} height={40} />
                    <span>
                      <strong>{visibleUser.name}님</strong>
                      <small>{visibleUser.points.toLocaleString()} P</small>
                    </span>
                  </Link>
                  <Link href="/login" onClick={(event) => {
                    event.preventDefault();
                    void handleLogout();
                  }}>로그아웃</Link>
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

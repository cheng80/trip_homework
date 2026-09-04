/**
 * 역할: 애플리케이션 전체 HTML 문서와 전역 스타일을 정의하는 루트 레이아웃입니다.
 * 처리 흐름: 메타데이터, 한국어 문서 언어, Quill 테마와 공통 CSS를 모든 라우트에 적용합니다.
 * 주의사항: 새로고침 시 access token 복구는 루트에서 한 번 수행하고, 라우트별 헤더는 하위 레이아웃에 둡니다.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "react-quill-new/dist/quill.snow.css";
import AuthRestore from "@/components/auth/auth-restore";
import "./globals.css";

export const metadata: Metadata = {
  title: "TripTrip",
  description: "트립트립 숙박권 구매",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <AuthRestore />
        {children}
      </body>
    </html>
  );
}

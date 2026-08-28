/**
 * 역할: 애플리케이션 전체 HTML 문서와 전역 스타일을 정의하는 루트 레이아웃입니다.
 * 처리 흐름: 메타데이터, 한국어 문서 언어, Quill 테마와 공통 CSS를 모든 라우트에 적용합니다.
 * 주의사항: 라우트별 헤더와 인증 처리는 하위 레이아웃에 위임합니다.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "react-quill-new/dist/quill.snow.css";
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
      <body>{children}</body>
    </html>
  );
}

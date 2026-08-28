/**
 * 역할: 로그인 이후 주요 화면이 공유하는 레이아웃입니다.
 * 처리 흐름: 공통 헤더를 먼저 렌더링하고 각 라우트의 본문을 그 아래에 배치합니다.
 * 주의사항: 인증 여부 판단은 필요한 개별 서버 페이지에서 수행합니다.
 */
import type { ReactNode } from "react";
import Header from "@/components/commons/header";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

/**
 * 역할: 마이페이지 접근 권한과 최초 탭 상태를 결정하는 서버 컴포넌트입니다.
 * 처리 흐름: 쿠키 기반 인증 세션을 먼저 확인하고 URL 파라미터를 화면 섹션으로 변환합니다.
 * 주의사항: 인증이 없으면 데이터를 노출하기 전에 로그인 화면으로 이동합니다.
 */
import Mypage from "@/components/mypage/mypage";
import { mypageData } from "@/data/mypage";
import { requireAuthSession } from "@/services/server-auth";
import type { MypageSection } from "@/types/mypage";

type MypagePageProps = {
  searchParams: Promise<{ charge?: string; section?: string }>;
};

export default async function MypagePage({ searchParams }: MypagePageProps) {
  await requireAuthSession();
  const params = await searchParams;
  const initialSection: MypageSection = params.section === "points" || params.section === "password"
    ? params.section
    : "overview";

  return (
    <Mypage
      {...mypageData}
      initialSection={initialSection}
      openChargeOnMount={params.charge === "1"}
    />
  );
}

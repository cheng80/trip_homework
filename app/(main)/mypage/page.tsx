import Mypage from "@/components/mypage/mypage";
import { mypageData } from "@/data/mypage";
import type { MypageSection } from "@/types/mypage";

type MypagePageProps = {
  searchParams: Promise<{ charge?: string; section?: string }>;
};

export default async function MypagePage({ searchParams }: MypagePageProps) {
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

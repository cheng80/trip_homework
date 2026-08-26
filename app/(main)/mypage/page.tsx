import Mypage from "@/components/mypage/mypage";
import { mypageData } from "@/data/mypage";

export default function MypagePage() {
  return <Mypage {...mypageData} />;
}

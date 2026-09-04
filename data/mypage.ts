/**
 * 역할: 마이페이지 최초 렌더링과 빈 상태에 사용할 정적 예시 데이터를 제공합니다.
 * 처리 흐름: 회원, 거래, 찜, 포인트 내역을 화면 타입에 맞춰 구성합니다.
 * 주의사항: API 조회 성공 후에는 실제 데이터가 이 값을 대체합니다.
 */
import { travelProducts } from "./travel-products";
import type { MypageData, MypagePointHistory, MypageProduct } from "@/types/mypage";

export const mypageMember = {
  id: "user-1",
  name: "김트립",
  email: "triptrip@email.com",
  profile: "/images/프로필 이미지/01.png",
  points: 125000,
};

const transactionStatuses = ["구매 완료", "판매 중", "구매 완료", "판매 완료"] as const;
const transactionDates = ["2026. 08. 24", "2026. 08. 21", "2026. 08. 18", "2026. 08. 12"];

export const mypageTransactions: MypageProduct[] = travelProducts.map((product, index) => ({
  ...product,
  date: transactionDates[index],
  status: transactionStatuses[index],
}));

export const mypageBookmarks: MypageProduct[] = travelProducts.slice(1).map((product) => ({
  ...product,
  date: "2026. 08. 24",
  status: "북마크",
}));

export const mypagePointHistory: MypagePointHistory[] = [
  { id: "1", date: "2026. 08. 24", description: "숙박권 구매", amount: -32900 },
  { id: "2", date: "2026. 08. 22", description: "포인트 충전", amount: 50000 },
  { id: "3", date: "2026. 08. 18", description: "숙박권 판매", amount: 49000 },
  { id: "4", date: "2026. 08. 10", description: "숙박권 구매", amount: -38500 },
  { id: "5", date: "2026. 07. 28", description: "포인트 충전", amount: 100000 },
  { id: "6", date: "2026. 07. 20", description: "숙박권 구매", amount: -32900 },
];

export const mypageData: MypageData = {
  member: mypageMember,
  transactions: mypageTransactions,
  bookmarks: mypageBookmarks,
  pointHistory: mypagePointHistory,
  boughtCount: mypageTransactions.filter((product) => product.status === "구매 완료").length,
  soldCount: mypageTransactions.filter((product) => product.status !== "구매 완료").length,
  bookmarkCount: mypageBookmarks.length,
};

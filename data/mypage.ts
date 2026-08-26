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
};

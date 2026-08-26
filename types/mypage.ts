import type { TravelProduct } from "./travel-products";

export type MypageMember = {
  id: string;
  name: string;
  email: string;
  profile: string;
  points: number;
};

export type MypageProduct = TravelProduct & {
  date: string;
  status: "구매 완료" | "판매 중" | "판매 완료" | "북마크";
};

export type MypagePointHistory = {
  id: string;
  date: string;
  description: string;
  amount: number;
};

export type MypageData = {
  member: MypageMember;
  transactions: MypageProduct[];
  bookmarks: MypageProduct[];
  pointHistory: MypagePointHistory[];
};

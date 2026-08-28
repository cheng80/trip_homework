/**
 * 역할: 마이페이지의 회원, 거래, 찜, 포인트와 섹션 상태 타입을 정의합니다.
 * 처리 흐름: API 데이터와 로컬 더미 충전 내역이 같은 화면 구조로 합쳐질 수 있게 합니다.
 * 주의사항: 표시 문자열과 식별자를 분리해 목록 갱신 시 안정적인 키를 제공합니다.
 */
import type { TravelProduct } from "./travel-products";

export type MypageSection = "overview" | "points" | "password";

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

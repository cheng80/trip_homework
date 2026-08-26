import Mypage, {
  type MypageMember,
  type MypagePointHistory,
  type MypageProduct,
} from "@/components/mypage/mypage";
import { travelProducts } from "@/data/travel-products";

const member: MypageMember = {
  name: "김트립",
  email: "triptrip@email.com",
  profile: "/images/프로필 이미지/01.png",
  points: 125000,
};

const products: MypageProduct[] = travelProducts.map((product, index) => ({
  ...product,
  productId: index + 1,
  date: ["2026. 08. 24", "2026. 08. 21", "2026. 08. 18", "2026. 08. 12"][index],
  status: ["구매 완료", "판매 중", "구매 완료", "판매 완료"][index],
}));

const pointHistory: MypagePointHistory[] = [
  { id: 1, date: "2026. 08. 24", description: "숙박권 구매", amount: -32900 },
  { id: 2, date: "2026. 08. 22", description: "포인트 충전", amount: 50000 },
  { id: 3, date: "2026. 08. 18", description: "숙박권 판매", amount: 49000 },
  { id: 4, date: "2026. 08. 10", description: "숙박권 구매", amount: -38500 },
  { id: 5, date: "2026. 07. 28", description: "포인트 충전", amount: 100000 },
  { id: 6, date: "2026. 07. 20", description: "숙박권 구매", amount: -32900 },
];

export default function MypagePage() {
  return <Mypage member={member} products={products} pointHistory={pointHistory} />;
}

import type {
  TravelBanner,
  TravelCategory,
  TravelProduct,
  TravelProductDetailData,
  TravelProductFormValues,
} from "@/types/travel-products";

const mockSeller = {
  name: "트립호스트",
  profile: "/images/프로필 이미지/01.png",
};

export const travelProducts: TravelProduct[] = [
  {
    id: "1",
    image: "/images/숙박권 구매화면 이미지/a.png",
    imageCount: 2,
    location: "포항",
    title: "당장 가고 싶은 숲속 감성 스테이",
    tags: "#플랜테리어 #룸서비스",
    price: "32,900원",
    seller: mockSeller,
  },
  {
    id: "2",
    image: "/images/숙박권 구매화면 이미지/b.png",
    imageCount: 2,
    location: "강릉",
    title: "마을까지 깨끗해지는 하얀 숙소",
    tags: "#바다위숙소 #반신욕&스파",
    price: "32,900원",
    seller: mockSeller,
  },
  {
    id: "3",
    image: "/images/숙박권 구매화면 이미지/c.png",
    imageCount: 2,
    location: "제주",
    title: "조용히 쉬어 가기 좋은 작은 호텔",
    tags: "#호텔 #플랜테리어",
    price: "49,000원",
    seller: mockSeller,
  },
  {
    id: "4",
    image: "/images/숙박권 구매화면 이미지/d.png",
    imageCount: 2,
    location: "서울",
    title: "햇살이 머무는 하루를 위한 아지트",
    tags: "#1인전용 #룸서비스",
    price: "38,500원",
    seller: mockSeller,
  },
];

export const travelCategories: TravelCategory[] = [
  ["1인 전용", "Single-person-accommodation.svg"],
  ["아파트", "apartment.svg"],
  ["호텔", "hotel.svg"],
  ["캠핑", "camp.svg"],
  ["룸 서비스 가능", "room-service.svg"],
  ["불멍", "fire.svg"],
  ["반신욕&스파", "spa.svg"],
  ["바다 위 숙소", "house-on-the-sea.svg"],
  ["플랜테리어", "planterior.svg"],
];

export const travelBanners: TravelBanner[] = [
  {
    image: "/images/배너 이미지/01.png",
    eyebrow: "나를 위한 잠깐의 쉼",
    title: "이번 주말, 어디로 떠나볼까요?",
    alt: "푸른 바다와 오렌지색 파라솔이 있는 해변",
  },
  {
    image: "/images/배너 이미지/02.png",
    eyebrow: "일상에서 한 걸음 멀리",
    title: "오래 기억될 하루를 만나보세요",
    alt: "여행지 풍경",
  },
  {
    image: "/images/배너 이미지/03.png",
    eyebrow: "지금 떠나기 좋은 곳",
    title: "나만의 숙소를 찾아보세요",
    alt: "여행 숙소 풍경",
  },
];

export const travelProductFormValues: TravelProductFormValues = {
  name: travelProducts[0].title,
  price: "32900",
  address: "경상북도 포항시 북구 송라면",
  detailAddress: "구매 완료 후 정확한 주소를 안내합니다.",
  description:
    "포항의 조용한 숲길 끝에 자리한 독채 숙소입니다. 객실과 테라스, 불멍 공간을 단독으로 이용할 수 있습니다.",
};

export const travelProductDetail: TravelProductDetailData = {
  images: travelProducts.map((product) => product.image) as [string, string, string, string],
  location: travelProducts[0].location,
  title: travelProducts[0].title,
  tags: "#플랜테리어 #룸서비스 #불멍",
  price: travelProducts[0].price,
  seller: mockSeller,
  validity: "2026. 09. 01 ~ 2026. 12. 31",
  capacity: "기준 2인 · 최대 4인",
  description:
    "포항의 조용한 숲길 끝에 자리한 독채 숙소입니다. 넓은 창으로 들어오는 햇살과 나무 향을 느끼며 온전히 쉬어갈 수 있어요. 객실과 테라스, 불멍 공간을 모두 단독으로 이용할 수 있습니다.",
  notes: [
    "체크인 15:00 · 체크아웃 11:00",
    "예약 확정 후 상세 이용 안내를 전달합니다.",
    "양도 숙박권 특성상 구매 전 사용 기한을 확인해 주세요.",
  ],
  address: "경상북도 포항시 북구 송라면",
  addressNote: "구매 완료 후 정확한 주소와 입실 안내를 확인할 수 있습니다.",
  inquiries: [
    {
      id: "1",
      writer: "여행하는 고양이",
      date: "2026-08-22",
      question: "주말에도 추가 비용 없이 사용할 수 있나요?",
      reply: "네, 사용 기한 안에는 주말에도 추가 비용 없이 이용할 수 있습니다.",
    },
    {
      id: "2",
      writer: "바다좋아",
      date: "2026-08-21",
      question: "반려동물 동반이 가능한가요?",
      editableReply: "소형견 한 마리까지 동반 가능합니다.",
    },
  ],
  currentPoints: "12,500P",
  shortfall: "20,400P",
};

/**
 * 역할: 숙박권 카드, 상세, 문의, 위치와 작성 폼에서 공유하는 화면 타입을 정의합니다.
 * 처리 흐름: 판매자·구매자와 주소 정보를 UI가 바로 사용할 수 있는 형태로 표현합니다.
 * 주의사항: GraphQL 원본 타입은 별도 파일에 두어 화면이 서버 필드명에 직접 결합되지 않게 합니다.
 */
export type TravelProduct = {
  id: string;
  image: string;
  imageCount: number;
  location: string;
  title: string;
  tags: string;
  price: string;
  pickedCount?: number;
  seller: { id?: string; name: string; profile: string };
};

export type TravelBanner = {
  image: string;
  eyebrow: string;
  title: string;
  alt: string;
};

export type TravelCategory = readonly [label: string, icon: string];

export type TravelProductFormValues = {
  name: string;
  price: string;
  address: string;
  detailAddress: string;
  description: string;
  remarks?: string;
  tags?: string[];
  zipcode?: string;
  images?: string[];
};

export type TravelInquiry = {
  id: string;
  writerId?: string;
  writer: string;
  date: string;
  question: string;
  answer?: TravelInquiryAnswer;
  reply?: string;
  editableReply?: string;
};

export type TravelInquiryAnswer = {
  id: string;
  writerId?: string;
  writer: string;
  contents: string;
  date: string;
};

export type TravelProductDetailData = {
  images: [string, string, string, string];
  location: string;
  title: string;
  tags: string;
  price: string;
  seller: { id?: string; name: string; profile: string };
  validity: string;
  capacity: string;
  description: string;
  notes: string[];
  address: string;
  addressNote: string;
  inquiries: TravelInquiry[];
  pickedCount?: number;
  currentPoints: string;
  shortfall: string;
};

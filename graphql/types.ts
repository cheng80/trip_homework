/**
 * 역할: 공용 GraphQL 서버 응답과 입력 객체의 TypeScript 형태를 정의합니다.
 * 처리 흐름: API 원본 필드명을 유지해 서비스 매퍼가 화면 타입으로 변환할 수 있게 합니다.
 * 주의사항: 화면 표시용 타입과 분리해 서버 스키마 변경의 영향을 경계 안에 가둡니다.
 */
export type ApiUser = {
  _id: string;
  email: string;
  name: string;
  picture?: string | null;
  userPoint?: { amount: number } | null;
};

export type ApiBoardAddress = {
  zipcode?: string | null;
  address?: string | null;
  addressDetail?: string | null;
};

export type ApiBoard = {
  _id: string;
  writer?: string | null;
  title: string;
  contents: string;
  youtubeUrl?: string | null;
  likeCount: number;
  dislikeCount: number;
  images?: string[] | null;
  boardAddress?: ApiBoardAddress | null;
  user?: ApiUser | null;
  createdAt: string;
  updatedAt?: string;
};

export type ApiBoardComment = {
  _id: string;
  writer?: string | null;
  contents: string;
  rating: number;
  user?: ApiUser | null;
  createdAt: string;
};

export type ApiTravelproductAddress = ApiBoardAddress & {
  lat?: number | null;
  lng?: number | null;
};

export type ApiTravelproduct = {
  _id: string;
  name: string;
  remarks: string;
  contents: string;
  price: number;
  tags?: string[] | null;
  images?: string[] | null;
  pickedCount: number;
  travelproductAddress?: ApiTravelproductAddress | null;
  buyer?: ApiUser | null;
  seller?: ApiUser | null;
  soldAt?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export type ApiTravelproductQuestion = {
  _id: string;
  contents: string;
  user?: ApiUser | null;
  createdAt: string;
};

export type ApiTravelproductQuestionAnswer = {
  _id: string;
  contents: string;
  user?: ApiUser | null;
  createdAt: string;
};

export type ApiPointTransaction = {
  _id: string;
  amount: number;
  balance: number;
  status?: string | null;
  statusDetail?: string | null;
  travelproduct?: ApiTravelproduct | null;
  createdAt: string;
};

export type BoardAddressInput = {
  zipcode?: string;
  address?: string;
  addressDetail?: string;
};

export type CreateBoardInput = {
  writer?: string;
  password?: string;
  title: string;
  contents: string;
  youtubeUrl?: string;
  boardAddress?: BoardAddressInput;
  images?: string[];
};

export type UpdateBoardInput = Partial<Omit<CreateBoardInput, "writer" | "password">>;

export type TravelproductAddressInput = BoardAddressInput & {
  lat?: number;
  lng?: number;
};

export type CreateTravelproductInput = {
  name: string;
  remarks: string;
  contents: string;
  price: number;
  tags?: string[];
  travelproductAddress?: TravelproductAddressInput;
  images?: string[];
};

export type UpdateTravelproductInput = Partial<CreateTravelproductInput>;

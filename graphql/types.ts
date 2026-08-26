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

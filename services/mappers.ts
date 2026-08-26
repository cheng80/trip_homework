import type {
  ApiBoard,
  ApiBoardComment,
  ApiPointTransaction,
  ApiTravelproduct,
  ApiTravelproductQuestion,
  ApiUser,
  CreateBoardInput,
  CreateTravelproductInput,
} from "../graphql/types";
import type { BoardComment, BoardDetailData, BoardFormValues, BoardPost } from "../types/boards";
import type { MypageMember, MypagePointHistory, MypageProduct } from "../types/mypage";
import type {
  TravelInquiry,
  TravelProduct,
  TravelProductDetailData,
  TravelProductFormValues,
} from "../types/travel-products";

const defaultProfile = "/images/프로필 이미지/01.png";
const defaultBoardImages = [
  "/images/트립토크 상세화면 이미지/01.png",
  "/images/트립토크 상세화면 이미지/02.png",
] as const;
const defaultProductImages = [
  "/images/숙박권 구매화면 이미지/a.png",
  "/images/숙박권 구매화면 이미지/b.png",
  "/images/숙박권 구매화면 이미지/c.png",
  "/images/숙박권 구매화면 이미지/d.png",
] as const;

export function normalizeImageUrl(value: string | null | undefined, fallback: string) {
  if (!value) return fallback;
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) return value;
  return `https://storage.googleapis.com/${value}`;
}

const dateOnly = (value: string) => value.slice(0, 10);
const writerName = (writer: string | null | undefined, user?: ApiUser | null) => writer || user?.name || "익명";

export function mapBoardPost(board: ApiBoard): BoardPost {
  return {
    id: board._id,
    title: board.title,
    writer: writerName(board.writer, board.user),
    date: dateOnly(board.createdAt),
    likes: board.likeCount,
  };
}

export function mapBoardComment(comment: ApiBoardComment): BoardComment {
  return {
    id: comment._id,
    writer: writerName(comment.writer, comment.user),
    date: dateOnly(comment.createdAt).replaceAll("-", "."),
    contents: comment.contents,
    profile: normalizeImageUrl(comment.user?.picture, defaultProfile),
  };
}

export function mapBoardDetail(board: ApiBoard, comments: ApiBoardComment[]): BoardDetailData {
  const paragraphs = board.contents.split(/\n\s*\n/).filter(Boolean);
  const images = [0, 1].map((index) => ({
    src: normalizeImageUrl(board.images?.[index], defaultBoardImages[index]),
    alt: `${board.title} 여행 사진 ${index + 1}`,
  })) as BoardDetailData["images"];

  return {
    title: board.title,
    writer: writerName(board.writer, board.user),
    date: dateOnly(board.createdAt),
    profile: normalizeImageUrl(board.user?.picture, defaultProfile),
    paragraphs: [paragraphs[0] ?? "", paragraphs.slice(1).join("\n\n")],
    images,
    location: [board.boardAddress?.address, board.boardAddress?.addressDetail].filter(Boolean).join(" ") || "위치 정보 없음",
    likes: board.likeCount,
    dislikes: board.dislikeCount,
    comments: comments.map(mapBoardComment),
  };
}

export function mapTravelProduct(product: ApiTravelproduct): TravelProduct {
  return {
    id: product._id,
    image: normalizeImageUrl(product.images?.[0], defaultProductImages[0]),
    imageCount: product.images?.length || 1,
    location: product.travelproductAddress?.address || "지역 미정",
    title: product.name,
    tags: (product.tags ?? []).map((tag) => tag.startsWith("#") ? tag : `#${tag}`).join(" "),
    price: `${product.price.toLocaleString("ko-KR")}원`,
    seller: {
      name: product.seller?.name || "판매자",
      profile: normalizeImageUrl(product.seller?.picture, defaultProfile),
    },
  };
}

export function mapTravelInquiry(question: ApiTravelproductQuestion): TravelInquiry {
  return {
    id: question._id,
    writer: question.user?.name || "익명",
    date: dateOnly(question.createdAt),
    question: question.contents,
  };
}

export function mapTravelProductDetail(
  product: ApiTravelproduct,
  questions: ApiTravelproductQuestion[],
): TravelProductDetailData {
  const summary = mapTravelProduct(product);
  const images = [0, 1, 2, 3].map((index) => (
    normalizeImageUrl(product.images?.[index], defaultProductImages[index])
  )) as TravelProductDetailData["images"];

  return {
    images,
    location: summary.location,
    title: summary.title,
    tags: summary.tags,
    price: summary.price,
    seller: summary.seller,
    validity: "사용 기한은 판매자에게 확인해 주세요.",
    capacity: product.remarks,
    description: product.contents,
    notes: [product.remarks].filter(Boolean),
    address: [product.travelproductAddress?.address, product.travelproductAddress?.addressDetail].filter(Boolean).join(" ") || "주소 정보 없음",
    addressNote: "구매 전 판매자에게 상세 위치를 확인해 주세요.",
    inquiries: questions.map(mapTravelInquiry),
    currentPoints: "0P",
    shortfall: "0P",
  };
}

export function mapMypageMember(user: ApiUser): MypageMember {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    profile: normalizeImageUrl(user.picture, defaultProfile),
    points: user.userPoint?.amount ?? 0,
  };
}

export function mapMypageProduct(
  product: ApiTravelproduct,
  status: MypageProduct["status"],
): MypageProduct {
  return { ...mapTravelProduct(product), date: dateOnly(product.soldAt || product.createdAt), status };
}

export function mapPointTransaction(transaction: ApiPointTransaction): MypagePointHistory {
  return {
    id: transaction._id,
    date: dateOnly(transaction.createdAt).replaceAll("-", ". "),
    description: transaction.statusDetail || transaction.status || transaction.travelproduct?.name || "포인트 내역",
    amount: transaction.amount,
  };
}

export function createBoardInputFromForm(values: BoardFormValues): CreateBoardInput {
  return {
    title: values.title.trim(),
    contents: values.contents.trim(),
    youtubeUrl: values.youtubeUrl?.trim() || undefined,
    boardAddress: {
      zipcode: values.zipcode,
      address: values.address.trim(),
      addressDetail: values.detailAddress.trim(),
    },
    images: values.images,
  };
}

export function createTravelproductInputFromForm(
  values: TravelProductFormValues,
): CreateTravelproductInput {
  const contents = values.description.trim();
  return {
    name: values.name.trim(),
    remarks: values.remarks?.trim() || contents.split("\n")[0].slice(0, 100),
    contents,
    price: Number(values.price),
    tags: values.tags,
    travelproductAddress: {
      zipcode: values.zipcode,
      address: values.address.trim(),
      addressDetail: values.detailAddress.trim(),
    },
    images: values.images,
  };
}

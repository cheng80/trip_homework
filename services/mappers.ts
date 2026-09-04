/**
 * 역할: GraphQL API 원본 데이터를 화면에서 사용하는 게시글·상품·회원 모델로 변환합니다.
 * 처리 흐름: 날짜·가격·이미지 URL·작성자 이름의 누락값을 일관된 기본값으로 정규화합니다.
 * 주의사항: 서버 스키마와 UI 타입 사이의 차이는 이 파일에서만 흡수하는 것을 원칙으로 합니다.
 */
import type {
  ApiBoard,
  ApiBoardComment,
  ApiPointTransaction,
  ApiTravelproduct,
  ApiTravelproductQuestion,
  ApiTravelproductQuestionAnswer,
  ApiUser,
  CreateBoardInput,
  CreateTravelproductInput,
} from "../graphql/types";
import type { BoardComment, BoardDetailData, BoardFormValues, BoardPost } from "../types/boards";
import type { MypageMember, MypagePointHistory, MypageProduct } from "../types/mypage";
import type {
  TravelInquiry,
  TravelInquiryAnswer,
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

/**
 * API가 절대 URL과 저장소 상대 경로를 혼용하므로 브라우저가 표시할 수 있는 한 형식으로 맞춥니다.
 * 값이 없으면 호출부가 지정한 화면별 기본 이미지를 반환합니다.
 */
export function normalizeImageUrl(value: string | null | undefined, fallback: string) {
  if (!value) return fallback;
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("/")) return value;
  return `https://storage.googleapis.com/${value}`;
}

const dateOnly = (value: string) => value.slice(0, 10);
const writerName = (writer: string | null | undefined, user?: ApiUser | null) => writer || user?.name || "익명";

// 게시글 목록·댓글·상세·폼은 같은 API 객체를 각 화면에 필요한 크기로 변환합니다.
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
  const images = [0, 1].map((index) => ({
    src: normalizeImageUrl(board.images?.[index], defaultBoardImages[index]),
    alt: `${board.title} 여행 사진 ${index + 1}`,
  })) as BoardDetailData["images"];

  return {
    title: board.title,
    writer: writerName(board.writer, board.user),
    date: dateOnly(board.createdAt),
    profile: normalizeImageUrl(board.user?.picture, defaultProfile),
    contents: board.contents,
    images,
    location: [board.boardAddress?.address, board.boardAddress?.addressDetail].filter(Boolean).join(" ") || "위치 정보 없음",
    likes: board.likeCount,
    dislikes: board.dislikeCount,
    comments: comments.map(mapBoardComment),
  };
}

export function mapBoardForm(board: ApiBoard): BoardFormValues {
  return {
    title: board.title,
    contents: board.contents,
    address: board.boardAddress?.address ?? "",
    detailAddress: board.boardAddress?.addressDetail ?? "",
    zipcode: board.boardAddress?.zipcode ?? undefined,
    youtubeUrl: board.youtubeUrl ?? undefined,
    images: board.images?.filter(Boolean) ?? [],
  };
}

// 숙박권 공통 요약을 먼저 만든 뒤 상세와 마이페이지 매퍼가 이를 재사용합니다.
export function mapTravelProduct(product: ApiTravelproduct): TravelProduct {
  return {
    id: product._id,
    image: normalizeImageUrl(product.images?.[0], defaultProductImages[0]),
    imageCount: product.images?.length || 1,
    location: product.travelproductAddress?.address || "지역 미정",
    title: product.name,
    tags: (product.tags ?? []).map((tag) => tag.startsWith("#") ? tag : `#${tag}`).join(" "),
    price: `${product.price.toLocaleString("ko-KR")}원`,
    createdAt: dateOnly(product.createdAt),
    pickedCount: product.pickedCount,
    seller: {
      id: product.seller?._id,
      name: product.seller?.name || "판매자",
      profile: normalizeImageUrl(product.seller?.picture, defaultProfile),
    },
  };
}

export function mapTravelInquiry(question: ApiTravelproductQuestion): TravelInquiry {
  return {
    id: question._id,
    writerId: question.user?._id,
    writer: question.user?.name || "익명",
    date: dateOnly(question.createdAt),
    question: question.contents,
  };
}

export function mapTravelInquiryAnswer(answer: ApiTravelproductQuestionAnswer): TravelInquiryAnswer {
  return {
    id: answer._id,
    writerId: answer.user?._id,
    writer: answer.user?.name || "판매자",
    contents: answer.contents,
    date: dateOnly(answer.createdAt),
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
    pickedCount: product.pickedCount,
    currentPoints: "0P",
    shortfall: "0P",
  };
}

export function mapTravelProductForm(product: ApiTravelproduct): TravelProductFormValues {
  return {
    name: product.name,
    price: String(product.price),
    address: product.travelproductAddress?.address ?? "",
    detailAddress: product.travelproductAddress?.addressDetail ?? "",
    description: product.contents,
    remarks: product.remarks,
    tags: product.tags ?? [],
    zipcode: product.travelproductAddress?.zipcode ?? undefined,
    images: product.images?.filter(Boolean) ?? [],
  };
}

// 회원과 포인트 원본 값을 마이페이지가 바로 합산·표시할 수 있는 숫자 중심 모델로 바꿉니다.
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

/**
 * 폼의 표시용 문자열을 잘라내고 GraphQL CreateBoardInput 구조로 조립합니다.
 * 빈 선택값은 undefined로 바꿔 서버 기본 처리와 충돌하지 않게 합니다.
 */
export function createBoardInputFromForm(values: BoardFormValues): CreateBoardInput {
  return {
    writer: values.writer?.trim() || undefined,
    password: values.password || undefined,
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

/**
 * 가격은 숫자로, 주소는 중첩 입력으로 변환하고 설명 첫 줄을 요약 문구의 대체값으로 사용합니다.
 * 반환 객체는 생성과 수정 서비스가 공통으로 사용할 수 있는 API 입력 형태입니다.
 */
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

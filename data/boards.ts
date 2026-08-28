/**
 * 역할: API가 없을 때 화면 구조를 확인하기 위한 트립토크 정적 예시 데이터입니다.
 * 처리 흐름: 목록, 인기 카드, 상세와 수정 폼이 공유할 수 있는 형태로 샘플을 제공합니다.
 * 주의사항: 실제 서버 데이터와 혼동되지 않도록 서비스 계층에서는 사용하지 않습니다.
 */
import type {
  BoardDetailData,
  BoardFormValues,
  BoardPost,
  BoardViewer,
  TripTalkPost,
} from "@/types/boards";

export const boardPosts: BoardPost[] = [
  { id: "1", title: "바다와 하늘이 맞닿은 산토리니 여행", writer: "여행하는 고양이", date: "2026-08-24", likes: 128 },
  { id: "2", title: "한여름에도 시원한 파묵칼레 온천", writer: "초록빛 하루", date: "2026-08-23", likes: 102 },
  { id: "3", title: "아무 계획 없이 떠난 몰디브 이야기", writer: "구름 산책", date: "2026-08-22", likes: 96 },
  { id: "4", title: "우리 둘만 알고 싶은 조용한 해변", writer: "여름 조각", date: "2026-08-21", likes: 87 },
  { id: "5", title: "제주 동쪽에서 만난 작은 책방", writer: "느린 여행자", date: "2026-08-20", likes: 74 },
  { id: "6", title: "부산 2박 3일 맛집 동선 공유해요", writer: "맛있는 지도", date: "2026-08-19", likes: 69 },
  { id: "7", title: "경주 황리단길 늦여름 산책 코스", writer: "주말 산책", date: "2026-08-18", likes: 153 },
  { id: "8", title: "비 오는 날 더 좋았던 전주 한옥마을", writer: "소소한 기록", date: "2026-08-17", likes: 48 },
  { id: "9", title: "강릉에서 보낸 느긋한 아침", writer: "파도 소리", date: "2026-08-16", likes: 41 },
  { id: "10", title: "혼자 떠난 여수 야경 여행", writer: "밤의 여행", date: "2026-08-15", likes: 35 },
  { id: "11", title: "가족과 함께 다녀온 남해 드라이브", writer: "따뜻한 하루", date: "2026-08-14", likes: 29 },
  { id: "12", title: "서울 근교 당일치기 숲 여행", writer: "초록 신호", date: "2026-08-13", likes: 21 },
];

export const hotBoardPosts: TripTalkPost[] = boardPosts.slice(0, 4).map((post, index) => ({
  ...post,
  image: `/images/트립토크 이미지/0${index + 1}.png`,
  profile: `/images/프로필 이미지/0${index + 1}.png`,
}));

export const boardDetail: BoardDetailData = {
  title: "바다와 하늘이 맞닿은 산토리니에서 보낸 하루",
  writer: "여행하는 고양이",
  date: "2026-08-24",
  profile: "/images/프로필 이미지/01.png",
  contents: "오래 기다렸던 산토리니 여행을 다녀왔어요. 하얀 골목 사이로 보이는 푸른 바다와 천천히 지는 노을이 정말 아름다웠습니다.\n\n여행 중 가장 좋았던 장소를 함께 남겨요. 이른 아침에는 사람이 적어서 조용히 산책하기 좋았고, 오후에는 카페 테라스에서 바다를 바라보며 쉬었습니다.",
  images: [
    {
      src: "/images/트립토크 상세화면 이미지/01.png",
      alt: "푸른 바다 앞에 놓인 두 개의 의자",
    },
    {
      src: "/images/트립토크 상세화면 이미지/02.png",
      alt: "따뜻한 햇살이 드는 여행지의 휴식 공간",
    },
  ],
  location: "그리스 산토리니 이아 마을",
  likes: 128,
  dislikes: 3,
  comments: [
    {
      id: "1",
      writer: "초록빛 하루",
      date: "2026.08.25",
      contents: "사진만 봐도 바람이 느껴지는 것 같아요. 숙소 정보도 궁금해요!",
      profile: "/images/프로필 이미지/05.png",
    },
    {
      id: "2",
      writer: "구름 산책",
      date: "2026.08.25",
      contents: "저도 다음 여행지로 꼭 가보고 싶어요. 좋은 장소 공유해 주셔서 감사합니다.",
      profile: "/images/프로필 이미지/06.png",
    },
  ],
};

export const boardViewer: BoardViewer = {
  writer: "여행하는 고양이",
  profile: "/images/프로필 이미지/01.png",
  commentDate: "2026.08.25",
};

export const boardFormValues: BoardFormValues = {
  title: boardDetail.title,
  contents: boardDetail.contents,
  address: "그리스 산토리니 이아",
  detailAddress: "이아 마을 전망대 인근",
};

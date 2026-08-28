/**
 * 역할: 트립토크 목록, 상세, 댓글과 작성 폼에서 공유하는 화면 타입을 정의합니다.
 * 처리 흐름: API 원본과 달리 정규화된 이미지·날짜·반응 수 형태를 표현합니다.
 * 주의사항: 컴포넌트 사이 직렬화가 가능하도록 함수나 클래스 인스턴스를 포함하지 않습니다.
 */
export type BoardPost = {
  id: string;
  title: string;
  writer: string;
  date: string;
  likes: number;
};

export type TripTalkPost = BoardPost & {
  image: string;
  profile: string;
};

export type BoardComment = {
  id: string;
  writer: string;
  date: string;
  contents: string;
  profile: string;
};

export type BoardDetailData = {
  title: string;
  writer: string;
  date: string;
  profile: string;
  contents: string;
  images: [{ src: string; alt: string }, { src: string; alt: string }];
  location: string;
  likes: number;
  dislikes: number;
  comments: BoardComment[];
};

export type BoardViewer = {
  writer: string;
  profile: string;
  commentDate: string;
};

export type BoardFormValues = {
  writer?: string;
  password?: string;
  title: string;
  contents: string;
  address: string;
  detailAddress: string;
  zipcode?: string;
  youtubeUrl?: string;
  images?: string[];
};

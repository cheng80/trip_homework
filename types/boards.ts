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
  paragraphs: [string, string];
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
  title: string;
  contents: string;
  address: string;
  detailAddress: string;
  zipcode?: string;
  youtubeUrl?: string;
  images?: string[];
};

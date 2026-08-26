export type TravelProduct = {
  id: string;
  image: string;
  imageCount: number;
  location: string;
  title: string;
  tags: string;
  price: string;
  seller: { name: string; profile: string };
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
  writer: string;
  date: string;
  question: string;
  reply?: string;
  editableReply?: string;
};

export type TravelProductDetailData = {
  images: [string, string, string, string];
  location: string;
  title: string;
  tags: string;
  price: string;
  seller: { name: string; profile: string };
  validity: string;
  capacity: string;
  description: string;
  notes: string[];
  address: string;
  addressNote: string;
  inquiries: TravelInquiry[];
  currentPoints: string;
  shortfall: string;
};

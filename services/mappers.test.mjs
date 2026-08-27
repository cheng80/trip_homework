import assert from "node:assert/strict";
import test from "node:test";
import {
  createBoardInputFromForm,
  mapBoardDetail,
  mapBoardPost,
  mapMypageMember,
  mapTravelInquiry,
  mapTravelInquiryAnswer,
  mapTravelProduct,
} from "./mappers.ts";

const user = {
  _id: "user-1",
  email: "trip@example.com",
  name: "김트립",
  picture: null,
  userPoint: { amount: 125000 },
};

test("GraphQL 게시글 응답을 UI 모델로 변환한다", () => {
  const board = {
    _id: "board-1",
    writer: null,
    title: "여행 이야기",
    contents: "첫 문단\n\n두 번째 문단",
    likeCount: 3,
    dislikeCount: 1,
    images: ["uploads/trip.png"],
    boardAddress: { address: "서울", addressDetail: "성수동" },
    user,
    createdAt: "2026-08-27T12:00:00.000Z",
  };

  assert.deepEqual(mapBoardPost(board), {
    id: "board-1",
    title: "여행 이야기",
    writer: "김트립",
    date: "2026-08-27",
    likes: 3,
  });

  const detail = mapBoardDetail(board, []);
  assert.deepEqual(detail.paragraphs, ["첫 문단", "두 번째 문단"]);
  assert.equal(detail.location, "서울 성수동");
  assert.equal(detail.images[0].src, "https://storage.googleapis.com/uploads/trip.png");
  assert.equal(detail.images.length, 2);
});

test("비로그인 게시글 작성자와 비밀번호를 생성 요청에 포함한다", () => {
  assert.deepEqual(createBoardInputFromForm({
    writer: " 김트립 ",
    password: "1234",
    title: " 여행 이야기 ",
    contents: " 즐거운 여행이었습니다. ",
    address: "서울",
    detailAddress: "성수동",
    images: [],
  }), {
    writer: "김트립",
    password: "1234",
    title: "여행 이야기",
    contents: "즐거운 여행이었습니다.",
    youtubeUrl: undefined,
    boardAddress: {
      zipcode: undefined,
      address: "서울",
      addressDetail: "성수동",
    },
    images: [],
  });
});

test("GraphQL 숙박권과 사용자 응답을 UI 모델로 변환한다", () => {
  const product = mapTravelProduct({
    _id: "product-1",
    name: "감성 숙소",
    remarks: "조용한 숙소",
    contents: "상세 설명",
    price: 32900,
    tags: ["호텔", "스파"],
    images: [],
    pickedCount: 2,
    travelproductAddress: { address: "강릉", addressDetail: null },
    seller: user,
    buyer: null,
    soldAt: null,
    createdAt: "2026-08-27T12:00:00.000Z",
  });

  assert.equal(product.id, "product-1");
  assert.equal(product.price, "32,900원");
  assert.equal(product.tags, "#호텔 #스파");
  assert.equal(product.pickedCount, 2);
  assert.equal(product.seller.id, "user-1");
  assert.equal(product.seller.name, "김트립");
  assert.deepEqual(mapMypageMember(user), {
    id: "user-1",
    name: "김트립",
    email: "trip@example.com",
    profile: "/images/프로필 이미지/01.png",
    points: 125000,
  });
});

test("숙박권 문의와 답변 작성자 정보를 UI 모델에 유지한다", () => {
  assert.equal(mapTravelInquiry({
    _id: "question-1",
    contents: "주말에 이용할 수 있나요?",
    user,
    createdAt: "2026-08-27T12:00:00.000Z",
  }).writerId, "user-1");

  assert.deepEqual(mapTravelInquiryAnswer({
    _id: "answer-1",
    contents: "주말에도 이용할 수 있습니다.",
    user,
    createdAt: "2026-08-27T13:00:00.000Z",
  }), {
    id: "answer-1",
    writerId: "user-1",
    writer: "김트립",
    contents: "주말에도 이용할 수 있습니다.",
    date: "2026-08-27",
  });
});

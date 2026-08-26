import assert from "node:assert/strict";
import test from "node:test";
import { selectBoardPosts } from "./board-list.ts";

test("게시글 검색·기간·정렬·페이지 계산을 순수 로직으로 처리한다", () => {
  const posts = [
    { id: "1", title: "제주 여행", writer: "가", date: "2026-08-27", likes: 1 },
    { id: "2", title: "제주 숙소", writer: "나", date: "2026-08-26", likes: 10 },
    { id: "3", title: "강릉 여행", writer: "다", date: "2026-08-25", likes: 5 },
  ];

  assert.deepEqual(
    selectBoardPosts(posts, {
      search: "제주",
      startDate: "2026-08-26",
      endDate: "",
      sort: "likes",
      page: 1,
      pageSize: 1,
    }),
    { page: 1, pageCount: 2, posts: [posts[1]] },
  );
});

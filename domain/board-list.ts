/**
 * 역할: 트립토크 정적 목록의 검색·기간·정렬·페이지 계산을 제공하는 순수 함수 모듈입니다.
 * 처리 흐름: 입력 조건을 정규화한 뒤 필터링, 정렬, 페이지 분할 순서로 처리합니다.
 * 주의사항: 서버 API가 지원하지 않는 보조 정렬을 클라이언트 데이터에서 재현할 때 사용합니다.
 */
import type { BoardPost } from "../types/boards";

export type BoardSort = "latest" | "likes";
export type BoardListSelection = {
  search: string;
  startDate: string;
  endDate: string;
  sort: BoardSort;
  page: number;
  pageSize: number;
};

export function selectBoardPosts(posts: BoardPost[], selection: BoardListSelection) {
  const search = selection.search.toLowerCase();
  const filtered = posts.filter((post) => (
    post.title.toLowerCase().includes(search)
    && (!selection.startDate || post.date >= selection.startDate)
    && (!selection.endDate || post.date <= selection.endDate)
  ));
  const sorted = [...filtered].sort((a, b) => (
    selection.sort === "likes" ? b.likes - a.likes : b.date.localeCompare(a.date)
  ));
  const pageCount = Math.max(1, Math.ceil(sorted.length / selection.pageSize));
  const page = Math.min(Math.max(selection.page, 1), pageCount);

  return {
    page,
    pageCount,
    posts: sorted.slice((page - 1) * selection.pageSize, page * selection.pageSize),
  };
}

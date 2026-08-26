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

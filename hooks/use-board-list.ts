/**
 * 역할: 트립토크 목록의 브라우저 상태와 URL 검색 조건을 연결하는 클라이언트 훅입니다.
 * 처리 흐름: 검색·정렬·페이지 변경을 쿼리 문자열로 반영해 서버 컴포넌트 재조회가 일어나게 합니다.
 * 주의사항: 동일 조건에서는 불필요한 이동을 만들지 않습니다.
 */
"use client";

import { useMemo, useState, type FormEvent } from "react";
import { selectBoardPosts, type BoardSort } from "@/domain/board-list";
import type { BoardPost } from "@/types/boards";

const pageSize = 10;

export function useBoardList(posts: BoardPost[]) {
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sort, setSort] = useState<BoardSort>("latest");
  const [page, setPage] = useState(1);

  const selected = useMemo(() => selectBoardPosts(posts, {
    search,
    startDate: dateRange.start,
    endDate: dateRange.end,
    sort,
    page,
    pageSize,
  }), [dateRange, page, posts, search, sort]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(keyword.trim());
    setDateRange({ start: startDate, end: endDate });
    setPage(1);
  };

  const changeSort = (value: string) => {
    setSort(value === "likes" ? "likes" : "latest");
    setPage(1);
  };

  return {
    keyword,
    setKeyword,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sort,
    changeSort,
    page: selected.page,
    setPage,
    pageCount: selected.pageCount,
    visiblePosts: selected.posts,
    handleSearch,
  };
}

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

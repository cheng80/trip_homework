"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { BoardPost } from "@/types/boards";

const pageSize = 10;

export function useBoardList(posts: BoardPost[]) {
  const [keyword, setKeyword] = useState("");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  const filteredPosts = useMemo(() => {
    const result = posts.filter((post) => {
      const matchesKeyword = post.title.toLowerCase().includes(search.toLowerCase());
      const matchesStart = !dateRange.start || post.date >= dateRange.start;
      const matchesEnd = !dateRange.end || post.date <= dateRange.end;
      return matchesKeyword && matchesStart && matchesEnd;
    });

    return [...result].sort((a, b) =>
      sort === "likes" ? b.likes - a.likes : b.date.localeCompare(a.date),
    );
  }, [dateRange, posts, search, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visiblePosts = filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(keyword.trim());
    setDateRange({ start: startDate, end: endDate });
    setPage(1);
  };

  const changeSort = (value: string) => {
    setSort(value);
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
    page: currentPage,
    setPage,
    pageCount,
    visiblePosts,
    handleSearch,
  };
}

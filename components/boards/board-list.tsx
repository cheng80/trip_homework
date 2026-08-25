"use client";

import Image from "next/image";
import Link from "next/link";
import { useBoardList } from "@/hooks/use-board-list";
import type { BoardPost } from "@/types/boards";
import styles from "./board-list.module.css";

type BoardListProps = {
  posts: BoardPost[];
};

export default function BoardList({ posts }: BoardListProps) {
  const {
    keyword,
    setKeyword,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    sort,
    changeSort,
    page,
    setPage,
    pageCount,
    visiblePosts,
    handleSearch,
  } = useBoardList(posts);

  return (
    <section aria-labelledby="board-title">
      <div className={styles.titleRow}>
        <h2 id="board-title">트립토크 게시판</h2>
        <label className={styles.sortField}>
          <span className={styles.srOnly}>게시글 정렬</span>
          <select
            value={sort}
            onChange={(event) => changeSort(event.target.value)}
          >
            <option value="latest">최신순</option>
            <option value="likes">좋아요순</option>
          </select>
        </label>
      </div>

      <div className={styles.tools}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.dateFields}>
            <label>
              <span className={styles.srOnly}>검색 시작일</span>
              <input
                type="date"
                value={startDate}
                max={endDate || undefined}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </label>
            <span aria-hidden="true">–</span>
            <label>
              <span className={styles.srOnly}>검색 종료일</span>
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </label>
          </div>
          <label className={styles.keywordField}>
            <span className={styles.srOnly}>게시글 제목 검색</span>
            <Image src="/icon/outline/search.svg" alt="" width={20} height={20} />
            <input
              type="search"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="제목을 검색해 주세요."
            />
          </label>
          <button className={styles.searchButton} type="submit">검색</button>
        </form>
        <Link className={styles.writeButton} href="/boards/new">
          <Image src="/icon/outline/rwite.svg" alt="" width={20} height={20} />
          트립토크 등록
        </Link>
      </div>

      <div className={styles.tableBox}>
        <div className={`${styles.row} ${styles.head}`} aria-hidden="true">
          <span className={styles.number}>번호</span>
          <span className={styles.postTitle}>제목</span>
          <span className={styles.postWriter}>작성자</span>
          <span className={styles.postDate}>날짜</span>
        </div>
        {visiblePosts.length > 0 ? visiblePosts.map((post) => (
          <article className={styles.row} key={post.id}>
            <span className={styles.number}>{post.id}</span>
            <Link className={styles.postTitle} href={`/boards/${post.id}`}>{post.title}</Link>
            <span className={styles.postWriter}>{post.writer}</span>
            <time className={styles.postDate} dateTime={post.date}>
              {post.date.replaceAll("-", ".")}
            </time>
          </article>
        )) : (
          <div className={styles.empty}>
            <strong>검색 결과가 없습니다.</strong>
            <span>검색어 또는 날짜를 바꿔 다시 검색해 주세요.</span>
          </div>
        )}

        <nav className={styles.pagination} aria-label="게시글 페이지">
          <button
            type="button"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            aria-label="이전 페이지"
          >
            ‹
          </button>
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <button
              className={page === pageNumber ? styles.currentPage : undefined}
              type="button"
              onClick={() => setPage(pageNumber)}
              aria-current={page === pageNumber ? "page" : undefined}
              key={pageNumber}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage(Math.min(pageCount, page + 1))}
            disabled={page === pageCount}
            aria-label="다음 페이지"
          >
            ›
          </button>
        </nav>
      </div>
    </section>
  );
}

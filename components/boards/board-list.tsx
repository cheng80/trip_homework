/**
 * 역할: 검색 조건과 페이지 이동을 포함한 트립토크 표 목록입니다.
 * 처리 흐름: 정렬 선택 변경 시 필터 폼을 즉시 제출해 URL 기반 서버 조회를 다시 실행합니다.
 * 주의사항: 목록 행 전체 탐색과 명시적인 제목 링크를 함께 제공해 접근성을 유지합니다.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import DateRangeField from "@/components/commons/date-range-field";
import type { BoardPost } from "@/types/boards";
import styles from "./board-list.module.css";

type BoardListProps = {
  posts: BoardPost[];
  count: number;
  page: number;
  search: string;
  sort: "latest" | "likes";
  startDate: string;
  endDate: string;
};

export default function BoardList({
  posts,
  count,
  page,
  search,
  sort,
  startDate,
  endDate,
}: BoardListProps) {
  const pageCount = Math.max(1, Math.ceil(count / 10));
  const firstPage = Math.floor((Math.min(page, pageCount) - 1) / 5) * 5 + 1;
  const pages = Array.from(
    { length: Math.min(5, pageCount - firstPage + 1) },
    (_, index) => firstPage + index,
  );
  const pageHref = (nextPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (sort !== "latest") params.set("sort", sort);
    if (nextPage > 1) params.set("page", String(nextPage));
    const query = params.toString();
    return query ? `/boards?${query}` : "/boards";
  };

  return (
    <section aria-labelledby="board-title">
      <div className={styles.titleRow}>
        <h2 id="board-title">트립토크 게시판</h2>
        <label className={styles.sortField}>
          <span className={styles.srOnly}>게시글 정렬</span>
          <select
            name="sort"
            defaultValue={sort}
            form="board-filters"
            onChange={(event) => event.currentTarget.form?.requestSubmit()}
          >
            <option value="latest">최신순</option>
            <option value="likes">좋아요순</option>
          </select>
        </label>
      </div>

      <div className={styles.tools}>
        <form className={styles.searchForm} id="board-filters" action="/boards">
          <DateRangeField
            className={styles.dateFields}
            label="검색 기간"
            startName="startDate"
            endName="endDate"
            startDate={startDate}
            endDate={endDate}
            tone="board"
          />
          <label className={styles.keywordField}>
            <span className={styles.srOnly}>게시글 제목 검색</span>
            <Image src="/icon/outline/search.svg" alt="" width={20} height={20} />
            <input
              type="search"
              name="q"
              defaultValue={search}
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
        {posts.length > 0 ? posts.map((post, index) => (
          <article className={styles.row} key={post.id}>
            <span className={styles.number}>{Math.max(1, count - (page - 1) * 10 - index)}</span>
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
          <Link
            href={pageHref(Math.max(1, page - 1))}
            aria-disabled={page === 1}
            aria-label="이전 페이지"
          >
            ‹
          </Link>
          {pages.map((pageNumber) => (
            <Link
              className={page === pageNumber ? styles.currentPage : undefined}
              href={pageHref(pageNumber)}
              aria-current={page === pageNumber ? "page" : undefined}
              key={pageNumber}
            >
              {pageNumber}
            </Link>
          ))}
          <Link
            href={pageHref(Math.min(pageCount, page + 1))}
            aria-disabled={page >= pageCount}
            aria-label="다음 페이지"
          >
            ›
          </Link>
        </nav>
      </div>
    </section>
  );
}

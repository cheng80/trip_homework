"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import styles from "./styles.module.css";

const posts = [
  { id: "1", title: "바다와 하늘이 맞닿은 산토리니 여행", writer: "여행하는 고양이", date: "2026-08-24", likes: 128 },
  { id: "2", title: "한여름에도 시원한 파묵칼레 온천", writer: "초록빛 하루", date: "2026-08-23", likes: 102 },
  { id: "3", title: "아무 계획 없이 떠난 몰디브 이야기", writer: "구름 산책", date: "2026-08-22", likes: 96 },
  { id: "4", title: "우리 둘만 알고 싶은 조용한 해변", writer: "여름 조각", date: "2026-08-21", likes: 87 },
  { id: "5", title: "제주 동쪽에서 만난 작은 책방", writer: "느린 여행자", date: "2026-08-20", likes: 74 },
  { id: "6", title: "부산 2박 3일 맛집 동선 공유해요", writer: "맛있는 지도", date: "2026-08-19", likes: 69 },
  { id: "7", title: "경주 황리단길 늦여름 산책 코스", writer: "주말 산책", date: "2026-08-18", likes: 153 },
  { id: "8", title: "비 오는 날 더 좋았던 전주 한옥마을", writer: "소소한 기록", date: "2026-08-17", likes: 48 },
  { id: "9", title: "강릉에서 보낸 느긋한 아침", writer: "파도 소리", date: "2026-08-16", likes: 41 },
  { id: "10", title: "혼자 떠난 여수 야경 여행", writer: "밤의 여행", date: "2026-08-15", likes: 35 },
  { id: "11", title: "가족과 함께 다녀온 남해 드라이브", writer: "따뜻한 하루", date: "2026-08-14", likes: 29 },
  { id: "12", title: "서울 근교 당일치기 숲 여행", writer: "초록 신호", date: "2026-08-13", likes: 21 },
];

const hotPosts = posts.slice(0, 4);
const pageSize = 10;

export default function BoardsPage() {
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
  }, [dateRange, search, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const visiblePosts = filteredPosts.slice((page - 1) * pageSize, page * pageSize);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(keyword.trim());
    setDateRange({ start: startDate, end: endDate });
    setPage(1);
  };

  return (
    <main className={styles.page}>
      <section className={styles.hotSection} aria-labelledby="hot-title">
        <h1 id="hot-title">오늘 핫한 트립토크</h1>
        <div className={styles.hotGrid}>
          {hotPosts.map((post, index) => (
            <Link className={styles.hotCard} href={`/boards/${post.id}`} key={post.id}>
              <Image
                className={styles.hotImage}
                src={`/images/트립토크 이미지/0${index + 1}.png`}
                alt=""
                width={224}
                height={304}
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className={styles.hotContent}>
                <h2>{post.title}</h2>
                <div className={styles.writer}>
                  <Image src={`/images/프로필 이미지/0${index + 1}.png`} alt="" width={24} height={24} />
                  <span>{post.writer}</span>
                </div>
                <div className={styles.hotMeta}>
                  <span><Image src="/icon/outline/good.svg" alt="" width={16} height={16} /> {post.likes}</span>
                  <time dateTime={post.date}>{post.date.replaceAll("-", ".")}</time>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.boardSection} aria-labelledby="board-title">
        <div className={styles.titleRow}>
          <h2 id="board-title">트립토크 게시판</h2>
          <label className={styles.sortField}>
            <span className={styles.srOnly}>게시글 정렬</span>
            <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }}>
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
                <input type="date" value={startDate} max={endDate || undefined} onChange={(event) => setStartDate(event.target.value)} />
              </label>
              <span aria-hidden="true">–</span>
              <label>
                <span className={styles.srOnly}>검색 종료일</span>
                <input type="date" value={endDate} min={startDate || undefined} onChange={(event) => setEndDate(event.target.value)} />
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
              <time className={styles.postDate} dateTime={post.date}>{post.date.replaceAll("-", ".")}</time>
            </article>
          )) : (
            <div className={styles.empty}>
              <strong>검색 결과가 없습니다.</strong>
              <span>검색어 또는 날짜를 바꿔 다시 검색해 주세요.</span>
            </div>
          )}

          <nav className={styles.pagination} aria-label="게시글 페이지">
            <button type="button" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} aria-label="이전 페이지">‹</button>
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
            <button type="button" onClick={() => setPage(Math.min(pageCount, page + 1))} disabled={page === pageCount} aria-label="다음 페이지">›</button>
          </nav>
        </div>
      </section>
    </main>
  );
}

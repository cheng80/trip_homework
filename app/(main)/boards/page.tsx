/**
 * 역할: 트립토크 목록의 검색·기간·정렬·페이지 조건을 해석하는 서버 컴포넌트입니다.
 * 처리 흐름: 일반 목록과 인기 목록을 병렬 조회하고 선택한 정렬 기준을 적용해 화면에 전달합니다.
 * 주의사항: URL 검색 조건을 단일 진실 공급원으로 사용해 새로고침 후에도 상태를 유지합니다.
 */
import BoardList from "@/components/boards/board-list";
import HotBoardList from "@/components/boards/hot-board-list";
import { dateBoundary } from "@/domain/date-range";
import { getBestBoards, getBoards } from "@/services/boards";
import styles from "./page.module.css";

type BoardsPageProps = {
  searchParams: Promise<{
    endDate?: string;
    page?: string;
    q?: string;
    sort?: string;
    startDate?: string;
  }>;
};

export default async function BoardsPage({ searchParams }: BoardsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const search = params.q?.trim() ?? "";
  const sort = params.sort === "likes" ? "likes" : "latest";
  const [{ posts, count }, hotPosts] = await Promise.all([
    getBoards({
      page,
      search,
      startDate: dateBoundary(params.startDate),
      endDate: dateBoundary(params.endDate, true),
    }),
    getBestBoards(),
  ]);
  const visiblePosts = sort === "likes" ? posts.toSorted((a, b) => b.likes - a.likes) : posts;

  return (
    <main className={styles.page}>
      <HotBoardList posts={hotPosts} />
      <BoardList
        posts={visiblePosts}
        count={count}
        page={page}
        search={search}
        sort={sort}
        startDate={params.startDate ?? ""}
        endDate={params.endDate ?? ""}
      />
    </main>
  );
}

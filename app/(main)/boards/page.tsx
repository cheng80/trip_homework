import BoardList from "@/components/boards/board-list";
import HotBoardList from "@/components/boards/hot-board-list";
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

const dateBoundary = (value: string | undefined, end = false) => value
  ? `${value}T${end ? "23:59:59.999" : "00:00:00.000"}Z`
  : undefined;

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

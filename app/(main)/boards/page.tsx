import BoardList from "@/components/boards/board-list";
import HotBoardList from "@/components/boards/hot-board-list";
import { boardPosts, hotBoardPosts } from "@/data/boards";
import styles from "./page.module.css";

export default function BoardsPage() {
  return (
    <main className={styles.page}>
      <HotBoardList posts={hotBoardPosts} />
      <BoardList posts={boardPosts} />
    </main>
  );
}

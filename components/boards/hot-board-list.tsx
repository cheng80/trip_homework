import type { TripTalkPost } from "@/types/boards";
import TripTalkCard from "./trip-talk-card";
import styles from "./hot-board-list.module.css";

type HotBoardListProps = {
  posts: TripTalkPost[];
};

export default function HotBoardList({ posts }: HotBoardListProps) {
  return (
    <section className={styles.hotSection} aria-labelledby="hot-title">
      <h1 id="hot-title">오늘 핫한 트립토크</h1>
      <div className={styles.hotGrid}>
        {posts.map((post) => (
          <TripTalkCard post={post} key={post.id} />
        ))}
      </div>
    </section>
  );
}

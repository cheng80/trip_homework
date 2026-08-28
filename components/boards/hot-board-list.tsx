/**
 * 역할: 좋아요가 많은 트립토크를 카드 목록으로 보여주는 추천 섹션입니다.
 * 처리 흐름: 서버에서 정렬된 게시글을 TripTalkCard로 반복 렌더링합니다.
 * 주의사항: 데이터 정렬이나 추가 조회는 수행하지 않는 표시 전용 컴포넌트입니다.
 */
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

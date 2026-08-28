/**
 * 역할: 인기 트립토크 한 건의 이미지, 제목, 작성자와 반응 수를 표시합니다.
 * 처리 흐름: 카드 전체를 상세 페이지 링크로 구성하고 이미지 크기는 Next Image에 위임합니다.
 * 주의사항: 텍스트와 이미지 대체 설명은 전달받은 게시글 데이터에서 생성합니다.
 */
import Image from "next/image";
import Link from "next/link";
import type { TripTalkPost } from "@/types/boards";
import styles from "./trip-talk-card.module.css";

type TripTalkCardProps = {
  post: TripTalkPost;
};

export default function TripTalkCard({ post }: TripTalkCardProps) {
  return (
    <Link className={styles.card} href={`/boards/${post.id}`}>
      <Image
        className={styles.image}
        src={post.image}
        alt=""
        width={224}
        height={304}
        loading={post.id === "1" ? "eager" : "lazy"}
      />
      <div className={styles.content}>
        <h2>{post.title}</h2>
        <div className={styles.writer}>
          <Image
            src={post.profile}
            alt=""
            width={24}
            height={24}
          />
          <span>{post.writer}</span>
        </div>
        <div className={styles.meta}>
          <span>
            <Image src="/icon/outline/good.svg" alt="" width={16} height={16} />
            {post.likes}
          </span>
          <time dateTime={post.date}>{post.date.replaceAll("-", ".")}</time>
        </div>
      </div>
    </Link>
  );
}

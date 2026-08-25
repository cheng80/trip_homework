"use client";

import Image from "next/image";
import Link from "next/link";
import type { BoardDetailData } from "@/types/boards";
import styles from "./board-article.module.css";

type Reaction = "like" | "dislike" | null;

type BoardArticleProps = {
  boardId: string;
  board: BoardDetailData;
  reaction: Reaction;
  onReactionChange: (reaction: Reaction) => void;
};

export default function BoardArticle({
  boardId,
  board,
  reaction,
  onReactionChange,
}: BoardArticleProps) {
  return (
    <article>
      <div className={styles.heading}>
        <span>여행 이야기 #{boardId}</span>
        <h1>{board.title}</h1>
      </div>

      <div className={styles.information}>
        <Image src={board.profile} alt="" width={40} height={40} />
        <div>
          <strong>{board.writer}</strong>
          <time dateTime={board.date}>{board.date.replaceAll("-", ".")}</time>
        </div>
        <div className={styles.postActions}>
          <Link href={`/boards/${boardId}/edit`}>
            <Image src="/icon/outline/edit.svg" alt="" width={18} height={18} />
            수정
          </Link>
        </div>
      </div>

      <div className={styles.contents}>
        <p>{board.paragraphs[0]}</p>
        <div className={styles.images}>
          <div className={styles.portraitImage}>
            <Image
              src={board.images[0].src}
              alt={board.images[0].alt}
              fill
              sizes="(max-width: 780px) 100vw, 420px"
              loading="eager"
            />
          </div>
          <div className={styles.landscapeImage}>
            <Image
              src={board.images[1].src}
              alt={board.images[1].alt}
              fill
              sizes="(max-width: 780px) 100vw, 720px"
              loading="eager"
            />
          </div>
        </div>
        <p>{board.paragraphs[1]}</p>

        <section className={styles.location} aria-labelledby="location-title">
          <Image src="/icon/outline/location.svg" alt="" width={22} height={22} />
          <div>
            <h2 id="location-title">여행 위치</h2>
            <p>{board.location}</p>
          </div>
        </section>
      </div>

      <div className={styles.reactions} aria-label="게시글 반응">
        <button
          className={reaction === "like" ? styles.selectedReaction : undefined}
          type="button"
          aria-pressed={reaction === "like"}
          onClick={() => onReactionChange(reaction === "like" ? null : "like")}
        >
          <Image src="/icon/outline/good.svg" alt="" width={22} height={22} />
          좋아요 {board.likes + (reaction === "like" ? 1 : 0)}
        </button>
        <button
          className={reaction === "dislike" ? styles.selectedReaction : undefined}
          type="button"
          aria-pressed={reaction === "dislike"}
          onClick={() => onReactionChange(reaction === "dislike" ? null : "dislike")}
        >
          <Image src="/icon/outline/bad.svg" alt="" width={22} height={22} />
          싫어요 {board.dislikes + (reaction === "dislike" ? 1 : 0)}
        </button>
      </div>
    </article>
  );
}

"use client";

import Image from "next/image";
import type { FormEvent } from "react";
import type { BoardComment } from "@/types/boards";
import styles from "./board-comments.module.css";

type BoardCommentsProps = {
  comments: BoardComment[];
  comment: string;
  editingId: string | null;
  editingContents: string;
  onCommentChange: (value: string) => void;
  onEditingContentsChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onStartEditing: (comment: BoardComment) => void;
  onCancelEditing: () => void;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
  status: string;
};

export default function BoardComments({
  comments,
  comment,
  editingId,
  editingContents,
  onCommentChange,
  onEditingContentsChange,
  onSubmit,
  onStartEditing,
  onCancelEditing,
  onSave,
  onDelete,
  status,
}: BoardCommentsProps) {
  return (
    <section className={styles.comments} aria-labelledby="comment-title">
      <h2 id="comment-title">댓글 <span>{comments.length}</span></h2>
      {status && <p role="status" aria-live="polite">{status}</p>}
      <form className={styles.commentForm} onSubmit={onSubmit}>
        <div className={styles.commentCredentials}>
          <label>
            작성자
            <input name="writer" maxLength={20} placeholder="작성자 이름" required />
          </label>
          <label>
            댓글 비밀번호
            <input name="password" type="password" minLength={4} autoComplete="new-password" placeholder="4자 이상" required />
          </label>
        </div>
        <label htmlFor="comment">댓글 작성</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(event) => onCommentChange(event.target.value)}
          maxLength={300}
          placeholder="여행 이야기에 댓글을 남겨 주세요."
          required
        />
        <div>
          <span>{comment.length}/300</span>
          <button type="submit">댓글 등록</button>
        </div>
      </form>

      <div className={styles.commentList}>
        {comments.map((item) => (
          <article className={styles.comment} key={item.id}>
            <Image src={item.profile} alt="" width={40} height={40} />
            <div className={styles.commentBody}>
              <div className={styles.commentHeader}>
                <div>
                  <strong>{item.writer}</strong>
                  <time>{item.date}</time>
                </div>
                <div className={styles.commentActions}>
                  <button type="button" onClick={() => onStartEditing(item)}>수정</button>
                  <button type="button" onClick={() => onDelete(item.id)}>삭제</button>
                </div>
              </div>

              {editingId === item.id ? (
                <div className={styles.commentEdit}>
                  <label className={styles.srOnly} htmlFor={`comment-${item.id}`}>댓글 수정</label>
                  <textarea
                    id={`comment-${item.id}`}
                    value={editingContents}
                    onChange={(event) => onEditingContentsChange(event.target.value)}
                    maxLength={300}
                  />
                  <div>
                    <button type="button" onClick={onCancelEditing}>취소</button>
                    <button type="button" onClick={() => onSave(item.id)}>수정 완료</button>
                  </div>
                </div>
              ) : (
                <p>{item.contents}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

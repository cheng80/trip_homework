"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useState, type FormEvent } from "react";
import styles from "./styles.module.css";

type Comment = {
  id: number;
  writer: string;
  date: string;
  contents: string;
  profile: string;
};

const initialComments: Comment[] = [
  {
    id: 1,
    writer: "초록빛 하루",
    date: "2026.08.25",
    contents: "사진만 봐도 바람이 느껴지는 것 같아요. 숙소 정보도 궁금해요!",
    profile: "/images/프로필 이미지/05.png",
  },
  {
    id: 2,
    writer: "구름 산책",
    date: "2026.08.25",
    contents: "저도 다음 여행지로 꼭 가보고 싶어요. 좋은 장소 공유해 주셔서 감사합니다.",
    profile: "/images/프로필 이미지/06.png",
  },
];

type BoardDetailPageProps = {
  params: Promise<{ boardId: string }>;
};

export default function BoardDetailPage({ params }: BoardDetailPageProps) {
  const { boardId } = use(params);
  const [reaction, setReaction] = useState<"like" | "dislike" | null>(null);
  const [comments, setComments] = useState(initialComments);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContents, setEditingContents] = useState("");

  const submitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const contents = comment.trim();
    if (!contents) return;

    setComments((current) => [
      ...current,
      {
        id: Date.now(),
        writer: "여행하는 고양이",
        date: "2026.08.25",
        contents,
        profile: "/images/프로필 이미지/01.png",
      },
    ]);
    setComment("");
  };

  const saveComment = (id: number) => {
    const contents = editingContents.trim();
    if (!contents) return;
    setComments((current) => current.map((item) => item.id === id ? { ...item, contents } : item));
    setEditingId(null);
  };

  const deleteComment = (id: number) => {
    if (window.confirm("댓글을 삭제할까요?")) {
      setComments((current) => current.filter((item) => item.id !== id));
    }
  };

  return (
    <main className={styles.page}>
      <Link className={styles.back} href="/boards">
        <Image src="/icon/outline/left_arrow.svg" alt="" width={20} height={20} />
        트립토크 목록
      </Link>

      <article className={styles.article}>
        <div className={styles.heading}>
          <span>여행 이야기 #{boardId}</span>
          <h1>바다와 하늘이 맞닿은 산토리니에서 보낸 하루</h1>
        </div>

        <div className={styles.information}>
          <Image src="/images/프로필 이미지/01.png" alt="" width={40} height={40} />
          <div>
            <strong>여행하는 고양이</strong>
            <time dateTime="2026-08-24">2026.08.24</time>
          </div>
          <div className={styles.postActions}>
            <Link href={`/boards/${boardId}/edit`}>
              <Image src="/icon/outline/edit.svg" alt="" width={18} height={18} />
              수정
            </Link>
          </div>
        </div>

        <div className={styles.contents}>
          <p>
            오래 기다렸던 산토리니 여행을 다녀왔어요. 하얀 골목 사이로 보이는 푸른 바다와
            천천히 지는 노을이 정말 아름다웠습니다.
          </p>
          <div className={styles.images}>
            <div className={styles.portraitImage}>
              <Image
                src="/images/트립토크 상세화면 이미지/01.png"
                alt="푸른 바다 앞에 놓인 두 개의 의자"
                fill
                sizes="(max-width: 780px) 100vw, 420px"
                loading="eager"
              />
            </div>
            <div className={styles.landscapeImage}>
              <Image
                src="/images/트립토크 상세화면 이미지/02.png"
                alt="따뜻한 햇살이 드는 여행지의 휴식 공간"
                fill
                sizes="(max-width: 780px) 100vw, 720px"
                loading="eager"
              />
            </div>
          </div>
          <p>
            여행 중 가장 좋았던 장소를 함께 남겨요. 이른 아침에는 사람이 적어서 조용히
            산책하기 좋았고, 오후에는 카페 테라스에서 바다를 바라보며 쉬었습니다.
          </p>

          <section className={styles.location} aria-labelledby="location-title">
            <Image src="/icon/outline/location.svg" alt="" width={22} height={22} />
            <div>
              <h2 id="location-title">여행 위치</h2>
              <p>그리스 산토리니 이아 마을</p>
            </div>
          </section>
        </div>

        <div className={styles.reactions} aria-label="게시글 반응">
          <button
            className={reaction === "like" ? styles.selectedReaction : undefined}
            type="button"
            aria-pressed={reaction === "like"}
            onClick={() => setReaction((current) => current === "like" ? null : "like")}
          >
            <Image src="/icon/outline/good.svg" alt="" width={22} height={22} />
            좋아요 {128 + (reaction === "like" ? 1 : 0)}
          </button>
          <button
            className={reaction === "dislike" ? styles.selectedReaction : undefined}
            type="button"
            aria-pressed={reaction === "dislike"}
            onClick={() => setReaction((current) => current === "dislike" ? null : "dislike")}
          >
            <Image src="/icon/outline/bad.svg" alt="" width={22} height={22} />
            싫어요 {3 + (reaction === "dislike" ? 1 : 0)}
          </button>
        </div>
      </article>

      <section className={styles.comments} aria-labelledby="comment-title">
        <h2 id="comment-title">댓글 <span>{comments.length}</span></h2>
        <form className={styles.commentForm} onSubmit={submitComment}>
          <label htmlFor="comment">댓글 작성</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
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
                    <button
                      type="button"
                      onClick={() => { setEditingId(item.id); setEditingContents(item.contents); }}
                    >
                      수정
                    </button>
                    <button type="button" onClick={() => deleteComment(item.id)}>삭제</button>
                  </div>
                </div>

                {editingId === item.id ? (
                  <div className={styles.commentEdit}>
                    <label className={styles.srOnly} htmlFor={`comment-${item.id}`}>댓글 수정</label>
                    <textarea
                      id={`comment-${item.id}`}
                      value={editingContents}
                      onChange={(event) => setEditingContents(event.target.value)}
                      maxLength={300}
                    />
                    <div>
                      <button type="button" onClick={() => setEditingId(null)}>취소</button>
                      <button type="button" onClick={() => saveComment(item.id)}>수정 완료</button>
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
    </main>
  );
}

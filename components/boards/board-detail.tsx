/**
 * 역할: 게시글 상세의 반응, 댓글, 삭제 상태를 하나로 연결하는 클라이언트 조정 컴포넌트입니다.
 * 처리 흐름: useBoardDetail 훅에서 받은 상태와 동작을 본문 및 댓글 하위 컴포넌트에 분배합니다.
 * 주의사항: 서버에서 받은 초기 데이터는 훅의 로컬 상태 초기값으로만 사용합니다.
 */
"use client";

import BackLink from "@/components/commons/back-link";
import { useBoardDetail } from "@/hooks/use-board-detail";
import type { BoardDetailData } from "@/types/boards";
import BoardArticle from "./board-article";
import BoardComments from "./board-comments";
import styles from "./board-detail.module.css";

type BoardDetailProps = {
  boardId: string;
  board: BoardDetailData;
};

export default function BoardDetail({ boardId, board }: BoardDetailProps) {
  const state = useBoardDetail(boardId, board);

  return (
    <main className={styles.page}>
      <BackLink className={styles.back} href="/boards">트립토크 목록</BackLink>
      <BoardArticle
        boardId={boardId}
        board={board}
        reaction={state.reaction}
        likes={state.likes}
        dislikes={state.dislikes}
        pending={state.reactionPending}
        onReactionChange={state.changeReaction}
        onDelete={() => void state.deletePost()}
      />
      <BoardComments
        comments={state.comments}
        comment={state.comment}
        editingId={state.editingId}
        editingContents={state.editingContents}
        onCommentChange={state.setComment}
        onEditingContentsChange={state.setEditingContents}
        onSubmit={state.submitComment}
        onStartEditing={state.startEditing}
        onCancelEditing={() => state.setEditingId(null)}
        onSave={state.saveComment}
        onDelete={state.deleteComment}
        status={state.status}
      />
    </main>
  );
}

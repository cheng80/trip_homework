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

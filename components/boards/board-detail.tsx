"use client";

import BackLink from "@/components/commons/back-link";
import { useBoardDetail } from "@/hooks/use-board-detail";
import type { BoardDetailData, BoardViewer } from "@/types/boards";
import BoardArticle from "./board-article";
import BoardComments from "./board-comments";
import styles from "./board-detail.module.css";

type BoardDetailProps = {
  boardId: string;
  board: BoardDetailData;
  viewer: BoardViewer;
};

export default function BoardDetail({ boardId, board, viewer }: BoardDetailProps) {
  const state = useBoardDetail(board, viewer);

  return (
    <main className={styles.page}>
      <BackLink className={styles.back} href="/boards">트립토크 목록</BackLink>
      <BoardArticle
        boardId={boardId}
        board={board}
        reaction={state.reaction}
        onReactionChange={state.setReaction}
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
      />
    </main>
  );
}

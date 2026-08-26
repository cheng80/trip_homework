"use client";

import { useState, type FormEvent } from "react";
import type { BoardComment, BoardDetailData, BoardViewer } from "@/types/boards";

export function useBoardDetail(board: BoardDetailData, viewer: BoardViewer) {
  const [reaction, setReaction] = useState<"like" | "dislike" | null>(null);
  const [comments, setComments] = useState<BoardComment[]>(board.comments);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContents, setEditingContents] = useState("");

  const submitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const contents = comment.trim();
    if (!contents) return;

    setComments((current) => [
      ...current,
      {
        id: String(Date.now()),
        writer: viewer.writer,
        date: viewer.commentDate,
        contents,
        profile: viewer.profile,
      },
    ]);
    setComment("");
  };

  const startEditing = (item: BoardComment) => {
    setEditingId(item.id);
    setEditingContents(item.contents);
  };

  const saveComment = (id: string) => {
    const contents = editingContents.trim();
    if (!contents) return;
    setComments((current) => current.map((item) => item.id === id ? { ...item, contents } : item));
    setEditingId(null);
  };

  const deleteComment = (id: string) => {
    if (window.confirm("댓글을 삭제할까요?")) {
      setComments((current) => current.filter((item) => item.id !== id));
    }
  };

  return {
    reaction,
    setReaction,
    comments,
    comment,
    setComment,
    editingId,
    setEditingId,
    editingContents,
    setEditingContents,
    submitComment,
    startEditing,
    saveComment,
    deleteComment,
  };
}

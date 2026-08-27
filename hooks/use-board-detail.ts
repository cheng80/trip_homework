"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  changeBoardReaction,
  createBoardComment,
  deleteBoard,
  deleteBoardComment,
  updateBoardComment,
} from "@/services/boards";
import type { BoardComment, BoardDetailData } from "@/types/boards";

export function useBoardDetail(boardId: string, board: BoardDetailData) {
  const router = useRouter();
  const [reaction, setReaction] = useState<"like" | "dislike" | null>(null);
  const [likes, setLikes] = useState(board.likes);
  const [dislikes, setDislikes] = useState(board.dislikes);
  const [reactionPending, setReactionPending] = useState(false);
  const [comments, setComments] = useState<BoardComment[]>(board.comments);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContents, setEditingContents] = useState("");
  const [status, setStatus] = useState("");

  const changeReaction = async (nextReaction: "like" | "dislike") => {
    if (reactionPending || reaction === nextReaction) return;
    setReactionPending(true);
    setStatus("");
    try {
      const count = await changeBoardReaction(boardId, nextReaction);
      if (nextReaction === "like") setLikes(count);
      else setDislikes(count);
      setReaction(nextReaction);
    } catch (error) {
      setStatus(error instanceof Error ? error.message.split("\n")[0] : "게시글 반응을 저장하지 못했습니다.");
    } finally {
      setReactionPending(false);
    }
  };

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const contents = comment.trim();
    if (!contents) return;
    const data = new FormData(form);
    const writer = String(data.get("writer") ?? "").trim();
    const password = String(data.get("password") ?? "");

    setStatus("");
    try {
      const created = await createBoardComment(boardId, contents, writer, password);
      setComments((current) => [...current, created]);
      setComment("");
      form.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message.split("\n")[0] : "댓글을 등록하지 못했습니다.");
    }
  };

  const startEditing = (item: BoardComment) => {
    setEditingId(item.id);
    setEditingContents(item.contents);
  };

  const saveComment = async (id: string) => {
    const contents = editingContents.trim();
    if (!contents) return;
    const password = window.prompt("댓글을 등록할 때 입력한 비밀번호를 입력해 주세요.");
    if (password === null) return;
    setStatus("");
    try {
      const updated = await updateBoardComment(id, contents, password);
      setComments((current) => current.map((item) => item.id === id ? updated : item));
      setEditingId(null);
    } catch (error) {
      setStatus(error instanceof Error ? error.message.split("\n")[0] : "댓글을 수정하지 못했습니다.");
    }
  };

  const deleteComment = async (id: string) => {
    if (window.confirm("댓글을 삭제할까요?")) {
      const password = window.prompt("댓글을 등록할 때 입력한 비밀번호를 입력해 주세요.");
      if (password === null) return;
      setStatus("");
      try {
        await deleteBoardComment(id, password);
        setComments((current) => current.filter((item) => item.id !== id));
      } catch (error) {
        setStatus(error instanceof Error ? error.message.split("\n")[0] : "댓글을 삭제하지 못했습니다.");
      }
    }
  };

  const deletePost = async () => {
    if (!window.confirm("게시글을 삭제할까요? 삭제한 게시글은 복구할 수 없습니다.")) return;
    setStatus("");
    try {
      await deleteBoard(boardId);
      router.push("/boards");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message.split("\n")[0] : "게시글을 삭제하지 못했습니다.");
    }
  };

  return {
    reaction,
    likes,
    dislikes,
    reactionPending,
    changeReaction,
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
    deletePost,
    status,
  };
}

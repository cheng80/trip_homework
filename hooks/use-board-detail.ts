/**
 * 역할: 트립토크 상세의 좋아요·싫어요·댓글·삭제 상태를 관리하는 클라이언트 훅입니다.
 * 처리 흐름: 낙관적 반응 수 갱신과 댓글 mutation 결과를 로컬 목록에 반영합니다.
 * 주의사항: 사용자 확인이 필요한 삭제 동작은 브라우저 대화상자 이후에만 실행합니다.
 */
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

  /** 서버가 반환한 최종 반응 수를 반영하고 같은 반응을 다시 누르면 선택 표시만 해제합니다. */
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

  /** 로그인 댓글과 비로그인 댓글을 모두 지원하도록 작성자·비밀번호를 FormData에서 함께 전달합니다. */
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

  /** 댓글 수정 비밀번호를 요청한 뒤 성공한 항목만 로컬 배열에서 교체합니다. */
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

  /** 복구할 수 없는 작업이므로 사용자 확인과 댓글 비밀번호 입력 후 실제 삭제를 호출합니다. */
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

  /** 게시글 삭제 성공 후 목록으로 이동하고 서버 컴포넌트 캐시를 새로 고칩니다. */
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

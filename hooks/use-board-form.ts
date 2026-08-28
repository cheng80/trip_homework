/**
 * 역할: 트립토크 작성·수정 폼 제출 절차를 캡슐화한 클라이언트 훅입니다.
 * 처리 흐름: 리치 텍스트 검증, 이미지 업로드, 입력 객체 조립, mutation과 상세 이동을 순서대로 수행합니다.
 * 주의사항: 검증 실패 시 에디터에 오류 상태를 표시하고 네트워크 요청을 시작하지 않습니다.
 */
"use client";

import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import {
  boardContentMaxLength,
  hasRichTextContent,
  richTextLength,
} from "@/domain/rich-text";
import { createBoard, updateBoard } from "@/services/boards";
import { uploadImageFiles } from "@/services/files";
import type { BoardFormValues } from "@/types/boards";

export function useBoardForm(
  mode: "create" | "edit",
  boardId?: string,
  initialImages: string[] = [],
) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  /**
   * 브라우저 기본 제출을 막고 에디터·파일 입력을 FormData에서 읽습니다.
   * 본문 검증이 끝난 뒤에만 업로드와 게시글 mutation을 실행합니다.
   */
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const files = data.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
    const contents = String(data.get("contents") ?? "");
    const focusContents = () => {
      const editor = form.querySelector<HTMLElement>('[data-rich-text-field="contents"] .ql-editor');
      editor?.setAttribute("aria-invalid", "true");
      editor?.focus();
    };

    // Quill의 빈 HTML은 required 속성만으로 걸러지지 않아 실제 문자열 길이로 재검증합니다.
    if (!hasRichTextContent(contents)) {
      setStatus("내용을 입력해 주세요.");
      focusContents();
      return;
    }
    if (richTextLength(contents) > boardContentMaxLength) {
      setStatus(`내용은 최대 ${boardContentMaxLength.toLocaleString()}자까지 입력할 수 있습니다.`);
      focusContents();
      return;
    }

    setPending(true);
    setStatus("");
    try {
      // 새 파일이 없으면 수정 화면에서 받은 기존 이미지 배열을 그대로 유지합니다.
      const images = files.length
        ? await uploadImageFiles(files)
        : initialImages;
      const values: BoardFormValues = {
        writer: String(data.get("writer") ?? "") || undefined,
        password: String(data.get("password") ?? "") || undefined,
        title: String(data.get("title") ?? ""),
        contents,
        address: String(data.get("address") ?? ""),
        detailAddress: String(data.get("detailAddress") ?? ""),
        zipcode: String(data.get("zipcode") ?? "") || undefined,
        images,
      };
      const board = mode === "edit" && boardId
        ? await updateBoard(boardId, values)
        : await createBoard(values);
      // 저장된 실제 ID를 사용해 생성·수정 모두 같은 상세 화면으로 이동합니다.
      router.push(`/boards/${board._id}`);
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message.split("\n")[0] : "트립토크를 저장하지 못했습니다.");
    } finally {
      setPending(false);
    }
  };

  return { status, pending, handleSubmit };
}

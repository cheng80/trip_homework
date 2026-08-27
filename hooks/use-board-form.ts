"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const files = data.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);

    setPending(true);
    setStatus("");
    try {
      const images = files.length
        ? await uploadImageFiles(files)
        : initialImages;
      const values: BoardFormValues = {
        writer: String(data.get("writer") ?? "") || undefined,
        password: String(data.get("password") ?? "") || undefined,
        title: String(data.get("title") ?? ""),
        contents: String(data.get("contents") ?? ""),
        address: String(data.get("address") ?? ""),
        detailAddress: String(data.get("detailAddress") ?? ""),
        zipcode: String(data.get("zipcode") ?? "") || undefined,
        images,
      };
      const board = mode === "edit" && boardId
        ? await updateBoard(boardId, values)
        : await createBoard(values);
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

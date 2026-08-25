"use client";

import { useState, type FormEvent } from "react";

export function useBoardForm(mode: "create" | "edit") {
  const [status, setStatus] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(mode === "edit" ? "트립토크 수정 입력이 완료되었습니다." : "트립토크 등록 입력이 완료되었습니다.");
  };

  return { status, handleSubmit };
}

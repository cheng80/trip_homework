"use client";

import { useState, type FormEvent } from "react";

export function useTravelProductForm(mode: "create" | "edit") {
  const [status, setStatus] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(mode === "edit" ? "수정 화면 입력이 완료되었습니다." : "판매 등록 화면 입력이 완료되었습니다.");
  };

  return { status, handleSubmit };
}

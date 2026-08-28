/**
 * 역할: 숙박권 등록·수정 폼의 검증과 저장 흐름을 관리하는 클라이언트 훅입니다.
 * 처리 흐름: 설명 검증, 이미지 업로드, API 입력 변환과 mutation 실행 후 상세 화면으로 이동합니다.
 * 주의사항: 요약 문구가 없으면 정제된 설명의 일반 문자열 일부를 자동 사용합니다.
 */
"use client";

import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import {
  hasRichTextContent,
  productContentMaxLength,
  richTextLength,
  richTextPlainText,
} from "@/domain/rich-text";
import { uploadImageFiles } from "@/services/files";
import { createTravelproduct, updateTravelproduct } from "@/services/travel-products";
import type { TravelProductFormValues } from "@/types/travel-products";

export function useTravelProductForm(
  mode: "create" | "edit",
  productId?: string,
  initialValues?: TravelProductFormValues,
) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);

  /**
   * 상품 폼 값을 API 입력 형태로 조립하고 이미지 업로드와 저장 mutation을 순차 실행합니다.
   * 설명이 비었거나 제한을 넘으면 서버 요청 전에 편집기로 포커스를 돌립니다.
   */
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const files = data.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
    const description = String(data.get("description") ?? "");
    const focusDescription = () => {
      const editor = form.querySelector<HTMLElement>('[data-rich-text-field="description"] .ql-editor');
      editor?.setAttribute("aria-invalid", "true");
      editor?.focus();
    };

    // HTML 태그만 존재하는 Quill 기본값을 유효한 설명으로 오인하지 않도록 검사합니다.
    if (!hasRichTextContent(description)) {
      setStatus("상세 설명을 입력해 주세요.");
      focusDescription();
      return;
    }
    if (richTextLength(description) > productContentMaxLength) {
      setStatus(`상세 설명은 최대 ${productContentMaxLength.toLocaleString()}자까지 입력할 수 있습니다.`);
      focusDescription();
      return;
    }

    setPending(true);
    setStatus("");
    try {
      // 수정 시 새 파일을 고르지 않았다면 API에 저장된 이미지 경로를 유지합니다.
      const images = files.length
        ? await uploadImageFiles(files)
        : initialValues?.images;
      const values: TravelProductFormValues = {
        name: String(data.get("name") ?? ""),
        price: String(data.get("price") ?? ""),
        address: String(data.get("address") ?? ""),
        detailAddress: String(data.get("detailAddress") ?? ""),
        description,
        remarks: initialValues?.remarks || richTextPlainText(description).slice(0, 100),
        tags: initialValues?.tags,
        zipcode: String(data.get("zipcode") ?? "") || undefined,
        images,
      };
      const product = mode === "edit" && productId
        ? await updateTravelproduct(productId, values)
        : await createTravelproduct(values);
      // 서비스 매퍼가 정규화한 화면용 ID를 사용해 상세 라우트로 이동합니다.
      router.push(`/travelproducts/${product.id}`);
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message.split("\n")[0] : "숙박권을 저장하지 못했습니다.");
    } finally {
      setPending(false);
    }
  };

  return { status, pending, handleSubmit };
}

"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

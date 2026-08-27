"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
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
    const data = new FormData(event.currentTarget);
    const files = data.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);

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
        description: String(data.get("description") ?? ""),
        remarks: initialValues?.remarks,
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

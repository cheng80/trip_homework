"use client";

import Link from "next/link";
import AddressFields from "@/components/commons/address-fields";
import BackLink from "@/components/commons/back-link";
import ImageUpload from "@/components/commons/image-upload";
import { useTravelProductForm } from "@/hooks/use-travel-product-form";
import type { TravelProductFormValues } from "@/types/travel-products";
import styles from "./travel-product-form.module.css";

type TravelProductFormProps = {
  mode: "create" | "edit";
  initialValues?: TravelProductFormValues;
};

export default function TravelProductForm({ mode, initialValues }: TravelProductFormProps) {
  const isEdit = mode === "edit";
  const { status, handleSubmit } = useTravelProductForm(mode);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <BackLink className={styles.back} href={isEdit ? "/travelproducts/1" : "/travelproducts"}>
          {isEdit ? "숙박권 상세" : "숙박권 목록"}
        </BackLink>

        <h1>{isEdit ? "숙박권 판매 수정" : "숙박권 판매하기"}</h1>
        <p className={styles.intro}>
          숙박권 정보를 입력해 주세요. 별표 표시 항목은 반드시 입력해야 합니다.
        </p>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <fieldset>
            <legend>상품 정보</legend>
            <div className={styles.field}>
              <label htmlFor="name">상품명 *</label>
              <input
                id="name"
                name="name"
                defaultValue={initialValues?.name ?? ""}
                maxLength={50}
                placeholder="숙박권 이름을 입력해 주세요."
                required
              />
              <small>최대 50자</small>
            </div>

            <div className={styles.field}>
              <label htmlFor="price">판매 가격 *</label>
              <div className={styles.priceField}>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="1000"
                  step="100"
                  defaultValue={initialValues?.price ?? ""}
                  placeholder="0"
                  required
                />
                <span>원</span>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>숙소 위치</legend>
            <AddressFields
              initialAddress={initialValues?.address}
              initialDetailAddress={initialValues?.detailAddress}
              detailPlaceholder="동·호수 또는 찾아오는 방법을 입력해 주세요."
            />
          </fieldset>

          <fieldset>
            <legend>상품 설명</legend>
            <div className={styles.field}>
              <label htmlFor="description">상세 설명 *</label>
              <textarea
                id="description"
                name="description"
                defaultValue={initialValues?.description ?? ""}
                maxLength={1000}
                placeholder="사용 기한과 이용 조건 등 구매자에게 필요한 정보를 작성해 주세요."
                required
              />
              <small>최대 1,000자</small>
            </div>
          </fieldset>

          <fieldset>
            <legend>사진 첨부</legend>
            <ImageUpload
              previews={isEdit ? [
                {
                  src: "/images/트립토크%2C숙박권 판매 등록 이미지/160x160.png",
                  alt: "등록된 숙소 사진 1",
                },
                {
                  src: "/images/트립토크%2C숙박권 판매 등록 이미지/100x100.png",
                  alt: "등록된 숙소 사진 2",
                },
              ] : []}
            />
          </fieldset>

          <div className={styles.actions}>
            <Link href={isEdit ? "/travelproducts/1" : "/travelproducts"}>취소</Link>
            <button type="submit">{isEdit ? "수정하기" : "판매 등록하기"}</button>
          </div>
          <p className={styles.status} role="status" aria-live="polite">{status}</p>
        </form>
      </div>

    </main>
  );
}

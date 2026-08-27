"use client";

import Link from "next/link";
import AddressFields from "@/components/commons/address-fields";
import BackLink from "@/components/commons/back-link";
import ImageUpload from "@/components/commons/image-upload";
import { useBoardForm } from "@/hooks/use-board-form";
import type { BoardFormValues } from "@/types/boards";
import styles from "./board-form.module.css";

type BoardFormProps = {
  mode: "create" | "edit";
  boardId?: string;
  initialValues?: BoardFormValues;
};

export default function BoardForm({ mode, boardId = "1", initialValues }: BoardFormProps) {
  const isEdit = mode === "edit";
  const { status, pending, handleSubmit } = useBoardForm(mode, boardId, initialValues?.images);

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <BackLink className={styles.back} href={isEdit ? `/boards/${boardId}` : "/boards"}>
          {isEdit ? "트립토크 상세" : "트립토크 목록"}
        </BackLink>

        <h1>{isEdit ? "트립토크 수정" : "트립토크 등록"}</h1>
        <p className={styles.intro}>여행 이야기를 작성해 주세요. 별표 표시 항목은 반드시 입력해야 합니다.</p>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <fieldset>
            <legend>게시글 정보</legend>
            {!isEdit && (
              <div className={styles.field}>
                <label htmlFor="writer">작성자 *</label>
                <input
                  id="writer"
                  name="writer"
                  maxLength={20}
                  placeholder="작성자 이름을 입력해 주세요."
                  required
                />
              </div>
            )}

            <div className={styles.field}>
              <label htmlFor="board-password">게시글 비밀번호 *</label>
              <input
                id="board-password"
                name="password"
                type="password"
                minLength={4}
                autoComplete={isEdit ? "current-password" : "new-password"}
                placeholder="4자 이상 입력해 주세요."
                required
              />
              <small>{isEdit ? "등록할 때 입력한 비밀번호를 입력해 주세요." : "게시글 수정·삭제에 사용됩니다."}</small>
            </div>
            <div className={styles.field}>
              <label htmlFor="title">제목 *</label>
              <input
                id="title"
                name="title"
                defaultValue={initialValues?.title ?? ""}
                maxLength={100}
                placeholder="제목을 입력해 주세요."
                required
              />
              <small>최대 100자</small>
            </div>

            <div className={styles.field}>
              <label htmlFor="contents">내용 *</label>
              <textarea
                id="contents"
                name="contents"
                defaultValue={initialValues?.contents ?? ""}
                maxLength={2000}
                placeholder="여행에서 경험한 이야기를 들려주세요."
                required
              />
              <small>최대 2,000자</small>
            </div>
          </fieldset>

          <fieldset>
            <legend>여행 위치</legend>
            <AddressFields
              initialAddress={initialValues?.address}
              initialDetailAddress={initialValues?.detailAddress}
              initialZipcode={initialValues?.zipcode}
              detailPlaceholder="장소 이름이나 자세한 위치를 입력해 주세요."
            />
          </fieldset>

          <fieldset>
            <legend>사진 첨부</legend>
            <ImageUpload
              previews={(initialValues?.images ?? []).map((src, index) => ({
                src,
                alt: `첨부된 여행 사진 ${index + 1}`,
              }))}
            />
          </fieldset>

          <div className={styles.actions}>
            <Link href={isEdit ? `/boards/${boardId}` : "/boards"}>취소</Link>
            <button type="submit" disabled={pending}>
              {pending ? "저장 중..." : isEdit ? "수정하기" : "등록하기"}
            </button>
          </div>
          <p className={styles.status} role="status" aria-live="polite">{status}</p>
        </form>
      </div>

    </main>
  );
}

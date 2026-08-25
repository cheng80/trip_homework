"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import KakaoPostcodeEmbed, { type Address } from "react-daum-postcode";
import styles from "../../travelproducts/_components/travel-product-form.module.css";

type BoardFormProps = {
  mode: "create" | "edit";
  boardId?: string;
};

const editValues = {
  title: "바다와 하늘이 맞닿은 산토리니에서 보낸 하루",
  contents:
    "오래 기다렸던 산토리니 여행을 다녀왔어요. 하얀 골목 사이로 보이는 푸른 바다와 천천히 지는 노을이 정말 아름다웠습니다.",
  address: "그리스 산토리니 이아",
  detailAddress: "이아 마을 전망대 인근",
};

export default function BoardForm({ mode, boardId = "1" }: BoardFormProps) {
  const isEdit = mode === "edit";
  const [address, setAddress] = useState(isEdit ? editValues.address : "");
  const [status, setStatus] = useState("");
  const postcodeDialog = useRef<HTMLDialogElement>(null);
  const postcodeTrigger = useRef<HTMLButtonElement>(null);
  const detailAddressInput = useRef<HTMLInputElement>(null);

  const handleAddressComplete = (data: Address) => {
    const selectedAddress = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;

    setAddress(selectedAddress || data.address);
    postcodeDialog.current?.close();
    requestAnimationFrame(() => detailAddressInput.current?.focus());
  };

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link className={styles.back} href={isEdit ? `/boards/${boardId}` : "/boards"}>
          <Image src="/icon/outline/left_arrow.svg" alt="" width={20} height={20} />
          {isEdit ? "트립토크 상세" : "트립토크 목록"}
        </Link>

        <h1>{isEdit ? "트립토크 수정" : "트립토크 등록"}</h1>
        <p className={styles.intro}>여행 이야기를 작성해 주세요. 별표 표시 항목은 반드시 입력해야 합니다.</p>

        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            setStatus(isEdit ? "트립토크 수정 입력이 완료되었습니다." : "트립토크 등록 입력이 완료되었습니다.");
          }}
        >
          <fieldset>
            <legend>게시글 정보</legend>
            <div className={styles.field}>
              <label htmlFor="title">제목 *</label>
              <input
                id="title"
                name="title"
                defaultValue={isEdit ? editValues.title : ""}
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
                defaultValue={isEdit ? editValues.contents : ""}
                maxLength={2000}
                placeholder="여행에서 경험한 이야기를 들려주세요."
                required
              />
              <small>최대 2,000자</small>
            </div>
          </fieldset>

          <fieldset>
            <legend>여행 위치</legend>
            <div className={styles.field}>
              <label htmlFor="address">주소 *</label>
              <div className={styles.addressField}>
                <input
                  id="address"
                  name="address"
                  value={address}
                  autoComplete="street-address"
                  placeholder="주소 검색 후 입력해 주세요."
                  readOnly
                  required
                />
                <button
                  ref={postcodeTrigger}
                  type="button"
                  onClick={() => postcodeDialog.current?.showModal()}
                >
                  주소 검색
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="detail-address">상세 위치 *</label>
              <input
                id="detail-address"
                name="detailAddress"
                ref={detailAddressInput}
                autoComplete="address-line2"
                defaultValue={isEdit ? editValues.detailAddress : ""}
                placeholder="장소 이름이나 자세한 위치를 입력해 주세요."
                required
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>사진 첨부</legend>
            <div className={styles.uploadArea}>
              <label className={styles.uploadButton} htmlFor="images">
                <Image src="/icon/outline/add.svg" alt="" width={28} height={28} />
                <span>사진 추가</span>
                <small>최대 4장</small>
              </label>
              <input
                className={styles.fileInput}
                id="images"
                name="images"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
              />

              {isEdit && (
                <>
                  <div className={styles.preview}>
                    <Image
                      src="/images/트립토크,숙박권 판매 등록 이미지/160x160.png"
                      alt="첨부된 여행 사진 1"
                      fill
                      sizes="160px"
                      loading="eager"
                    />
                  </div>
                  <div className={styles.preview}>
                    <Image
                      src="/images/트립토크,숙박권 판매 등록 이미지/100x100.png"
                      alt="첨부된 여행 사진 2"
                      fill
                      sizes="160px"
                    />
                  </div>
                </>
              )}
            </div>
          </fieldset>

          <div className={styles.actions}>
            <Link href={isEdit ? `/boards/${boardId}` : "/boards"}>취소</Link>
            <button type="submit">{isEdit ? "수정하기" : "등록하기"}</button>
          </div>
          <p className={styles.status} role="status" aria-live="polite">{status}</p>
        </form>
      </div>

      <dialog
        className={styles.postcodeDialog}
        ref={postcodeDialog}
        aria-labelledby="postcode-title"
        onClose={() => postcodeTrigger.current?.focus()}
      >
        <div className={styles.postcodeHeader}>
          <h2 id="postcode-title">주소 검색</h2>
          <button
            type="button"
            onClick={() => postcodeDialog.current?.close()}
            aria-label="주소 검색 닫기"
          >
            <Image src="/icon/outline/close.svg" alt="" width={24} height={24} />
          </button>
        </div>
        <KakaoPostcodeEmbed
          autoClose={false}
          onComplete={handleAddressComplete}
          onClose={() => postcodeDialog.current?.close()}
          style={{ width: "100%", height: "min(62vh, 480px)" }}
          errorMessage={<p className={styles.postcodeError}>주소 검색을 불러오지 못했습니다.</p>}
        />
      </dialog>
    </main>
  );
}

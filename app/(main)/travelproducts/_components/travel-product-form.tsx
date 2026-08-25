"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styles from "./travel-product-form.module.css";

type TravelProductFormProps = {
  mode: "create" | "edit";
};

const editValues = {
  name: "당장 가고 싶은 숲속 감성 스테이",
  price: "32900",
  address: "경상북도 포항시 북구 송라면",
  detailAddress: "구매 완료 후 정확한 주소를 안내합니다.",
  description:
    "포항의 조용한 숲길 끝에 자리한 독채 숙소입니다. 객실과 테라스, 불멍 공간을 단독으로 이용할 수 있습니다.",
};

export default function TravelProductForm({ mode }: TravelProductFormProps) {
  const isEdit = mode === "edit";
  const [status, setStatus] = useState("");

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link className={styles.back} href={isEdit ? "/travelproducts/1" : "/travelproducts"}>
          <Image src="/icon/outline/left_arrow.svg" alt="" width={20} height={20} />
          {isEdit ? "숙박권 상세" : "숙박권 목록"}
        </Link>

        <h1>{isEdit ? "숙박권 판매 수정" : "숙박권 판매하기"}</h1>
        <p className={styles.intro}>
          숙박권 정보를 입력해 주세요. 별표 표시 항목은 반드시 입력해야 합니다.
        </p>

        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            setStatus(isEdit ? "수정 화면 입력이 완료되었습니다." : "판매 등록 화면 입력이 완료되었습니다.");
          }}
        >
          <fieldset>
            <legend>상품 정보</legend>
            <div className={styles.field}>
              <label htmlFor="name">상품명 *</label>
              <input
                id="name"
                name="name"
                defaultValue={isEdit ? editValues.name : ""}
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
                  defaultValue={isEdit ? editValues.price : ""}
                  placeholder="0"
                  required
                />
                <span>원</span>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>숙소 위치</legend>
            <div className={styles.field}>
              <label htmlFor="address">주소 *</label>
              <div className={styles.addressField}>
                <input
                  id="address"
                  name="address"
                  defaultValue={isEdit ? editValues.address : ""}
                  placeholder="주소 검색 후 입력해 주세요."
                  required
                />
                <button type="button">주소 검색</button>
              </div>
              <small>주소 검색은 주소 API 연결 후 동작합니다.</small>
            </div>

            <div className={styles.field}>
              <label htmlFor="detail-address">상세 위치 *</label>
              <input
                id="detail-address"
                name="detailAddress"
                defaultValue={isEdit ? editValues.detailAddress : ""}
                placeholder="동·호수 또는 찾아오는 방법을 입력해 주세요."
                required
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>상품 설명</legend>
            <div className={styles.field}>
              <label htmlFor="description">상세 설명 *</label>
              <textarea
                id="description"
                name="description"
                defaultValue={isEdit ? editValues.description : ""}
                maxLength={1000}
                placeholder="사용 기한과 이용 조건 등 구매자에게 필요한 정보를 작성해 주세요."
                required
              />
              <small>최대 1,000자</small>
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
                      alt="등록된 숙소 사진 1"
                      fill
                      sizes="160px"
                    />
                  </div>
                  <div className={styles.preview}>
                    <Image
                      src="/images/트립토크,숙박권 판매 등록 이미지/100x100.png"
                      alt="등록된 숙소 사진 2"
                      fill
                      sizes="160px"
                    />
                  </div>
                </>
              )}
            </div>
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

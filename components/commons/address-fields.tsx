/**
 * 역할: 주소 검색과 상세 주소 입력을 여러 작성 폼에서 공유하는 클라이언트 컴포넌트입니다.
 * 처리 흐름: Daum 우편번호 창의 선택 결과를 제어 상태로 보관하고 숨은 우편번호 필드까지 제출합니다.
 * 주의사항: 외부 주소 검색 UI는 브라우저에서만 열리도록 사용자 동작 시점에 표시합니다.
 */
"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import KakaoPostcodeEmbed, { type Address } from "react-daum-postcode";
import Dialog from "./dialog";
import styles from "./address-fields.module.css";

type AddressFieldsProps = {
  initialAddress?: string;
  initialDetailAddress?: string;
  initialZipcode?: string;
  detailPlaceholder: string;
};

export default function AddressFields({
  initialAddress = "",
  initialDetailAddress = "",
  initialZipcode = "",
  detailPlaceholder,
}: AddressFieldsProps) {
  const [address, setAddress] = useState(initialAddress);
  const [zipcode, setZipcode] = useState(initialZipcode);
  const postcodeDialog = useRef<HTMLDialogElement>(null);
  const postcodeTrigger = useRef<HTMLButtonElement>(null);
  const detailAddressInput = useRef<HTMLInputElement>(null);

  const handleAddressComplete = (data: Address) => {
    const selectedAddress = data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;

    setAddress(selectedAddress || data.address);
    setZipcode(data.zonecode);
    postcodeDialog.current?.close();
    requestAnimationFrame(() => detailAddressInput.current?.focus());
  };

  return (
    <>
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
          <input name="zipcode" type="hidden" value={zipcode} />
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
          defaultValue={initialDetailAddress}
          placeholder={detailPlaceholder}
          required
        />
      </div>

      <Dialog
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
      </Dialog>
    </>
  );
}

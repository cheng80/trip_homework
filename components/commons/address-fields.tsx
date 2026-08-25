"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import KakaoPostcodeEmbed, { type Address } from "react-daum-postcode";
import styles from "./address-fields.module.css";

type AddressFieldsProps = {
  initialAddress?: string;
  initialDetailAddress?: string;
  detailPlaceholder: string;
};

export default function AddressFields({
  initialAddress = "",
  initialDetailAddress = "",
  detailPlaceholder,
}: AddressFieldsProps) {
  const [address, setAddress] = useState(initialAddress);
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
    </>
  );
}

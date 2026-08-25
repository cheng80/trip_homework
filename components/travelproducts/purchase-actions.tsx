"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import styles from "./purchase-actions.module.css";

type PurchaseActionsProps = {
  productId: string;
  price: string;
  currentPoints: string;
  shortfall: string;
};

export default function PurchaseActions({
  productId,
  price,
  currentPoints,
  shortfall,
}: PurchaseActionsProps) {
  const confirmDialog = useRef<HTMLDialogElement>(null);
  const pointDialog = useRef<HTMLDialogElement>(null);

  const showPointDialog = () => {
    confirmDialog.current?.close();
    pointDialog.current?.showModal();
  };

  return (
    <>
      <button
        className={styles.buyButton}
        type="button"
        onClick={() => confirmDialog.current?.showModal()}
      >
        구매하기
      </button>
      <Link className={styles.editLink} href={`/travelproducts/${productId}/edit`}>
        판매글 수정 화면 보기
      </Link>

      <dialog className={styles.dialog} ref={confirmDialog} aria-labelledby="confirm-title">
        <form method="dialog">
          <button className={styles.closeButton} type="submit" aria-label="구매 팝업 닫기">
            <Image src="/icon/outline/close.svg" alt="" width={24} height={24} />
          </button>
          <h2 id="confirm-title">숙박권을 구매하시겠어요?</h2>
          <p>구매 금액 {price}이 보유 포인트에서 차감됩니다.</p>
          <div className={styles.dialogButtons}>
            <button type="submit">취소</button>
            <button type="button" onClick={showPointDialog}>구매하기</button>
          </div>
        </form>
      </dialog>

      <dialog className={styles.dialog} ref={pointDialog} aria-labelledby="point-title">
        <form method="dialog">
          <button className={styles.closeButton} type="submit" aria-label="포인트 팝업 닫기">
            <Image src="/icon/outline/close.svg" alt="" width={24} height={24} />
          </button>
          <h2 id="point-title">포인트가 부족해요</h2>
          <p>현재 보유 포인트는 {currentPoints}입니다. 충전 후 다시 구매해 주세요.</p>
          <div className={styles.pointSummary}>
            <span>부족한 포인트</span>
            <strong>{shortfall}</strong>
          </div>
          <div className={styles.dialogButtons}>
            <button type="submit">다음에</button>
            <button type="submit">포인트 충전하기</button>
          </div>
        </form>
      </dialog>
    </>
  );
}

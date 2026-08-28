/**
 * 역할: 숙박권 찜·구매·수정·삭제 요청과 버튼 상태를 관리하는 클라이언트 컴포넌트입니다.
 * 처리 흐름: 인증 사용자 확인 후 각 mutation을 실행하고 결과에 맞춰 로컬 수치와 라우트를 갱신합니다.
 * 주의사항: 인증 오류는 로그인으로 보내고 중복 요청은 pending 상태로 차단합니다.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isAuthenticationErrorMessage } from "@/app/api/graphql/auth-session";
import Dialog from "@/components/commons/dialog";
import { getLoggedInUser } from "@/services/account";
import {
  buyTravelproduct,
  deleteTravelproduct,
  toggleTravelproductPick,
} from "@/services/travel-products";
import styles from "./purchase-actions.module.css";

type PurchaseActionsProps = {
  productId: string;
  price: string;
  currentPoints: string;
  sellerId?: string;
  initialPickedCount: number;
};

export default function PurchaseActions({
  productId,
  price,
  currentPoints,
  sellerId,
  initialPickedCount,
}: PurchaseActionsProps) {
  const router = useRouter();
  const confirmDialog = useRef<HTMLDialogElement>(null);
  const pointDialog = useRef<HTMLDialogElement>(null);
  const priceAmount = Number(price.replace(/[^0-9]/g, ""));
  const [points, setPoints] = useState(Number(currentPoints.replace(/[^0-9]/g, "")));
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);
  const [status, setStatus] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [pickedCount, setPickedCount] = useState(initialPickedCount);
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    getLoggedInUser().then((user) => setCurrentUserId(user.id)).catch(() => setCurrentUserId(""));
  }, []);

  const isOwner = Boolean(currentUserId && currentUserId === sellerId);

  const togglePick = async () => {
    setStatus("");
    try {
      const nextCount = await toggleTravelproductPick(productId);
      setPicked(nextCount > pickedCount);
      setPickedCount(nextCount);
    } catch (error) {
      const message = error instanceof Error ? error.message.split("\n")[0] : "찜 상태를 변경하지 못했습니다.";
      if (isAuthenticationErrorMessage(message)) router.push("/login");
      else setStatus(message);
    }
  };

  const deleteProduct = async () => {
    if (!window.confirm("판매글을 삭제할까요? 삭제한 판매글은 복구할 수 없습니다.")) return;
    setStatus("");
    try {
      await deleteTravelproduct(productId);
      router.push("/travelproducts");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message.split("\n")[0] : "판매글을 삭제하지 못했습니다.");
    }
  };

  const openConfirmDialog = async () => {
    setComplete(false);
    setStatus("");
    try {
      const user = await getLoggedInUser();
      setPoints(user.points);
      confirmDialog.current?.showModal();
    } catch (error) {
      const message = error instanceof Error ? error.message.split("\n")[0] : "로그인 정보를 확인하지 못했습니다.";
      if (isAuthenticationErrorMessage(message)) router.push("/login");
      else {
        setStatus(message);
        confirmDialog.current?.showModal();
      }
    }
  };

  const purchase = async () => {
    setPending(true);
    setStatus("");
    try {
      await buyTravelproduct(productId);
      setPoints((current) => Math.max(0, current - priceAmount));
      setComplete(true);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message.split("\n")[0] : "숙박권을 구매하지 못했습니다.";
      if (/포인트|잔액|balance/i.test(message)) {
        confirmDialog.current?.close();
        pointDialog.current?.showModal();
      } else {
        setStatus(message);
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      {currentUserId !== null && !isOwner && (
        <button
          className={styles.buyButton}
          type="button"
          onClick={() => void openConfirmDialog()}
        >
          구매하기
        </button>
      )}
      <button className={styles.pickButton} type="button" aria-pressed={picked} onClick={() => void togglePick()}>
        {picked ? "찜 취소" : "찜하기"} {pickedCount}
      </button>
      {isOwner && (
        <div className={styles.ownerActions}>
          <Link href={`/travelproducts/${productId}/edit`}>판매글 수정</Link>
          <button type="button" onClick={() => void deleteProduct()}>판매글 삭제</button>
        </div>
      )}
      {status && <p className={styles.status} role="status" aria-live="polite">{status}</p>}

      <Dialog className={styles.dialog} ref={confirmDialog} aria-labelledby="confirm-title">
        <form method="dialog">
          <button className={styles.closeButton} type="submit" aria-label="구매 팝업 닫기">
            <Image src="/icon/outline/close.svg" alt="" width={24} height={24} />
          </button>
          <h2 id="confirm-title">{complete ? "숙박권 구매 완료" : "숙박권을 구매하시겠어요?"}</h2>
          <p>{complete ? "마이페이지에서 구매한 숙박권을 확인해 주세요." : `구매 금액 ${price}이 보유 포인트에서 차감됩니다.`}</p>
          {status && <p role="alert">{status}</p>}
          <div className={styles.dialogButtons}>
            {complete ? (
              <button type="submit">확인</button>
            ) : (
              <>
                <button type="submit">취소</button>
                <button type="button" disabled={pending} onClick={() => void purchase()}>
                  {pending ? "구매 중..." : "구매하기"}
                </button>
              </>
            )}
          </div>
        </form>
      </Dialog>

      <Dialog className={styles.dialog} ref={pointDialog} aria-labelledby="point-title">
        <form method="dialog">
          <button className={styles.closeButton} type="submit" aria-label="포인트 팝업 닫기">
            <Image src="/icon/outline/close.svg" alt="" width={24} height={24} />
          </button>
          <h2 id="point-title">포인트가 부족해요</h2>
          <p>현재 보유 포인트는 {points.toLocaleString()}P입니다. 충전 후 다시 구매해 주세요.</p>
          <div className={styles.pointSummary}>
            <span>부족한 포인트</span>
            <strong>{Math.max(0, priceAmount - points).toLocaleString()}P</strong>
          </div>
          <div className={styles.dialogButtons}>
            <button type="submit">다음에</button>
            <Link href="/mypage?charge=1">포인트 충전하기</Link>
          </div>
        </form>
      </Dialog>
    </>
  );
}

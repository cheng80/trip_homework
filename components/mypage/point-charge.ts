/**
 * 역할: 더미 포인트 충전 금액과 브라우저 저장 데이터를 관리하는 순수 유틸리티입니다.
 * 처리 흐름: 금액 정규화, 사용자별 저장 키, 충전 내역 직렬화와 합산 로직을 제공합니다.
 * 주의사항: 결제 API와 연결되지 않은 로컬 보정값이라는 범위를 유지합니다.
 */
import type { MypageData } from "@/types/mypage";

export type StoredPointCharge = { id: string; date: string; amount: number };

export function getPointChargeStorageKey(memberId: string) {
  return `triptrip:point-charges:${memberId}`;
}

export function getChargeAmount(value: string) {
  return Number(value.replace(/\D/g, ""));
}

export function getChargeError(amount: number) {
  if (!amount) return "충전할 금액을 선택하거나 입력해 주세요.";
  if (amount < 1000) return "1,000P 이상부터 충전할 수 있어요.";
  return null;
}

export function applyPointCharge(data: MypageData, amount: number, id: string, date: string) {
  return {
    ...data,
    member: { ...data.member, points: data.member.points + amount },
    pointHistory: [
      { id, date, description: "포인트 충전", amount },
      ...data.pointHistory,
    ],
  };
}

export function parseStoredPointCharges(value: string | null): StoredPointCharge[] {
  if (!value) return [];

  try {
    const charges: unknown = JSON.parse(value);
    if (!Array.isArray(charges)) return [];
    return charges.filter((charge): charge is StoredPointCharge => (
      typeof charge === "object"
      && charge !== null
      && typeof charge.id === "string"
      && typeof charge.date === "string"
      && typeof charge.amount === "number"
      && Number.isFinite(charge.amount)
      && charge.amount > 0
    ));
  } catch {
    return [];
  }
}

export function applyStoredPointCharges(data: MypageData, charges: StoredPointCharge[]) {
  return charges.reduce(
    (current, charge) => applyPointCharge(current, charge.amount, charge.id, charge.date),
    data,
  );
}

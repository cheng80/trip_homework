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

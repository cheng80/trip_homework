export function getChargeAmount(value: string) {
  return Number(value.replace(/\D/g, ""));
}

export function getChargeError(amount: number) {
  if (!amount) return "충전할 금액을 선택하거나 입력해 주세요.";
  if (amount < 1000) return "1,000P 이상부터 충전할 수 있어요.";
  return null;
}

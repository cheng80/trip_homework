import type { MypagePointHistory } from "@/types/mypage";

export type PointHistoryPeriod = 1 | 3 | 6;

function pointHistoryTime(date: string) {
  const [year, month, day] = date.match(/\d+/g)?.map(Number) ?? [];
  return year && month && day ? Date.UTC(year, month - 1, day) : Number.NaN;
}

export function filterPointHistoryByPeriod(
  history: MypagePointHistory[],
  months: PointHistoryPeriod,
  now = new Date(),
) {
  const boundary = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - months, now.getUTCDate());
  return history.filter((item) => pointHistoryTime(item.date) >= boundary);
}

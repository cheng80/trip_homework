/**
 * 역할: 포인트 내역을 선택한 조회 기간으로 필터링하는 순수 함수입니다.
 * 처리 흐름: 현재 시각을 기준으로 개월 수 경계를 계산하고 생성일이 범위 안인 항목만 반환합니다.
 * 주의사항: 날짜 파싱에 실패한 항목은 잘못 노출되지 않도록 제외합니다.
 */
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

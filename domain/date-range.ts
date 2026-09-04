/**
 * 역할: 검색 기간 달력의 날짜 계산과 표시 형식을 담당합니다.
 * 처리 흐름: ISO 날짜를 받아 범위 선택, 달력 칸, 화면 표시 문자열을 만듭니다.
 * 주의사항: 로컬 달력을 기준으로 하며 UTC 변환을 사용하지 않습니다.
 */

export type DateRangeValue = {
  start: string;
  end: string;
};

export function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateKo(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${year}. ${month}. ${day}`;
}

export function formatDateRange(start: string, end: string) {
  if (!start) return "";
  if (!end) return formatDateKo(start);
  return `${formatDateKo(start)} - ${formatDateKo(end)}`;
}

export function formatDateAria(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

export function selectRangeDate(current: DateRangeValue, iso: string): DateRangeValue {
  if (!current.start || current.end) return { start: iso, end: "" };
  return iso < current.start
    ? { start: iso, end: current.start }
    : { start: current.start, end: iso };
}

export function shiftMonth(year: number, month: number, delta: number) {
  const date = new Date(year, month - 1 + delta, 1);
  return { year: date.getFullYear(), month: date.getMonth() + 1 };
}

export function monthCells(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const cells: Array<string | null> = Array.from({ length: firstDay }, () => null);
  for (let day = 1; day <= lastDate; day += 1) {
    cells.push(toIsoDate(new Date(year, month - 1, day)));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function dateRangeState(iso: string, start: string, end: string) {
  if (!start) return "";
  if (iso === start && iso === end) return "single";
  if (iso === start) return "start";
  if (iso === end) return "end";
  if (end && iso > start && iso < end) return "between";
  return "";
}

export function dateBoundary(value: string | undefined, end = false) {
  return value ? `${value}T${end ? "23:59:59.999" : "00:00:00.000"}Z` : undefined;
}

export function inDateRange(iso: string, start: string, end: string) {
  const date = iso.slice(0, 10);
  return (!start || date >= start) && (!end || date <= end);
}

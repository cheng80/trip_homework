import assert from "node:assert/strict";
import test from "node:test";
import { filterPointHistoryByPeriod } from "./point-history.ts";

const history = [
  { id: "1", date: "2026. 08. 20", description: "최근 충전", amount: 10000 },
  { id: "2", date: "2026. 05. 28", description: "3개월 경계", amount: -5000 },
  { id: "3", date: "2026. 02. 27", description: "6개월 이전", amount: 30000 },
];

test("선택한 개월 수 안의 포인트 내역만 표시한다", () => {
  const now = new Date("2026-08-28T00:00:00.000Z");

  assert.deepEqual(filterPointHistoryByPeriod(history, 1, now).map(({ id }) => id), ["1"]);
  assert.deepEqual(filterPointHistoryByPeriod(history, 3, now).map(({ id }) => id), ["1", "2"]);
  assert.deepEqual(filterPointHistoryByPeriod(history, 6, now).map(({ id }) => id), ["1", "2"]);
});

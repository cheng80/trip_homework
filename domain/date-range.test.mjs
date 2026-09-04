import assert from "node:assert/strict";
import test from "node:test";
import {
  dateRangeState,
  dateBoundary,
  formatDateRange,
  inDateRange,
  monthCells,
  selectRangeDate,
  shiftMonth,
} from "./date-range.ts";

test("날짜 범위 선택과 달력 칸을 계산한다", () => {
  assert.deepEqual(selectRangeDate({ start: "", end: "" }, "2026-09-04"), {
    start: "2026-09-04",
    end: "",
  });
  assert.deepEqual(selectRangeDate({ start: "2026-09-04", end: "" }, "2026-09-10"), {
    start: "2026-09-04",
    end: "2026-09-10",
  });
  assert.deepEqual(selectRangeDate({ start: "2026-09-10", end: "" }, "2026-09-04"), {
    start: "2026-09-04",
    end: "2026-09-10",
  });
  assert.deepEqual(selectRangeDate({ start: "2026-09-04", end: "2026-09-10" }, "2026-09-01"), {
    start: "2026-09-01",
    end: "",
  });
  assert.equal(formatDateRange("2026-09-04", "2026-09-10"), "2026. 09. 04 - 2026. 09. 10");
  assert.deepEqual(shiftMonth(2026, 1, -1), { year: 2025, month: 12 });
  assert.equal(monthCells(2026, 9)[2], "2026-09-01");
  assert.equal(dateRangeState("2026-09-07", "2026-09-04", "2026-09-10"), "between");
  assert.equal(dateBoundary("2026-09-04"), "2026-09-04T00:00:00.000Z");
  assert.equal(dateBoundary("2026-09-10", true), "2026-09-10T23:59:59.999Z");
  assert.equal(inDateRange("2026-09-07T12:00:00.000Z", "2026-09-04", "2026-09-10"), true);
  assert.equal(inDateRange("2026-09-03", "2026-09-04", "2026-09-10"), false);
});

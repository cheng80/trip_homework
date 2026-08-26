import assert from "node:assert/strict";
import test from "node:test";
import { getChargeAmount, getChargeError } from "./point-charge.ts";

test("포인트 충전 금액을 정규화하고 검증한다", () => {
  assert.equal(getChargeAmount("50,000원"), 50000);
  assert.equal(getChargeError(0), "충전할 금액을 선택하거나 입력해 주세요.");
  assert.equal(getChargeError(500), "1,000P 이상부터 충전할 수 있어요.");
  assert.equal(getChargeError(1000), null);
});

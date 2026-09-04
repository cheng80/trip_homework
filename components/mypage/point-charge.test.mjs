import assert from "node:assert/strict";
import test from "node:test";
import {
  applyPointCharge,
  applyStoredPointCharges,
  getChargeAmount,
  getChargeError,
  parseStoredPointCharges,
} from "./point-charge.ts";

test("포인트 충전 금액을 정규화하고 검증한다", () => {
  assert.equal(getChargeAmount("50,000원"), 50000);
  assert.equal(getChargeError(0), "충전할 금액을 선택하거나 입력해 주세요.");
  assert.equal(getChargeError(500), "1,000P 이상부터 충전할 수 있어요.");
  assert.equal(getChargeError(1000), null);
});

test("충전 금액을 보유 포인트와 사용 내역에 반영한다", () => {
  const data = {
    member: { id: "member", name: "김택권", email: "cheng80@gmail.com", profile: "", points: 1000 },
    transactions: [],
    bookmarks: [],
    pointHistory: [],
    boughtCount: 0,
    soldCount: 0,
    bookmarkCount: 0,
  };

  const charged = applyPointCharge(data, 3000, "charge-1", "2026. 08. 27");

  assert.equal(charged.member.points, 4000);
  assert.deepEqual(charged.pointHistory[0], {
    id: "charge-1",
    date: "2026. 08. 27",
    description: "포인트 충전",
    amount: 3000,
  });
});

test("사용자별로 저장된 더미 충전 내역을 다시 반영한다", () => {
  const data = {
    member: { id: "member", name: "김택권", email: "cheng80@gmail.com", profile: "", points: 1000 },
    transactions: [],
    bookmarks: [],
    pointHistory: [],
    boughtCount: 0,
    soldCount: 0,
    bookmarkCount: 0,
  };
  const stored = JSON.stringify([
    { id: "local-charge-1", date: "2026. 08. 27", amount: 3000 },
    { id: "local-charge-2", date: "2026. 08. 28", amount: 5000 },
  ]);

  const charges = parseStoredPointCharges(stored);
  const restored = applyStoredPointCharges(data, charges);

  assert.equal(restored.member.points, 9000);
  assert.deepEqual(restored.pointHistory.map(({ id }) => id), ["local-charge-2", "local-charge-1"]);
  assert.deepEqual(parseStoredPointCharges("not-json"), []);
});

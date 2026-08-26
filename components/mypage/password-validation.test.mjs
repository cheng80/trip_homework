import assert from "node:assert/strict";
import test from "node:test";
import { validatePasswordChange } from "./password-validation.ts";

test("비밀번호 변경 입력을 검증한다", () => {
  assert.equal(validatePasswordChange("current123", "next12345", "next12345"), null);
  assert.equal(validatePasswordChange("current123", "current123", "current123").field, "newPassword");
  assert.equal(validatePasswordChange("current123", "next12345", "other1234").field, "passwordCheck");
});

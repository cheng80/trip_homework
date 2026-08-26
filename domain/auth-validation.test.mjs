import assert from "node:assert/strict";
import test from "node:test";
import { validateAuthInput } from "./auth-validation.ts";

test("로그인과 회원가입 입력을 UI 밖에서 검증한다", () => {
  assert.deepEqual(validateAuthInput("login", { email: "", password: "" }), {
    email: "아이디 또는 비밀번호를 확인해 주세요.",
    password: "아이디 또는 비밀번호를 확인해 주세요.",
  });

  assert.deepEqual(
    validateAuthInput("signup", {
      email: "trip@example.com",
      name: "김트립",
      password: "password123",
      passwordCheck: "different123",
    }),
    { passwordCheck: "비밀번호가 서로 달라요." },
  );
});

import assert from "node:assert/strict";
import test from "node:test";
import {
  extractApiTestIds,
  findMissingApiTestIds,
  redactApiTestSecrets,
  resolveApiTestIds,
} from "./api-test.ts";

test("저장된 API ID를 variables placeholder에 적용한다", () => {
  const variables = { boardId: "{{boardId}}", input: { answerId: "{{answerId}}" } };
  const resolved = resolveApiTestIds(variables, { boardId: "board-1" });

  assert.deepEqual(resolved, { boardId: "board-1", input: { answerId: "{{answerId}}" } });
  assert.deepEqual(findMissingApiTestIds(resolved), ["{{answerId}}"]);
});

test("생성 응답의 ID를 후속 요청용으로 추출한다", () => {
  assert.deepEqual(extractApiTestIds({
    data: {
      createBoard: { _id: "board-1" },
      createBoardComment: { _id: "comment-1" },
      ignored: { _id: "ignored" },
    },
  }), { boardId: "board-1", boardCommentId: "comment-1" });
});

test("화면에 표시할 요청에서 비밀번호를 가린다", () => {
  assert.deepEqual(redactApiTestSecrets({
    email: "test@example.com",
    password: "secret",
    input: { accessToken: "token", title: "제목" },
  }), {
    email: "test@example.com",
    password: "••••••••",
    input: { accessToken: "••••••••", title: "제목" },
  });
});

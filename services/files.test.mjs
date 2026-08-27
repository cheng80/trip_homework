import assert from "node:assert/strict";
import test from "node:test";
import { validateImageFiles } from "./file-validation.ts";

test("이미지 업로드는 최대 4장과 허용 형식을 검사한다", async () => {
  const image = new File(["image"], "image.png", { type: "image/png" });
  assert.throws(() => validateImageFiles(Array(5).fill(image)), /최대 4장/);
  assert.throws(
    () => validateImageFiles([new File(["text"], "memo.txt", { type: "text/plain" })]),
    /JPG, PNG, WebP/,
  );
});

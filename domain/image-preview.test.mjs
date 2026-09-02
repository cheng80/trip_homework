import assert from "node:assert/strict";
import test from "node:test";
import { appendSelectedImages, removeSelectedImage, resolveImagePreviews } from "./image-preview.ts";

test("선택한 사진은 기존 미리보기 뒤에 누적되고 4장을 넘기면 거부한다", () => {
  const existing = [{ src: "https://storage.googleapis.com/old.png", alt: "등록된 숙소 사진 1" }];

  assert.deepEqual(resolveImagePreviews(existing, []), existing);
  assert.deepEqual(
    resolveImagePreviews(existing, ["blob:preview-1", "blob:preview-2"]),
    [
      existing[0],
      { src: "blob:preview-1", alt: "선택한 사진 2" },
      { src: "blob:preview-2", alt: "선택한 사진 3" },
    ],
  );

  const first = new File(["a"], "a.png", { type: "image/png" });
  const extra = Array.from({ length: 4 }, (_, index) => new File(["b"], `b${index}.png`, { type: "image/png" }));
  const added = appendSelectedImages([], [first]);
  const overflow = appendSelectedImages(added.files, extra);

  assert.equal(added.files.length, 1);
  assert.equal(added.error, null);
  assert.equal(overflow.files.length, 1);
  assert.match(overflow.error ?? "", /최대 4장/);
});

test("선택한 사진 한 장을 빼면 나머지 파일만 남는다", () => {
  const files = [
    new File(["a"], "a.png", { type: "image/png" }),
    new File(["b"], "b.png", { type: "image/png" }),
    new File(["c"], "c.png", { type: "image/png" }),
  ];
  const urls = ["blob:a", "blob:b", "blob:c"];
  const removed = removeSelectedImage(files, urls, 1);

  assert.deepEqual(removed.files.map((file) => file.name), ["a.png", "c.png"]);
  assert.deepEqual(removed.urls, ["blob:a", "blob:c"]);
  assert.equal(removed.removedUrl, "blob:b");
});

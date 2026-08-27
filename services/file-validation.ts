export function validateImageFiles(files: File[]) {
  if (files.length > 4) throw new Error("사진은 최대 4장까지 첨부할 수 있습니다.");
  if (files.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type))) {
    throw new Error("JPG, PNG, WebP 이미지만 첨부할 수 있습니다.");
  }
}

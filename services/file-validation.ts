/**
 * 역할: 업로드 파일 개수와 MIME 형식을 검증하는 순수 유틸리티입니다.
 * 처리 흐름: 허용 이미지 형식과 최대 장수 정책을 한곳에서 검사해 폼마다 동일한 오류를 제공합니다.
 * 주의사항: 실제 네트워크 업로드 전에 호출해야 불필요한 요청을 막을 수 있습니다.
 */
export function validateImageFiles(files: File[]) {
  if (files.length > 4) throw new Error("사진은 최대 4장까지 첨부할 수 있습니다.");
  if (files.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type))) {
    throw new Error("JPG, PNG, WebP 이미지만 첨부할 수 있습니다.");
  }
}

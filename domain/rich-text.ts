/**
 * 역할: 리치 텍스트 HTML을 사용자에게 보이는 일반 문자열로 환원하는 순수 유틸리티입니다.
 * 처리 흐름: 태그·줄바꿈·HTML 엔티티를 정규화해 실제 글자 수와 빈 본문 여부를 계산합니다.
 * 주의사항: 게시글과 상품의 최대 길이 정책을 폼과 검증 로직이 함께 사용합니다.
 */
const blockEndPattern = /<\/(?:p|h[1-6]|li|blockquote)>/gi;
const entityPattern = /&(nbsp|amp|lt|gt|quot|#39);/gi;
const entities: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  "#39": "'",
};

export const boardContentMaxLength = 2000;
export const productContentMaxLength = 1000;

/** HTML 태그와 엔티티를 제거하되 문단 경계는 줄바꿈으로 남겨 사람이 읽는 문자열을 만듭니다. */
export function richTextPlainText(value: string) {
  return value
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(blockEndPattern, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(entityPattern, (_, entity: string) => entities[entity.toLowerCase()] ?? "")
    .replace(/\u00a0/g, " ")
    .trim();
}

/** 에디터의 HTML 길이가 아니라 실제 사용자 입력 문자 수를 반환합니다. */
export function richTextLength(value: string) {
  return richTextPlainText(value).length;
}

/** Quill의 빈 기본값인 <p><br></p> 등을 비어 있는 본문으로 판별합니다. */
export function hasRichTextContent(value: string) {
  return richTextLength(value) > 0;
}

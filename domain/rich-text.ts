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

export function richTextPlainText(value: string) {
  return value
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(blockEndPattern, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(entityPattern, (_, entity: string) => entities[entity.toLowerCase()] ?? "")
    .replace(/\u00a0/g, " ")
    .trim();
}

export function richTextLength(value: string) {
  return richTextPlainText(value).length;
}

export function hasRichTextContent(value: string) {
  return richTextLength(value) > 0;
}

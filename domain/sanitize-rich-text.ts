/**
 * 역할: 리치 텍스트 저장·출력 경계에서 허용 HTML만 남기는 보안 정제 모듈입니다.
 * 처리 흐름: 기존 일반 텍스트를 문단 HTML로 변환하고 링크와 Quill 전용 속성을 제한적으로 허용합니다.
 * 주의사항: 게시글과 숙박권 mutation의 contents 필드만 정제해 일반 댓글 문자열은 변경하지 않습니다.
 */
import sanitizeHtml from "sanitize-html";

// Quill이 생성하는 서식 중 화면에 필요한 최소 태그와 속성만 허용합니다.
const options: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "blockquote",
    "h2",
    "h3",
    "ol",
    "ul",
    "li",
    "a",
    "span",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    li: ["data-list"],
    span: ["class"],
  },
  allowedClasses: { span: ["ql-ui"] },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  transformTags: {
    a: (_tagName, attributes) => ({
      tagName: "a",
      attribs: /^(?:https?:|mailto:|\/|#)/i.test(attributes.href ?? "")
        ? { ...attributes, target: "_blank", rel: "noopener noreferrer" }
        : attributes,
    }),
  },
};

/** 에디터 도입 전 저장된 일반 텍스트를 문단과 줄바꿈 구조를 보존한 HTML로 변환합니다. */
function legacyTextToHtml(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((paragraph) => (
      `<p>${sanitizeHtml(paragraph, { allowedTags: [], allowedAttributes: {} }).replaceAll("\n", "<br />")}</p>`
    ))
    .join("");
}

/** 신규 HTML과 기존 일반 텍스트를 같은 허용 목록으로 정제해 출력 가능한 HTML을 만듭니다. */
export function sanitizeRichText(value: string) {
  const html = /<[a-z][\s\S]*>/i.test(value) ? value : legacyTextToHtml(value);
  return sanitizeHtml(html, options);
}

type JsonRecord = Record<string, unknown>;

const record = (value: unknown): JsonRecord | undefined => (
  typeof value === "object" && value !== null ? value as JsonRecord : undefined
);

/**
 * GraphQL 요청 중 게시글·숙박권 생성 및 수정 입력의 contents만 정제합니다.
 * 댓글과 문의는 HTML 편집기가 아니므로 원래 문자열과 객체 참조를 그대로 유지합니다.
 */
export function sanitizeRichTextRequest(body: unknown) {
  const root = record(body);
  const query = root?.query;
  const variables = record(root?.variables);
  const input = record(variables?.input);
  if (
    !root
    || typeof query !== "string"
    || !/\b(?:createBoard|updateBoard|createTravelproduct|updateTravelproduct)\s*\(/.test(query)
    || typeof input?.contents !== "string"
  ) return body;

  return {
    ...root,
    variables: {
      ...variables,
      input: { ...input, contents: sanitizeRichText(input.contents) },
    },
  };
}

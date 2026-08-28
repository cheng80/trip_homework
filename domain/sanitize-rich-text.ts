import sanitizeHtml from "sanitize-html";

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

function legacyTextToHtml(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((paragraph) => (
      `<p>${sanitizeHtml(paragraph, { allowedTags: [], allowedAttributes: {} }).replaceAll("\n", "<br />")}</p>`
    ))
    .join("");
}

export function sanitizeRichText(value: string) {
  const html = /<[a-z][\s\S]*>/i.test(value) ? value : legacyTextToHtml(value);
  return sanitizeHtml(html, options);
}

type JsonRecord = Record<string, unknown>;

const record = (value: unknown): JsonRecord | undefined => (
  typeof value === "object" && value !== null ? value as JsonRecord : undefined
);

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

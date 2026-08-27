export type ApiTestSavedIds = Partial<Record<
  "answerId" | "boardCommentId" | "boardId" | "paymentId" | "questionId" | "travelproductId",
  string
>>;

const placeholderPattern = /^\{\{([a-zA-Z]+)}}$/;

export function resolveApiTestIds(value: unknown, savedIds: ApiTestSavedIds): unknown {
  if (typeof value === "string") {
    const key = value.match(placeholderPattern)?.[1] as keyof ApiTestSavedIds | undefined;
    return key && savedIds[key] ? savedIds[key] : value;
  }
  if (Array.isArray(value)) return value.map((item) => resolveApiTestIds(item, savedIds));
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, resolveApiTestIds(item, savedIds)]),
    );
  }
  return value;
}

export function findMissingApiTestIds(value: unknown): string[] {
  if (typeof value === "string") return value.match(placeholderPattern)?.[1] ? [value] : [];
  if (Array.isArray(value)) return [...new Set(value.flatMap(findMissingApiTestIds))];
  if (typeof value === "object" && value !== null) {
    return [...new Set(Object.values(value).flatMap(findMissingApiTestIds))];
  }
  return [];
}

export function extractApiTestIds(body: unknown): ApiTestSavedIds {
  if (typeof body !== "object" || body === null || !("data" in body)) return {};
  const data = body.data;
  if (typeof data !== "object" || data === null) return {};

  const fields = {
    createBoard: "boardId",
    createBoardComment: "boardCommentId",
    createTravelproduct: "travelproductId",
    createTravelproductQuestion: "questionId",
    createTravelproductQuestionAnswer: "answerId",
  } as const;
  return Object.fromEntries(Object.entries(fields).flatMap(([field, key]) => {
    const item = (data as Record<string, unknown>)[field];
    const id = typeof item === "object" && item !== null && "_id" in item ? item._id : undefined;
    return typeof id === "string" ? [[key, id]] : [];
  }));
}

export function redactApiTestSecrets(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactApiTestSecrets);
  if (typeof value !== "object" || value === null) return value;

  return Object.fromEntries(Object.entries(value).map(([key, item]) => [
    key,
    /password|accessToken/i.test(key) && typeof item === "string" ? "••••••••" : redactApiTestSecrets(item),
  ]));
}

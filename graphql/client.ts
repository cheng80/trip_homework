const defaultEndpoint = "https://main-practice.codebootcamp.co.kr/graphql";

type GraphQLErrorItem = { message: string; path?: Array<string | number> };
type GraphQLResponse<T> = { data?: T; errors?: GraphQLErrorItem[] };

export type GraphQLRequestOptions = {
  accessToken?: string;
  cache?: RequestCache;
  endpoint?: string;
  signal?: AbortSignal;
};

export class GraphQLRequestError extends Error {
  constructor(message: string, readonly errors: GraphQLErrorItem[] = []) {
    super(message);
    this.name = "GraphQLRequestError";
  }
}

function endpoint(options: GraphQLRequestOptions) {
  if (options.endpoint) return options.endpoint;
  if (typeof window !== "undefined") return process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "/api/graphql";
  return process.env.GRAPHQL_API_URL || defaultEndpoint;
}

async function readGraphQLResponse<T>(response: Response): Promise<T> {
  let result: GraphQLResponse<T>;

  try {
    result = await response.json() as GraphQLResponse<T>;
  } catch {
    throw new GraphQLRequestError(`GraphQL 응답을 읽지 못했습니다. (${response.status})`);
  }

  if (!response.ok || result.errors?.length || result.data === undefined) {
    throw new GraphQLRequestError(
      result.errors?.map((error) => error.message).join("\n") || `GraphQL 요청에 실패했습니다. (${response.status})`,
      result.errors,
    );
  }

  return result.data;
}

export async function requestGraphQL<T, V = unknown>(
  query: string,
  variables?: V,
  options: GraphQLRequestOptions = {},
) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (options.accessToken) headers.authorization = `Bearer ${options.accessToken}`;

  const response = await fetch(endpoint(options), {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables: variables ?? {} }),
    cache: options.cache ?? "no-store",
    credentials: "include",
    signal: options.signal,
  });

  return readGraphQLResponse<T>(response);
}

export async function uploadGraphQLFile<T>(
  query: string,
  file: Blob,
  filename: string,
  options: GraphQLRequestOptions = {},
) {
  const body = new FormData();
  body.append("operations", JSON.stringify({ query, variables: { file: null } }));
  body.append("map", JSON.stringify({ 0: ["variables.file"] }));
  body.append("0", file, filename);

  const headers: Record<string, string> = {};
  if (options.accessToken) headers.authorization = `Bearer ${options.accessToken}`;
  const response = await fetch(endpoint(options), {
    method: "POST",
    headers,
    body,
    cache: "no-store",
    credentials: "include",
    signal: options.signal,
  });

  return readGraphQLResponse<T>(response);
}

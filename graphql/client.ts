import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client/core";

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
  readonly errors: GraphQLErrorItem[];

  constructor(message: string, errors: GraphQLErrorItem[] = []) {
    super(message);
    this.name = "GraphQLRequestError";
    this.errors = errors;
  }
}

const browserClients = new Map<string, ApolloClient>();

function endpoint(options: GraphQLRequestOptions) {
  if (options.endpoint) return options.endpoint;
  if (typeof window !== "undefined") return process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "/api/graphql";
  return process.env.GRAPHQL_API_URL || defaultEndpoint;
}

function createApolloClient(uri: string) {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ uri, credentials: "include" }),
    defaultOptions: {
      query: { fetchPolicy: "no-cache" },
      watchQuery: { fetchPolicy: "no-cache" },
    },
    queryDeduplication: false,
    ssrMode: typeof window === "undefined",
  });
}

function getApolloClient(options: GraphQLRequestOptions) {
  const uri = endpoint(options);
  if (typeof window === "undefined") return createApolloClient(uri);

  const existing = browserClients.get(uri);
  if (existing) return existing;
  const client = createApolloClient(uri);
  browserClients.set(uri, client);
  return client;
}

function toGraphQLRequestError(error: unknown) {
  if (error instanceof GraphQLRequestError) return error;

  const source = error && typeof error === "object" ? error as {
    errors?: Array<{ message?: unknown; path?: readonly (string | number)[] }>;
    message?: unknown;
  } : undefined;
  const errors = Array.isArray(source?.errors)
    ? source.errors.flatMap((item) => typeof item.message === "string"
      ? [{ message: item.message, path: item.path ? [...item.path] : undefined }]
      : [])
    : [];
  const message = errors.map((item) => item.message).join("\n")
    || (typeof source?.message === "string" ? source.message : "GraphQL 요청에 실패했습니다.");
  return new GraphQLRequestError(message, errors);
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
  const document = gql(query);
  const operation = document.definitions.find((definition) => definition.kind === "OperationDefinition");
  const context = {
    fetchOptions: { cache: options.cache ?? "no-store", signal: options.signal },
    headers,
  };

  try {
    const client = getApolloClient(options);
    const result = operation?.operation === "mutation"
      ? await client.mutate<T>({ mutation: document, variables: variables ?? {}, context })
      : await client.query<T>({ query: document, variables: variables ?? {}, context });

    if (result.data === undefined || result.data === null) {
      throw new GraphQLRequestError("GraphQL 응답에 data가 없습니다.");
    }
    return result.data as T;
  } catch (error) {
    throw toGraphQLRequestError(error);
  }
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

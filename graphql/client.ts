/**
 * 역할: 모든 일반 GraphQL 조회와 변경 요청이 통과하는 Apollo Client 전송 계층입니다.
 * 처리 흐름: 실행 환경에 맞는 endpoint와 인증 헤더를 구성하고 operation 종류에 따라 query 또는 mutate를 호출합니다.
 * 주의사항: 파일 업로드만 multipart 규격 때문에 별도 전송 함수를 사용합니다.
 */
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  gql,
  type OperationVariables,
  type TypedDocumentNode,
} from "@apollo/client/core";

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

/** 브라우저 Zustand store가 등록한 getter를 읽어 Authorization 헤더에 넣습니다. */
function storedAccessToken() {
  return (globalThis as { __triptripGetAccessToken?: () => string }).__triptripGetAccessToken?.() ?? "";
}

/** 명시 endpoint, 브라우저 프록시, 서버 직결 주소 순으로 실행 위치에 맞는 목적지를 선택합니다. */
function endpoint(options: GraphQLRequestOptions) {
  if (options.endpoint) return options.endpoint;
  if (typeof window !== "undefined") return process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "/api/graphql";
  return process.env.GRAPHQL_API_URL || defaultEndpoint;
}

/** 기존 no-store 동작을 유지하도록 Apollo 정규화 캐시 읽기를 비활성화한 인스턴스를 만듭니다. */
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

/**
 * 서버에서는 요청 간 사용자 데이터가 섞이지 않도록 매번 새 인스턴스를 사용합니다.
 * 브라우저에서는 endpoint별 인스턴스를 재사용해 불필요한 링크 생성을 줄입니다.
 */
function getApolloClient(options: GraphQLRequestOptions) {
  const uri = endpoint(options);
  if (typeof window === "undefined") return createApolloClient(uri);

  const existing = browserClients.get(uri);
  if (existing) return existing;
  const client = createApolloClient(uri);
  browserClients.set(uri, client);
  return client;
}

/** Apollo의 GraphQL·네트워크 오류를 기존 화면이 사용하는 단일 오류 타입으로 변환합니다. */
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

/** multipart 업로드 응답을 해석하고 HTTP 오류와 GraphQL 오류를 동일하게 처리합니다. */
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

/**
 * GraphQL 문서를 파싱해 Query는 client.query, Mutation은 client.mutate로 실행합니다.
 * 호출부 호환성을 위해 성공 시 Apollo 결과 객체가 아닌 data 값만 반환합니다.
 */
export async function requestGraphQL<T, V extends OperationVariables = OperationVariables>(
  query: string,
  variables?: V,
  options: GraphQLRequestOptions = {},
) {
  const accessToken = options.accessToken ?? storedAccessToken();
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (accessToken) headers.authorization = "Bearer " + accessToken;
  const document = gql(query) as TypedDocumentNode<T, V>;
  const operation = document.definitions.find((definition) => definition.kind === "OperationDefinition");
  const context = {
    fetchOptions: { cache: options.cache ?? "no-store", signal: options.signal },
    headers,
  };
  const requestVariables = (variables ?? {}) as V;

  try {
    const client = getApolloClient(options);
    const result = operation?.operation === "mutation"
      ? await client.mutate({ mutation: document, variables: requestVariables, context })
      : await client.query({ query: document, variables: requestVariables, context });

    if (result.data === undefined || result.data === null) {
      throw new GraphQLRequestError("GraphQL 응답에 data가 없습니다.");
    }
    return result.data as T;
  } catch (error) {
    throw toGraphQLRequestError(error);
  }
}

/**
 * GraphQL multipart request 규격의 operations·map·file 필드를 구성해 파일을 업로드합니다.
 * 기본 HttpLink가 Blob 매핑을 지원하지 않아 이 경로만 직접 fetch를 사용합니다.
 */
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

  const accessToken = options.accessToken ?? storedAccessToken();
  const headers: Record<string, string> = {};
  if (accessToken) headers.authorization = "Bearer " + accessToken;
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

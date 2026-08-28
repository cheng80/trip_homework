import assert from "node:assert/strict";
import test from "node:test";
import { GraphQLRequestError, requestGraphQL } from "./client.ts";

test("Apollo Client로 query와 mutation을 실행하고 GraphQL 오류를 전달한다", async () => {
  const originalFetch = globalThis.fetch;
  const requests = [];

  globalThis.fetch = async (input, init = {}) => {
    const body = JSON.parse(String(init.body));
    requests.push({
      authorization: new Headers(init.headers).get("authorization"),
      body,
      url: String(input),
    });

    if (body.operationName === "FailRequest") {
      return Response.json({ errors: [{ message: "요청 실패" }] });
    }
    return Response.json({
      data: body.operationName === "SaveValue" ? { saveValue: true } : { value: "조회 완료" },
    });
  };

  try {
    const options = { accessToken: "test-token", endpoint: "https://example.com/graphql" };
    const query = await requestGraphQL(`query FetchValue { value }`, undefined, options);
    const mutation = await requestGraphQL(
      `mutation SaveValue($value: String!) { saveValue(value: $value) }`,
      { value: "저장" },
      options,
    );

    assert.deepEqual(query, { value: "조회 완료" });
    assert.deepEqual(mutation, { saveValue: true });
    assert.equal(requests.length, 2);
    assert.equal(requests[0].url, options.endpoint);
    assert.equal(requests[0].authorization, "Bearer test-token");
    assert.equal(requests[0].body.operationName, "FetchValue");
    assert.equal(requests[1].body.operationName, "SaveValue");
    assert.deepEqual(requests[1].body.variables, { value: "저장" });

    await assert.rejects(
      requestGraphQL(`query FailRequest { value }`, undefined, options),
      (error) => error instanceof GraphQLRequestError && error.message === "요청 실패",
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

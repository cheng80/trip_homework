import assert from "node:assert/strict";
import test from "node:test";
import { parse } from "graphql";
import * as mutations from "./mutations.ts";
import * as queries from "./queries.ts";

test("GraphQL Query와 Mutation 문서가 모두 파싱된다", () => {
  const operations = [...Object.values(queries), ...Object.values(mutations)];

  assert.ok(operations.length >= 10);
  operations.forEach((operation) => assert.doesNotThrow(() => parse(operation)));
});

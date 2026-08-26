import graphql from "graphql";
import * as mutations from "../graphql/mutations.ts";
import * as queries from "../graphql/queries.ts";

const { buildClientSchema, getIntrospectionQuery, parse, validate } = graphql;
const endpoint = process.env.GRAPHQL_API_URL || "https://main-practice.codebootcamp.co.kr/graphql";

const response = await fetch(endpoint, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ query: getIntrospectionQuery() }),
});
const result = await response.json();
if (!response.ok || result.errors?.length || !result.data) {
  throw new Error(result.errors?.map((error) => error.message).join("\n") || `스키마 조회 실패 (${response.status})`);
}

const schema = buildClientSchema(result.data);
const failures = [];
for (const [name, operation] of Object.entries({ ...queries, ...mutations })) {
  for (const error of validate(schema, parse(operation))) failures.push(`${name}: ${error.message}`);
}

if (failures.length) throw new Error(failures.join("\n"));
console.log(`GraphQL 작업 ${Object.keys(queries).length + Object.keys(mutations).length}개 스키마 검증 통과`);

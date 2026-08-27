import assert from "node:assert/strict";
import test from "node:test";
import { createGeocodeQueries, createNaverMapSearchUrl } from "./naver-maps.ts";

test("숙박권 주소를 NAVER 지도 검색 URL로 변환한다", () => {
  const url = createNaverMapSearchUrl("  경남 통영시 산양읍 산양일주로 111  ");

  assert.equal(
    url,
    "https://map.naver.com/p/search/%EA%B2%BD%EB%82%A8%20%ED%86%B5%EC%98%81%EC%8B%9C%20%EC%82%B0%EC%96%91%EC%9D%8D%20%EC%82%B0%EC%96%91%EC%9D%BC%EC%A3%BC%EB%A1%9C%20111",
  );
});

test("정확 주소 검색 실패에 대비해 넓은 주소 후보를 만든다", () => {
  assert.deepEqual(
    createGeocodeQueries("경남 통영시 산양읍 산양일주로 111"),
    [
      "경남 통영시 산양읍 산양일주로 111",
      "경남 통영시 산양읍 산양일주로",
      "경남 통영시 산양읍",
      "경남 통영시",
    ],
  );
});

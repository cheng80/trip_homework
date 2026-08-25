# GraphQL API 문서 실행 및 사용

## 실행

프로젝트 루트에서 처음 한 번 의존성을 설치한다.

    npm install

문서를 생성하고 로컬 서버를 실행한다.

    npm run docs:graphql
    npm run docs:graphql:serve

브라우저에서 <http://localhost:4400>을 연다. 서버 종료는 실행한 터미널에서 <code>Ctrl+C</code>를 누른다.

## 문서 사용

- 왼쪽 메뉴에서 Query, Mutation 또는 타입을 선택한다.
- <code>인증 필터</code>에서 전체, 인증 필요, 인증 불필요 또는 확인 필요 작업을 골라 본다.
- 각 작업에서 설명, 인자, 반환 타입, 요청 변수와 응답 예시를 확인한다.
- <code>확인 필요</code>는 스키마만으로 인증 정책을 확정할 수 없는 작업이다.

이 문서는 API 구조를 확인하는 정적 문서이며 API를 직접 실행하지 않는다.

## 메타데이터 수정

[metadata.ko.json](./metadata.ko.json)을 수정한 뒤 누락 여부를 검사하고 문서를 다시 생성한다.

    npm run docs:graphql:check
    npm run docs:graphql

실행 중인 문서 페이지를 새로고침하면 변경 내용이 반영된다.

다른 GraphQL 서버를 문서화할 때는 endpoint를 지정한다.

    GRAPHQL_API_URL=https://example.com/graphql npm run docs:graphql

전체 API 표와 요청 예시는 [GRAPHQL_API.md](../GRAPHQL_API.md)에서 확인한다.

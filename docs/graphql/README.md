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

## 앱 적용 준비 구조

- `graphql/client.ts`: JSON 요청, 파일 업로드, GraphQL `errors` 처리
- `graphql/queries.ts`, `graphql/mutations.ts`: 현재 화면 범위의 작업 문서
- `graphql/types.ts`: GraphQL 원본 응답과 Input 타입
- `app/api/graphql/route.ts`: 브라우저 요청용 동일 출처 프록시
- `services/`: 원본 응답을 UI 모델로 변환하고 기능별 요청 제공
- `domain/`: API와 UI에 독립적인 인증 검증과 목록 선택 규칙
- `data/`: 실제 API 연결 전 사용하는 mock 데이터

작업 문서가 live schema와 일치하는지 검사한다.

    npm run api:graphql:check

페이지는 아직 mock 데이터를 사용한다. 공개 조회부터 `page.tsx`의 `data` import를 `services` 함수로 교체하고, 인증 Mutation은 access token 저장·갱신 정책을 결정한 뒤 연결한다.

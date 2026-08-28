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
- <code>확인 필요</code>는 GraphQL API Lab에도 인증 여부가 명시되지 않은 작업이다.

이 문서는 API 구조를 확인하는 정적 문서이며 API를 직접 실행하지 않는다.

## 메타데이터 수정

[metadata.ko.json](./metadata.ko.json)을 수정한 뒤 누락 여부를 검사하고 문서를 다시 생성한다. 필드와 타입은 live introspection, 한글 설명·인증·주의사항은 [GraphQL API Lab](https://graphql-api-lab.vercel.app/)의 과제용 practice 안내를 기준으로 한다.

    npm run docs:graphql:check
    npm run docs:graphql

실행 중인 문서 페이지를 새로고침하면 변경 내용이 반영된다.

다른 GraphQL 서버를 문서화할 때는 endpoint를 지정한다.

    GRAPHQL_API_URL=https://example.com/graphql npm run docs:graphql

전체 API 표와 요청 예시는 [GRAPHQL_API.md](../GRAPHQL_API.md)에서 확인한다.

## 앱 적용 구조

- `graphql/client.ts`: Apollo Client `query`·`mutate`, multipart 파일 업로드, GraphQL `errors` 처리
- `graphql/queries.ts`, `graphql/mutations.ts`: 현재 화면 범위의 작업 문서
- `graphql/types.ts`: GraphQL 원본 응답과 Input 타입
- `app/api/graphql/route.ts`: 브라우저 요청용 동일 출처 프록시, 토큰 복원과 응답 redaction
- `services/`: 원본 응답을 UI 모델로 변환하고 기능별 요청 제공
- `domain/`: 인증·목록·리치 텍스트 정제 등 API와 UI에 독립적인 규칙
- `data/`: 배너·카테고리와 API 실패 시 초기 화면에 사용하는 정적 데이터

작업 문서가 live schema와 일치하는지 검사한다.

    npm run api:graphql:check

게시글·숙박권·인증·마이페이지의 일반 Query와 Mutation은 Apollo Client를 사용한다. 브라우저 요청은 `/api/graphql`을 거치며 access token은 응답 본문에서 제거되어 HttpOnly 쿠키로 관리된다. 파일 업로드만 GraphQL multipart 규격 때문에 별도 전송 함수를 유지한다.

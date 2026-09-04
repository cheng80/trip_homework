# Codecamp Practice GraphQL API

> 스키마 기준일: 2026-08-27<br>
> Endpoint: <https://main-practice.codebootcamp.co.kr/graphql>

## 요약

| 항목 | 값 |
|---|---|
| 프로토콜 | GraphQL over HTTP |
| 요청 방식 | <code>POST</code> |
| 일반 요청 Content-Type | <code>application/json</code> |
| 파일 업로드 Content-Type | <code>multipart/form-data</code> |
| Query | 27개 |
| Mutation | 29개 |
| 인증 | 일반적으로 <code>Authorization: Bearer ACCESS_TOKEN</code> |
| 토큰 갱신 | refresh token 쿠키와 <code>restoreAccessToken</code> 사용 |
| 문서 추출 | GraphQL introspection 사용 가능 |

타입 뒤의 <code>!</code>는 필수 값, 대괄호는 목록이다. 예를 들어 <code>[Board!]!</code>는 null이 아닌 Board 목록이다.

## TripTrip 적용 구조

- 일반 Query와 Mutation은 `@apollo/client` 4의 `ApolloClient.query`·`ApolloClient.mutate`로 실행한다.
- 브라우저 요청은 동일 출처 `/api/graphql` 프록시가 access token 쿠키 전달과 refresh token 기반 1회 복원을 처리한다.
- 로그인·복원 응답의 access token은 Zustand 메모리와 서버 페이지용 HttpOnly 쿠키에 함께 둔다. refresh token은 업스트림 쿠키를 HTTP에서도 저장되게 정규화한다.
- `uploadFile`은 GraphQL multipart 요청이므로 Apollo HttpLink 대신 전용 업로드 전송 함수를 사용한다.
- 게시글과 숙박권의 `contents`는 프록시 저장 경계와 상세 출력 경계에서 허용 HTML만 남긴다.
- 개발 환경의 `/dev/api-test`에서는 요청·응답 원문과 후속 ID를 확인하기 위해 직접 프록시 호출 방식을 유지한다.

## 사용 시 주의사항

- GraphQL은 HTTP 상태가 200이어도 응답의 <code>errors</code>에 실패 정보가 들어올 수 있다.
- 인증 정보는 introspection 스키마에 포함되지 않는다. 아래 인증 표시는 GraphQL API Lab의 과제용 practice 안내를 기준으로 정리했다.
- Mutation은 공용 연습 서버의 데이터·포인트·계정 상태를 실제로 변경한다. Lab에서 실행이 제한된 삭제·결제·비밀번호 작업은 실제 앱에서도 대상과 입력값을 확인한 뒤 사용해야 한다.
- 페이지당 항목 수와 검색 규칙은 스키마에 명시되어 있지 않다.
- 이 서버는 확인 시점에 <code>http://localhost:8000</code> Origin과 credential 요청을 허용했다. 서버 정책은 변경될 수 있다.

## Query

### 게시판

| 작업 | 인자 | 반환 | 인증 | 설명 |
|---|---|---|---|---|
| <code>fetchBoard</code> | <code>boardId: ID!</code> | <code>Board!</code> | 불필요 | 게시글 한 건 조회 |
| <code>fetchBoards</code> | <code>endDate: DateTime</code>, <code>startDate: DateTime</code>, <code>search: String</code>, <code>page: Int</code> | <code>[Board!]!</code> | 불필요 | 게시글 목록 조회 |
| <code>fetchBoardsCount</code> | <code>endDate: DateTime</code>, <code>startDate: DateTime</code>, <code>search: String</code> | <code>Int!</code> | 불필요 | 조건에 맞는 게시글 수 조회 |
| <code>fetchBoardsCountOfMine</code> | 없음 | <code>Int!</code> | 필요 | 내 게시글 수 조회 |
| <code>fetchBoardsOfMine</code> | 없음 | <code>[Board!]!</code> | 필요 | 내 게시글 목록 조회 |
| <code>fetchBoardsOfTheBest</code> | 없음 | <code>[Board!]!</code> | 불필요 | 베스트 게시글 목록 조회 |
| <code>fetchBoardComments</code> | <code>page: Int</code>, <code>boardId: ID!</code> | <code>[BoardComment!]!</code> | 불필요 | 게시글 댓글 목록 조회 |

### 포인트

| 작업 | 인자 | 반환 | 인증 | 설명 |
|---|---|---|---|---|
| <code>fetchPointTransactions</code> | <code>search: String</code>, <code>page: Int</code> | <code>[PointTransaction!]!</code> | 필요 | 내 전체 포인트 내역 조회 |
| <code>fetchPointTransactionsCountOfBuying</code> | 없음 | <code>Int!</code> | 필요 | 구매 포인트 내역 수 조회 |
| <code>fetchPointTransactionsCountOfLoading</code> | 없음 | <code>Int!</code> | 필요 | 충전 포인트 내역 수 조회 |
| <code>fetchPointTransactionsCountOfSelling</code> | 없음 | <code>Int!</code> | 필요 | 판매 포인트 내역 수 조회 |
| <code>fetchPointTransactionsOfBuying</code> | <code>search: String</code>, <code>page: Int</code> | <code>[PointTransaction!]!</code> | 필요 | 구매 포인트 내역 조회 |
| <code>fetchPointTransactionsOfLoading</code> | <code>search: String</code>, <code>page: Int</code> | <code>[PointTransaction!]!</code> | 필요 | 충전 포인트 내역 조회 |
| <code>fetchPointTransactionsOfSelling</code> | <code>search: String</code>, <code>page: Int</code> | <code>[PointTransaction!]!</code> | 필요 | 판매 포인트 내역 조회 |

### 숙박권

| 작업 | 인자 | 반환 | 인증 | 설명 |
|---|---|---|---|---|
| <code>fetchTravelproduct</code> | <code>travelproductId: ID!</code> | <code>Travelproduct!</code> | 불필요 | 숙박권 한 건 조회 |
| <code>fetchTravelproducts</code> | <code>isSoldout: Boolean</code>, <code>search: String</code>, <code>page: Int</code> | <code>[Travelproduct!]!</code> | 불필요 | 숙박권 목록 조회 |
| <code>fetchTravelproductsCountIBought</code> | 없음 | <code>Int!</code> | 필요 | 내가 구매한 숙박권 수 조회 |
| <code>fetchTravelproductsCountIPicked</code> | 없음 | <code>Int!</code> | 필요 | 내가 찜한 숙박권 수 조회 |
| <code>fetchTravelproductsCountISold</code> | 없음 | <code>Int!</code> | 필요 | 내가 판매한 숙박권 수 조회 |
| <code>fetchTravelproductsIBought</code> | <code>search: String</code>, <code>page: Int</code> | <code>[Travelproduct!]!</code> | 필요 | 내가 구매한 숙박권 조회 |
| <code>fetchTravelproductsIPicked</code> | <code>search: String</code>, <code>page: Int</code> | <code>[Travelproduct!]!</code> | 필요 | 내가 찜한 숙박권 조회 |
| <code>fetchTravelproductsISold</code> | <code>search: String</code>, <code>page: Int</code> | <code>[Travelproduct!]!</code> | 필요 | 내가 판매한 숙박권 조회 |
| <code>fetchTravelproductsOfTheBest</code> | 없음 | <code>[Travelproduct!]!</code> | 불필요 | 베스트 숙박권 조회 |
| <code>fetchTravelproductQuestions</code> | <code>page: Int</code>, <code>travelproductId: ID!</code> | <code>[TravelproductQuestion!]!</code> | 불필요 | 숙박권 문의 목록 조회 |
| <code>fetchTravelproductQuestionAnswers</code> | <code>page: Int</code>, <code>travelproductQuestionId: ID!</code> | <code>[TravelproductQuestionAnswer!]!</code> | 불필요 | 문의 답변 목록 조회 |

### 사용자

| 작업 | 인자 | 반환 | 인증 | 설명 |
|---|---|---|---|---|
| <code>fetchUser</code> | <code>email: String!</code> | <code>User!</code> | 불필요 | 이메일로 사용자 조회 |
| <code>fetchUserLoggedIn</code> | 없음 | <code>User!</code> | 필요 | 현재 로그인 사용자 조회 |

## Mutation

### 게시판

| 작업 | 인자 | 반환 | 인증 | 설명 |
|---|---|---|---|---|
| <code>createBoard</code> | <code>createBoardInput: CreateBoardInput!</code> | <code>Board!</code> | 불필요 | 게시글 생성 |
| <code>deleteBoard</code> | <code>boardId: ID!</code> | <code>ID!</code> | 불필요 | 게시글 한 건 삭제 |
| <code>deleteBoards</code> | <code>boardIds: [ID!]!</code> | <code>[ID!]!</code> | 불필요 | 게시글 여러 건 삭제 |
| <code>dislikeBoard</code> | <code>boardId: ID!</code> | <code>Int!</code> | 불필요 | 싫어요 처리 후 개수 반환 |
| <code>likeBoard</code> | <code>boardId: ID!</code> | <code>Int!</code> | 불필요 | 좋아요 처리 후 개수 반환 |
| <code>updateBoard</code> | <code>updateBoardInput: UpdateBoardInput!</code>, <code>password: String</code>, <code>boardId: ID!</code> | <code>Board!</code> | 불필요 | 게시글 수정 |
| <code>createBoardComment</code> | <code>createBoardCommentInput: CreateBoardCommentInput!</code>, <code>boardId: ID!</code> | <code>BoardComment!</code> | 불필요 | 댓글 생성 |
| <code>deleteBoardComment</code> | <code>password: String</code>, <code>boardCommentId: ID!</code> | <code>ID!</code> | 불필요 | 댓글 삭제 |
| <code>updateBoardComment</code> | <code>updateBoardCommentInput: UpdateBoardCommentInput!</code>, <code>password: String</code>, <code>boardCommentId: ID!</code> | <code>BoardComment!</code> | 불필요 | 댓글 수정 |

### 파일과 포인트

| 작업 | 인자 | 반환 | 인증 | 설명 |
|---|---|---|---|---|
| <code>uploadFile</code> | <code>file: Upload!</code> | <code>FileManager!</code> | 확인 필요 | GraphQL multipart 방식으로 파일 업로드 |
| <code>createPointTransactionOfBuyingAndSelling</code> | <code>useritemId: ID!</code> | <code>Travelproduct!</code> | 필요 | 숙박권 구매와 판매 포인트 처리 |
| <code>createPointTransactionOfLoading</code> | <code>paymentId: ID!</code> | <code>PointTransaction!</code> | 필요 | 결제 ID로 포인트 충전 반영 |

### 숙박권

| 작업 | 인자 | 반환 | 인증 | 설명 |
|---|---|---|---|---|
| <code>createTravelproduct</code> | <code>createTravelproductInput: CreateTravelproductInput!</code> | <code>Travelproduct!</code> | 필요 | 숙박권 생성 |
| <code>deleteTravelproduct</code> | <code>travelproductId: ID!</code> | <code>ID!</code> | 필요 | 숙박권 삭제 |
| <code>updateTravelproduct</code> | <code>updateTravelproductInput: UpdateTravelproductInput!</code>, <code>travelproductId: ID!</code> | <code>Travelproduct!</code> | 필요 | 숙박권 수정 |
| <code>toggleTravelproductPick</code> | <code>travelproductId: ID!</code> | <code>Int!</code> | 필요 | 찜 상태 전환 후 개수 반환 |
| <code>createTravelproductQuestion</code> | <code>createTravelproductQuestionInput: CreateTravelproductQuestionInput!</code>, <code>travelproductId: ID!</code> | <code>TravelproductQuestion!</code> | 필요 | 숙박권 문의 생성 |
| <code>deleteTravelproductQuestion</code> | <code>travelproductQuestionId: ID!</code> | <code>ID!</code> | 필요 | 숙박권 문의 삭제 |
| <code>updateTravelproductQuestion</code> | <code>updateTravelproductQuestionInput: UpdateTravelproductQuestionInput!</code>, <code>travelproductQuestionId: ID!</code> | <code>TravelproductQuestion!</code> | 필요 | 숙박권 문의 수정 |
| <code>createTravelproductQuestionAnswer</code> | <code>createTravelproductQuestionAnswerInput: CreateTravelproductQuestionAnswerInput!</code>, <code>travelproductQuestionId: ID!</code> | <code>TravelproductQuestionAnswer!</code> | 필요 | 숙박권 문의 답변 생성 |
| <code>deleteTravelproductQuestionAnswer</code> | <code>travelproductQuestionAnswerId: ID!</code> | <code>String!</code> | 필요 | 숙박권 문의 답변 삭제 |
| <code>updateTravelproductQuestionAnswer</code> | <code>updateTravelproductQuestionAnswerInput: UpdateTravelproductQuestionAnswerInput!</code>, <code>travelproductQuestionAnswerId: ID!</code> | <code>TravelproductQuestionAnswer!</code> | 필요 | 숙박권 문의 답변 수정 |

### 인증과 사용자

| 작업 | 인자 | 반환 | 인증 | 설명 |
|---|---|---|---|---|
| <code>restoreAccessToken</code> | 없음 | <code>Token!</code> | refresh token 쿠키 | access token 재발급 |
| <code>createUser</code> | <code>createUserInput: CreateUserInput!</code> | <code>User!</code> | 불필요 | 회원가입 |
| <code>loginUser</code> | <code>password: String!</code>, <code>email: String!</code> | <code>Token!</code> | 불필요 | 로그인 후 access token 반환 |
| <code>loginUserExample</code> | <code>password: String!</code>, <code>email: String!</code> | <code>Token!</code> | 불필요 | 로그인 예제용 작업 |
| <code>logoutUser</code> | 없음 | <code>Boolean!</code> | 필요 | 로그아웃 |
| <code>resetUserPassword</code> | <code>password: String!</code> | <code>Boolean!</code> | 필요 | 로그인 사용자의 비밀번호 변경 |
| <code>updateUser</code> | <code>updateUserInput: UpdateUserInput!</code> | <code>User!</code> | 필요 | 로그인 사용자 정보 수정 |

## Input 타입

| 타입 | 필드 |
|---|---|
| <code>BoardAddressInput</code> | <code>zipcode: String</code>, <code>address: String</code>, <code>addressDetail: String</code> |
| <code>CreateBoardCommentInput</code> | <code>writer: String</code>, <code>password: String</code>, <code>contents: String!</code>, <code>rating: Float!</code> |
| <code>CreateBoardInput</code> | <code>writer: String</code>, <code>password: String</code>, <code>title: String!</code>, <code>contents: String!</code>, <code>youtubeUrl: String</code>, <code>boardAddress: BoardAddressInput</code>, <code>images: [String!]</code> |
| <code>CreateTravelproductInput</code> | <code>name: String!</code>, <code>remarks: String!</code>, <code>contents: String!</code>, <code>price: Int!</code>, <code>tags: [String!]</code>, <code>travelproductAddress: TravelproductAddressInput</code>, <code>images: [String!]</code> |
| <code>CreateTravelproductQuestionAnswerInput</code> | <code>contents: String!</code> |
| <code>CreateTravelproductQuestionInput</code> | <code>contents: String!</code> |
| <code>CreateUserInput</code> | <code>email: String!</code>, <code>password: String!</code>, <code>name: String!</code> |
| <code>TravelproductAddressInput</code> | <code>zipcode: String</code>, <code>address: String</code>, <code>addressDetail: String</code>, <code>lat: Float</code>, <code>lng: Float</code> |
| <code>UpdateBoardCommentInput</code> | <code>contents: String</code>, <code>rating: Float</code> |
| <code>UpdateBoardInput</code> | <code>title: String</code>, <code>contents: String</code>, <code>youtubeUrl: String</code>, <code>boardAddress: BoardAddressInput</code>, <code>images: [String!]</code> |
| <code>UpdateTravelproductInput</code> | <code>name: String</code>, <code>remarks: String</code>, <code>contents: String</code>, <code>price: Int</code>, <code>tags: [String!]</code>, <code>travelproductAddress: TravelproductAddressInput</code>, <code>images: [String!]</code> |
| <code>UpdateTravelproductQuestionAnswerInput</code> | <code>contents: String!</code> |
| <code>UpdateTravelproductQuestionInput</code> | <code>contents: String!</code> |
| <code>UpdateUserInput</code> | <code>name: String</code>, <code>picture: String</code> |

## 반환 Object 타입

| 타입 | 필드 |
|---|---|
| <code>Board</code> | <code>_id</code>, <code>writer</code>, <code>title</code>, <code>contents</code>, <code>youtubeUrl</code>, <code>likeCount</code>, <code>dislikeCount</code>, <code>images</code>, <code>boardAddress</code>, <code>user</code>, <code>createdAt</code>, <code>updatedAt</code>, <code>deletedAt</code> |
| <code>BoardAddress</code> | <code>_id</code>, <code>zipcode</code>, <code>address</code>, <code>addressDetail</code>, <code>createdAt</code>, <code>updatedAt</code>, <code>deletedAt</code> |
| <code>BoardComment</code> | <code>_id</code>, <code>writer</code>, <code>contents</code>, <code>rating</code>, <code>user</code>, <code>createdAt</code>, <code>updatedAt</code>, <code>deletedAt</code> |
| <code>FileManager</code> | <code>_id</code>, <code>url</code>, <code>size</code>, <code>isUsed</code>, <code>createdAt</code>, <code>updatedAt</code>, <code>deletedAt</code> |
| <code>PointTransaction</code> | <code>_id</code>, <code>impUid</code>, <code>amount</code>, <code>balance</code>, <code>status</code>, <code>statusDetail</code>, <code>travelproduct</code>, <code>user</code>, <code>createdAt</code>, <code>updatedAt</code>, <code>deletedAt</code> |
| <code>Token</code> | <code>accessToken</code> |
| <code>Travelproduct</code> | <code>_id</code>, <code>name</code>, <code>remarks</code>, <code>contents</code>, <code>price</code>, <code>tags</code>, <code>images</code>, <code>pickedCount</code>, <code>travelproductAddress</code>, <code>buyer</code>, <code>seller</code>, <code>soldAt</code>, <code>createdAt</code>, <code>updatedAt</code>, <code>deletedAt</code> |
| <code>TravelproductAddress</code> | <code>_id</code>, <code>zipcode</code>, <code>address</code>, <code>addressDetail</code>, <code>lat</code>, <code>lng</code>, <code>createdAt</code>, <code>updatedAt</code>, <code>deletedAt</code> |
| <code>TravelproductQuestion</code> | <code>_id</code>, <code>contents</code>, <code>travelproduct</code>, <code>user</code>, <code>createdAt</code>, <code>updatedAt</code>, <code>deletedAt</code> |
| <code>TravelproductQuestionAnswer</code> | <code>_id</code>, <code>contents</code>, <code>travelproductQuestion</code>, <code>user</code>, <code>createdAt</code>, <code>updatedAt</code>, <code>deletedAt</code> |
| <code>User</code> | <code>_id</code>, <code>email</code>, <code>name</code>, <code>picture</code>, <code>userPoint</code>, <code>createdAt</code>, <code>updatedAt</code>, <code>deletedAt</code> |
| <code>UserPoint</code> | <code>_id</code>, <code>amount</code>, <code>user</code>, <code>createdAt</code>, <code>updatedAt</code>, <code>deletedAt</code> |

## 요청 예시

### 게시글 목록

    curl 'https://main-practice.codebootcamp.co.kr/graphql' \
      -H 'content-type: application/json' \
      --data-binary '{
        "operationName": "FetchBoards",
        "query": "query FetchBoards($page: Int, $search: String) { fetchBoards(page: $page, search: $search) { _id title writer createdAt } }",
        "variables": { "page": 1, "search": "" }
      }'

### 로그인 후 인증 Query

    curl 'https://main-practice.codebootcamp.co.kr/graphql' \
      -H 'content-type: application/json' \
      -H 'authorization: Bearer ACCESS_TOKEN' \
      --data-binary '{
        "query": "query { fetchUserLoggedIn { _id email name userPoint { amount } } }"
      }'

### 파일 업로드

    curl 'https://main-practice.codebootcamp.co.kr/graphql' \
      -F 'operations={"query":"mutation UploadFile($file: Upload!) { uploadFile(file: $file) { _id url size } }","variables":{"file":null}}' \
      -F 'map={"0":["variables.file"]}' \
      -F '0=@./image.png'

## SpectaQL 로컬 문서

GraphQL 문서의 기준은 live introspection schema와 [metadata.ko.json](./graphql/metadata.ko.json)이다. 생성 스크립트는 타입·필드·인자 누락과 스키마에 없는 메타데이터를 양방향으로 검사한다.

    npm run docs:graphql:check
    npm run docs:graphql
    npm run docs:graphql:serve

브라우저에서 <http://localhost:4400>을 연다. 상단 인증 필터에서 전체, 인증 필요, 인증 불필요 또는 확인 필요 작업만 골라 볼 수 있다. 생성된 HTML은 <code>public/graphql-docs</code>에 저장되며 Git에는 포함하지 않는다.

다른 GraphQL 서버를 확인할 때는 endpoint를 환경변수로 전달한다.

    GRAPHQL_API_URL=https://example.com/graphql npm run docs:graphql

## 참고

- [GraphQL Introspection](https://graphql.org/learn/introspection/)
- [GraphQL API Lab](https://graphql-api-lab.vercel.app/)
- [SpectaQL](https://github.com/anvilco/spectaql)

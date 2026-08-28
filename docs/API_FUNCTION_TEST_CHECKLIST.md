# 로그인 이후 API 기능 테스트 체크리스트

최종 갱신일: 2026-08-28

테스트 대상은 `http://localhost:3000`의 실제 화면이며, 일반 Query와 Mutation은 Apollo Client에서 동일 출처 프록시를 거쳐 공용 연습 GraphQL 서버로 전달된다. 한글 입력은 Computer Use의 클립보드 붙여넣기를 사용한다.

상태 표기: `대기` / `통과` / `부분 통과` / `실패` / `차단` / `UI 미연결`

## 인증·회원

| 상태 | 화면 기능 | API | 확인 기준 |
| --- | --- | --- | --- |
| 통과 | 로그인 | `loginUser` | 로그인 후 프로필 메뉴 표시 |
| 통과 | 로그인 사용자 조회 | `fetchUserLoggedIn` | 김택권·cheng80@gmail.com·0P 표시 |
| 통과 | 마이페이지 조회 | `fetchUserLoggedIn`, 구매·판매·찜·포인트 내역 Query | 회원·0P 표시, 판매 등록 후 숙박권이 거래내역에 반영됨 |
| 차단 | 비밀번호 변경 | `resetUserPassword` | 성공 알럿 구현 완료, 실제 계정 변경은 사용자가 직접 입력·제출해야 함 |
| 통과 | 로그아웃 | `logoutUser` | 로그인 화면 이동 및 세션 해제 확인 |
| 통과 | 더미 포인트 충전 유지 | 브라우저 `localStorage` | 김택권 계정에 10,000P 충전 후 새로고침해도 잔액·충전 내역 유지 |
| 차단 | 실제 포인트 충전 | `createPointTransactionOfLoading` | 실제 결제 `paymentId`가 없어 UI는 더미 상태만 변경 |

## 트립토크

| 상태 | 화면 기능 | API | 확인 기준 |
| --- | --- | --- | --- |
| 통과 | 목록·베스트·검색·페이지 | `fetchBoards`, `fetchBoardsCount`, `fetchBoardsOfTheBest` | `트립트립` 검색 결과 2건 표시 |
| 통과 | 상세·댓글 조회 | `fetchBoard`, `fetchBoardComments` | 게시글 본문과 댓글 목록 표시 |
| 통과 | 등록 | `createBoard` | `성수동에서 보낸 느긋한 주말` 생성, ID `6a8fef29d4299d0029cd4acb` |
| 통과 | 수정 화면 조회·저장 | `fetchBoard`, `updateBoard` | 게시글 비밀번호 입력 후 제목을 `성수동에서 보낸 느긋한 주말 산책`으로 변경 |
| 통과 | 좋아요·싫어요 | `likeBoard`, `dislikeBoard` | 각 카운트 0→1 |
| 통과 | 댓글 등록·수정·삭제 | 댓글 Mutation 3종 | `서울숲길잡이`로 등록·비밀번호 수정·삭제 후 댓글 수 2→1 확인 |
| 통과 | 게시글 삭제 | `deleteBoard` | 삭제 후 목록 이동과 생성 게시글 ID 조회 불가 확인 |

## 숙박권

| 상태 | 화면 기능 | API | 확인 기준 |
| --- | --- | --- | --- |
| 통과 | 목록·베스트·검색 | `fetchTravelproducts`, `fetchTravelproductsOfTheBest` | `부산` 검색 결과 1건 표시 |
| 통과 | 상세·문의 조회 | `fetchTravelproduct`, `fetchTravelproductQuestions` | 상품과 문의 목록 표시 |
| 통과 | 판매 등록 | `createTravelproduct` | `제주 바다가 보이는 조용한 스테이` 생성, ID `6a8ff116d4299d0029cd4acf` |
| 통과 | 수정 화면 조회·저장 | `fetchTravelproduct`, `updateTravelproduct` | 상품명을 `제주 바다가 보이는 조용한 스테이 숙박권`으로 변경 |
| 통과 | 문의 등록 | `createTravelproductQuestion` | 김택권 작성자로 문의가 추가됨 |
| 차단 | 숙박권 구매 | `createPointTransactionOfBuyingAndSelling` | 구매 확인 팝업까지 통과, 실제 결제성 확정은 사용자 실행이 필요하고 현재 0P |
| 통과 | 찜 전환 | `toggleTravelproductPick` | 찜 수 0→1→0 전환과 원상 복구 확인 |
| 통과 | 판매글 삭제 | `deleteTravelproduct` | 삭제 Mutation 성공 후 생성 숙박권 ID 조회 불가 확인 |
| 통과 | 문의 수정·삭제 | 문의 Mutation 2종 | 문의 문구 수정과 삭제 Mutation 성공 확인 |
| 통과 | 문의 답변 생성·수정·삭제 | 답변 Mutation 3종 | 판매자 답변 등록·수정과 삭제 Mutation 성공 확인 |

## 파일

| 상태 | 화면 기능 | API | 확인 기준 |
| --- | --- | --- | --- |
| 통과 | 게시글·숙박권 이미지 첨부 | `uploadFile` | 게시글 `city-hotel.jpg`, 숙박권 `beach-resort.jpg` 업로드 후 상세 이미지 표시 |

더미 이미지는 `.env.e2e.local`의 `E2E_IMAGE_1`~`E2E_IMAGE_4`에 지정된 도시 호텔·해변 리조트·산속 캐빈·한옥 사진을 사용한다.

## 편집기·지도·전송

| 상태 | 화면 기능 | 구현 | 확인 기준 |
| --- | --- | --- | --- |
| 통과 | 트립토크 리치 텍스트 | React Quill, `sanitize-html` | 작성·수정 툴바, 한글 붙여넣기, 상세 서식 출력과 빈 본문 검증 |
| 통과 | 숙박권 상세 설명 | React Quill, `sanitize-html` | 작성·수정·상세와 390px 화면에서 가로 넘침·console 오류 없음 |
| 통과 | 숙박권 상세 위치 | NAVER Dynamic Map·Geocoding | 지도·마커 표시와 지도 전체 클릭 시 새 창 검색 링크 이동 |
| 통과 | Apollo 전송 | `ApolloClient.query`, `ApolloClient.mutate` | 게시판·숙박권 서버 조회와 상세 클라이언트 조회, Query·Mutation 단위 테스트 통과 |
| 통과 | HTML 저장 경계 | GraphQL 프록시 정제 | 게시글·숙박권 본문 서식은 보존하고 실행 가능한 태그·속성 제거 |

## 실행 기록

- 테스트 계정: `.env.e2e.local`에서만 읽고 출력·커밋하지 않는다.
- 자동 검증: Node 테스트 27개, GraphQL 작업 35개, lint, production build, 운영 의존성 audit 통과.
- 테스트 데이터: 사용자에게 보이는 문구는 실제 서비스처럼 작성하고, 생성된 ID로 기존 데이터와 구분한다.
- 생성된 테스트 ID와 실패 원인은 이 문서에 민감정보 없이 기록한다.
- 삭제 완료 게시글: `6a8fef29d4299d0029cd4acb`
- 삭제 완료 숙박권: `6a8ff116d4299d0029cd4acf`
- 삭제 완료 문의: `주말에도 추가 요금 없이 이용할 수 있는지 궁금합니다.`
- 삭제 완료 답변: `주말에도 추가 요금 없이 이용할 수 있습니다. 예약 전에 이용 가능한 날짜를 먼저 확인해 주세요.`
- 유지 중인 숙박권: `통영 바다 전망 감성 숙소 1박권`
- 유지 중인 숙박권 ID: `6a900480d4299d0029cd4add`
- 등록 확인: 김택권 판매자·118,000원·이미지 2장·상세 화면 표시

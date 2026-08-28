# TripTrip

TripTrip은 여행 이야기를 공유하고 숙박권을 판매·구매할 수 있는 Next.js 기반 웹 애플리케이션이다. 공용 연습 GraphQL 서버와 연결해 인증, 게시글, 숙박권, 문의, 포인트 내역 기능을 제공한다.

## 주요 기능

- 로그인·회원가입·로그아웃과 HttpOnly 쿠키 기반 세션 복원
- 트립토크 목록·검색·정렬·상세·등록·수정·삭제·반응·댓글
- 숙박권 목록·검색·상세·판매·수정·삭제·찜·구매·문의·답변
- React Quill 기반 상세 설명 작성과 서버 HTML 정제
- 마이페이지 회원 정보·거래·찜·포인트 내역·비밀번호 변경
- 브라우저 저장소를 사용하는 사용자별 더미 포인트 충전
- Kakao 우편번호 검색과 NAVER 지도 위치 미리보기
- 운영 화면과 분리된 개발용 GraphQL API 테스트 페이지

## 기술 구성

- Next.js 16 App Router, React 19, TypeScript
- Apollo Client 4, GraphQL
- React Quill, sanitize-html
- React Daum Postcode
- NAVER Maps Dynamic Map·Geocoding
- CSS Modules, Node.js Test Runner, ESLint

## 실행

```bash
npm install
npm run dev
```

브라우저에서 <http://localhost:3000>을 연다. 주요 시작 경로는 `/travelproducts`이며 개발 환경에서만 `/dev/api-test`를 사용할 수 있다.

## 환경변수

로컬 지도와 GraphQL 연결 설정은 `.env.local`에 둔다. 실제 키는 저장소에 커밋하지 않는다.

```dotenv
GRAPHQL_API_URL=https://main-practice.codebootcamp.co.kr/graphql
NEXT_PUBLIC_NAVER_MAPS_KEY_ID=
NAVER_MAPS_SECRET_KEY=
```

- `NEXT_PUBLIC_NAVER_MAPS_KEY_ID`는 브라우저 지도 SDK에 전달되는 공개 Client ID다.
- `NAVER_MAPS_SECRET_KEY`는 서버의 Geocoding 요청에만 사용한다.
- Vercel에는 로컬 파일과 별도로 같은 환경변수를 등록하고 배포 도메인을 NAVER Maps Web 서비스 URL에 추가한다.

## 데이터 흐름

```text
page.tsx / hooks
  → services
  → Apollo Client
  → /api/graphql
  → 공용 GraphQL 서버
```

- 서버 컴포넌트의 공개 조회는 GraphQL 서버를 직접 호출한다.
- 브라우저 요청은 `/api/graphql` 프록시가 인증 쿠키, 토큰 복원과 응답 redaction을 처리한다.
- multipart 이미지 업로드는 Apollo HttpLink 대신 GraphQL multipart 전송 함수를 사용한다.
- 리치 텍스트는 저장 요청과 상세 출력 전에 허용 목록으로 정제한다.

## 검증

```bash
npm test
npm run api:graphql:check
npm run docs:graphql:check
npm run lint
npm run build
npm audit --omit=dev
```

GraphQL 문서 생성과 로컬 열람 방법은 [docs/graphql/README.md](docs/graphql/README.md)를 참고한다.

## 주요 문서

- [진행 체크리스트](docs/PROGRESS.md)
- [작업 인수인계](docs/HANDOFF.md)
- [API 기능 테스트 결과](docs/API_FUNCTION_TEST_CHECKLIST.md)
- [GraphQL API 요약](docs/GRAPHQL_API.md)

## 현재 제한사항

- 포인트 충전은 실제 결제 `paymentId`를 만들지 않으며 사용자별 브라우저 저장소에 더미 내역만 유지한다.
- 실제 숙박권 구매는 공용 서버의 포인트와 상품 상태를 변경하므로 충분한 포인트와 대상 확인이 필요하다.
- 이메일 사전 중복 확인과 숙박권 날짜·카테고리 선택 상태는 아직 연결하지 않았다.

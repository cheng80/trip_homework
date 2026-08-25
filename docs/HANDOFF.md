# TripTrip 작업 인수인계

작성일: 2026-08-25

진행 체크리스트는 [PROGRESS.md](./PROGRESS.md)에서 관리한다.

## 현재 Git 상태

- 현재 체크아웃 브랜치: `dev`
- `dev`, `origin/dev`, `main`, `origin/main`은 트립토크 정적 화면 작업까지 동기화
- 후속 작업은 단일 작업 브랜치 `dev`에서 진행
- 병합이 끝난 `travelproducts-ui`는 로컬과 원격에서 삭제 완료
- 기존 미추적 계획 문서 `superpowers/docs/plans/2026-08-25-152049-01-plan-dev-branch-policy.md`는 보존

주요 변경 파일:

- `app/(main)/layout.tsx`
- `app/(main)/layout.module.css`
- `app/(main)/travelproducts/page.tsx`
- `app/(main)/travelproducts/styles.module.css`
- `app/(main)/travelproducts/[travelproductId]/page.tsx`
- `app/(main)/travelproducts/[travelproductId]/styles.module.css`
- `app/(main)/travelproducts/_components/travel-product-form.tsx`
- `app/(main)/travelproducts/_components/travel-product-form.module.css`
- `app/(main)/travelproducts/new/page.tsx`
- `app/(main)/travelproducts/[travelproductId]/edit/page.tsx`
- `app/(main)/boards/page.tsx`
- `app/(main)/boards/styles.module.css`
- `app/(main)/boards/[boardId]/page.tsx`
- `app/(main)/boards/[boardId]/styles.module.css`
- `app/(main)/boards/_components/board-form.tsx`
- `app/(main)/boards/new/page.tsx`
- `app/(main)/boards/[boardId]/edit/page.tsx`
- `package.json`
- `package-lock.json`
- `docs/HANDOFF.md`
- `docs/PROGRESS.md`

## 현재 화면 범위

`dev`에는 숙박권과 트립토크 정적 화면이 구현되어 있다.

- `/travelproducts` 메인 배너 이동·페이지 표시
- 추천 숙소 영역
- 프로모션 배너
- 날짜·지역 검색 폼
- 숙소 카테고리
- 숙박권 카드 목록
- 최근 본 숙박권과 상세·판매 화면 이동
- `/travelproducts/[travelproductId]` 상품 이미지·판매자·상세 정보·위치·문의 상태
- 구매 확인과 포인트 부족 팝업
- `/travelproducts/new` 판매 등록 폼
- `/travelproducts/[travelproductId]/edit` 판매 수정 폼
- `react-daum-postcode` 기반 Kakao 우편번호 주소 검색
- 데스크톱·태블릿·모바일 CSS 분기
- `/boards` 핫 게시글·검색·정렬·페이지 이동 목록
- `/boards/[boardId]` 게시글 이미지·위치·반응·댓글 상태
- `/boards/new`, `/boards/[boardId]/edit` 등록·수정 공통 폼
- 트립토크 폼의 Kakao 우편번호 주소 검색
- 현재 경로에 따른 숙박권·트립토크 헤더 활성 상태

GraphQL, Apollo Provider, API 요청, 실제 구매·등록·수정·문의·게시글·댓글 저장은 구현하지 않았다.
배너와 팝업, 폼 완료 표시는 브라우저 내부의 정적 상태만 사용한다.

## 현재 검증 상태

- `npm run lint` 통과
- `npm run build` 통과
- Kakao 우편번호 검색창 로드, 실제 주소 검색·선택, 상세 주소 포커스 이동 확인
- 390px 모바일 팝업과 Escape 닫기·포커스 복귀 확인
- 트립토크 1920px·781px·390px 화면과 가로 넘침 없음 확인
- 검색·페이지 이동·좋아요·댓글 등록·수정·삭제 상태 확인
- 트립토크 등록 폼의 주소 검색 열기·닫기와 포커스 복귀 확인
- 확장 프로그램이 없는 브라우저에서 console warning/error 없음

## 다음 작업: 로그인·회원가입 정적 화면

Figma와 예시 프로젝트의 `(auth)` 구조를 참고하되 실제 인증 요청과 토큰 저장은 제외한다.

1. `app/(auth)/login`, `app/(auth)/signup` 라우트 생성
2. 로그인 이미지와 이메일·비밀번호 폼 작성
3. 회원가입 이름·이메일·비밀번호·비밀번호 확인 폼 작성
4. 입력 전·오류·완료 정적 상태 작성
5. 로그인 메뉴 연결과 1920px·781px·390px 화면 확인

## 다음 세션 시작 방법

1. `git status --short --branch`로 브랜치와 작업 상태를 확인한다.
2. 기존 `superpowers/` 미추적 파일을 보존한 뒤 `dev`에서 작업한다.
3. `yarn dev`를 실행한다.
4. Figma의 로그인·회원가입 1920px·781px·모바일 프레임을 먼저 확인한다.
5. 예시 프로젝트의 `src/app/(auth)/login`, `src/app/(auth)/signup`을 참고한다.
6. 루트 `app` 아래에 `app/(auth)`를 추가한다.

## 주요 참고 자료

- Figma 숙박권 구매 메인 프레임: <https://www.figma.com/design/NtRv2iAX2RQp5BBQR5baC4/%EB%A9%94%EC%9D%B8%EC%BA%A0%ED%94%84--%EB%B3%B5%EC%82%AC-?node-id=285-31929&t=YsZN72ODO2GrnEYU-0>
- 참고 프로젝트 절대 경로: `/Users/cheng80/Desktop/Sesac_Works/Master/triptalk_example`
- 기술 수준 제약 참고 프로젝트: `/Users/cheng80/Desktop/Sesac_Works/Master/core_master_codes`
- 숙박권 페이지: `app/(main)/travelproducts/page.tsx`
- 숙박권 CSS: `app/(main)/travelproducts/styles.module.css`
- 숙박권 상세: `app/(main)/travelproducts/[travelproductId]/page.tsx`
- 숙박권 판매 폼: `app/(main)/travelproducts/_components/travel-product-form.tsx`
- 트립토크 메인: `app/(main)/boards/page.tsx`
- 트립토크 상세: `app/(main)/boards/[boardId]/page.tsx`
- 트립토크 등록·수정 폼: `app/(main)/boards/_components/board-form.tsx`
- 공통 헤더: `app/(main)/layout.tsx`

## 주의사항

- 라우트는 루트 `app`을 유지하며 `src/app`으로 이동하지 않는다.
- `@/*`는 프로젝트 루트를 가리키는 현재 설정을 유지한다.
- 실제 API가 준비되기 전에는 더미 데이터와 화면 상태만 작성한다.
- Kakao 우편번호 서비스는 별도 서비스 키 없이 사용하며 `.env` 설정이 필요하지 않다.
- 실제 Vercel 배포 결과는 아직 확인하지 않았다.
- `next.config.ts`의 `allowedDevOrigins`는 `172.16.1.108`만 허용한다. 개발 PC의 네트워크 IP가 바뀌면 갱신이 필요하다.

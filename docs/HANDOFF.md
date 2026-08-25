# TripTrip 작업 인수인계

작성일: 2026-08-25

진행 체크리스트는 [PROGRESS.md](./PROGRESS.md)에서 관리한다.

## 현재 Git 상태

- 현재 체크아웃 브랜치: `dev`
- `dev`에서 공통 컴포넌트와 UI·상태 로직 분리 작업 완료
- 이번 구조 변경은 Pull Request를 통해 `main`에 병합
- 후속 작업은 단일 작업 브랜치 `dev`에서 진행
- 병합이 끝난 `travelproducts-ui`는 로컬과 원격에서 삭제 완료
- 기존 미추적 계획 문서가 있는 `superpowers/docs/plans/`는 보존

주요 변경 파일:

- `app/(main)`의 라우트별 `page.tsx`, `page.module.css`
- `components/commons`: 헤더, 뒤로가기, 주소 검색, 이미지 업로드, 섹션 제목
- `components/boards`: 트립토크 카드·목록·상세·댓글·폼
- `components/travelproducts`: 배너·카드·검색/카테고리·상세·문의·구매·폼
- `data`: API 연결 전 화면에 주입하는 mock 데이터
- `hooks`: 검색·정렬·댓글·폼 제출 상태 로직
- `types`: 트립토크·숙박권 UI 데이터 계약
- `docs/HANDOFF.md`
- `docs/PROGRESS.md`

## 현재 구조 원칙

- 라우트의 `page.tsx`는 데이터 공급과 컴포넌트 조립만 담당
- `components`는 `data`를 직접 import하지 않고 props로만 데이터 수신
- 검색·정렬·댓글·폼 제출 상태는 `hooks`로 분리
- mock 데이터는 `data`, API 응답 계약은 `types`에서 관리
- API 연결 시 `page.tsx`의 mock import를 fetch 결과로, 관련 hook의 로컬 처리를 mutation 호출로 교체

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
- 핫 게시글 카드의 최대 너비와 제목·날짜 영역 고정, 좁은 화면 축소 처리
- `/boards/[boardId]` 게시글 이미지·위치·반응·댓글 상태
- `/boards/new`, `/boards/[boardId]/edit` 등록·수정 공통 폼
- 트립토크 폼의 Kakao 우편번호 주소 검색
- 현재 경로에 따른 숙박권·트립토크 헤더 활성 상태
- 공통 헤더와 주소 검색 컴포넌트
- 공통 뒤로가기와 이미지 업로드 컴포넌트
- 재사용 가능한 트립토크 카드와 숙박권 카드
- 메인·상세 라우트의 조립식 도메인 컴포넌트
- 페이지·컴포넌트 이름에 맞춘 개별 CSS Module

GraphQL, Apollo Provider, API 요청, 실제 구매·등록·수정·문의·게시글·댓글 저장은 구현하지 않았다.
배너와 팝업, 폼 완료 표시는 브라우저 내부의 정적 상태만 사용한다.

## 현재 검증 상태

- `npm run lint` 통과
- `npm run build` 통과
- Kakao 우편번호 검색창 로드, 실제 주소 검색·선택, 상세 주소 포커스 이동 확인
- 390px 모바일 팝업과 Escape 닫기·포커스 복귀 확인
- 트립토크 1920px·781px·390px 화면과 가로 넘침 없음 확인
- 핫 카드 1370px·1000px·390px·320px 셀·제목·날짜 너비 확인
- 검색·페이지 이동·좋아요·댓글 등록·수정·삭제 상태 확인
- 트립토크 등록 폼의 주소 검색 열기·닫기와 포커스 복귀 확인
- 확장 프로그램이 없는 브라우저에서 console warning/error 없음
- 구조 분리 후 `npm run lint`, `npm run build` 통과
- 구조 분리 후 트립토크 1368px·499px 카드 최대 너비, 제목·날짜 너비 일치 확인
- 구조 분리 후 `/boards/new`의 제목·주소·상세 위치 필드 렌더링과 console warning/error 없음 확인
- props 데이터 주입 구조 전환 후 트립토크 목록·상세·수정 초기값과 댓글·반응 상태 확인
- 숙박권 메인·상세 조립 화면과 구매 팝업 확인
- 1368px·499px에서 카드와 주요 섹션 렌더링 확인, console warning/error 없음

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
3. `npm run dev`를 실행한다.
4. Figma의 로그인·회원가입 1920px·781px·모바일 프레임을 먼저 확인한다.
5. 예시 프로젝트의 `src/app/(auth)/login`, `src/app/(auth)/signup`을 참고한다.
6. 루트 `app` 아래에 `app/(auth)`를 추가한다.

## 주요 참고 자료

- Figma 숙박권 구매 메인 프레임: <https://www.figma.com/design/NtRv2iAX2RQp5BBQR5baC4/%EB%A9%94%EC%9D%B8%EC%BA%A0%ED%94%84--%EB%B3%B5%EC%82%AC-?node-id=285-31929&t=YsZN72ODO2GrnEYU-0>
- 참고 프로젝트 절대 경로: `/Users/cheng80/Desktop/Sesac_Works/Master/triptalk_example`
- 기술 수준 제약 참고 프로젝트: `/Users/cheng80/Desktop/Sesac_Works/Master/core_master_codes`
- 로그인 참고 화면: `/Users/cheng80/Desktop/Sesac_Works/Master/triptalk_example/src/app/(auth)/login/page.tsx`
- 회원가입 참고 화면: `/Users/cheng80/Desktop/Sesac_Works/Master/triptalk_example/src/app/(auth)/signup/page.tsx`
- 숙박권 페이지: `app/(main)/travelproducts/page.tsx`
- 숙박권 CSS: `app/(main)/travelproducts/page.module.css`
- 숙박권 상세: `app/(main)/travelproducts/[travelproductId]/page.tsx`
- 숙박권 판매 폼: `components/travelproducts/travel-product-form.tsx`
- 트립토크 메인: `app/(main)/boards/page.tsx`
- 트립토크 상세: `components/boards/board-detail.tsx`
- 트립토크 등록·수정 폼: `components/boards/board-form.tsx`
- 공통 헤더: `components/commons/header.tsx`
- 공통 주소 검색: `components/commons/address-fields.tsx`
- mock 데이터: `data/boards.ts`, `data/travel-products.ts`
- 상태 로직: `hooks/`
- 데이터 타입: `types/`

## 주의사항

- 라우트는 루트 `app`을 유지하며 `src/app`으로 이동하지 않는다.
- `@/*`는 프로젝트 루트를 가리키는 현재 설정을 유지한다.
- 실제 API가 준비되기 전에는 더미 데이터와 화면 상태만 작성한다.
- Kakao 우편번호 서비스는 별도 서비스 키 없이 사용하며 `.env` 설정이 필요하지 않다.
- 실제 Vercel 배포 결과는 아직 확인하지 않았다.
- `next.config.ts`의 `allowedDevOrigins`는 `172.16.1.108`만 허용한다. 개발 PC의 네트워크 IP가 바뀌면 갱신이 필요하다.

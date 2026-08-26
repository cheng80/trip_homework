# TripTrip 작업 인수인계

작성일: 2026-08-27

진행 체크리스트는 [PROGRESS.md](./PROGRESS.md)에서 관리한다.

## 현재 Git 상태

- 현재 체크아웃 브랜치: `dev`
- `60becb9` 마이페이지 정적 화면 커밋을 `dev`, `origin/dev`, `main`, `origin/main`에 반영
- 현재 `dev`에는 포인트 충전·헤더 보완과 GraphQL API 적용 준비 작업이 미커밋 상태로 진행 중
- 구조 변경 PR [#1](https://github.com/cheng80/trip_homework/pull/1) 병합 완료
- 후속 작업은 단일 작업 브랜치 `dev`에서 진행
- 병합이 끝난 `travelproducts-ui`는 로컬과 원격에서 삭제 완료

## Git 작업 원칙

- `main`은 통합 기준으로 유지하고 후속 작업은 `dev`에서 진행한다.
- 변경 검증 후 `dev`를 먼저 push하고 `main`에 병합한다.
- 병합 후 `dev`를 `main`까지 fast-forward해 두 브랜치를 다시 동기화한다.
- 원격 브랜치가 앞서 있거나 충돌·push 실패가 발생하면 강제 push하지 않고 중단한다.
- 작업 브랜치는 고유 커밋이 없고 병합이 완료된 경우에만 삭제한다.

주요 변경 파일:

- `app/(main)`의 라우트별 `page.tsx`, `page.module.css`
- `components/commons`: 헤더, 뒤로가기, 주소 검색, 이미지 업로드, 섹션 제목
- `components/boards`: 트립토크 카드·목록·상세·댓글·폼
- `components/travelproducts`: 배너·카드·검색/카테고리·상세·문의·구매·폼
- `components/auth`: 로그인·회원가입 공통 화면과 정적 입력 상태
- `data`: API 연결 전 화면에 주입하는 mock 데이터
- `domain`: 인증 검증과 게시글 검색·정렬·페이지 계산 순수 로직
- `graphql`: 전송 클라이언트, API 응답 타입, Query·Mutation 문서
- `services`: GraphQL 응답을 UI 모델로 변환하고 기능별 요청을 제공하는 계층
- `hooks`: 검색·정렬·댓글·폼 제출 상태 로직
- `types`: 트립토크·숙박권·마이페이지 UI 데이터 계약
- `docs/HANDOFF.md`
- `docs/PROGRESS.md`

## 현재 구조 원칙

- 라우트의 `page.tsx`는 데이터 공급과 컴포넌트 조립만 담당
- `components`는 `data`를 직접 import하지 않고 props로만 데이터 수신
- 화면 상태는 `hooks`, 재사용 가능한 검증·선택 규칙은 `domain`으로 분리
- mock 데이터는 `data`, UI 모델은 `types`, GraphQL 원본 응답 타입은 `graphql/types.ts`에서 관리
- `services`가 GraphQL 원본 응답을 UI 모델로 변환하므로 컴포넌트는 API 필드명을 직접 사용하지 않음
- API 연결 시 `page.tsx`의 mock import를 `services` 조회 함수로, 관련 hook의 로컬 처리를 service Mutation 호출로 교체

## 현재 화면 범위

`dev`에는 숙박권, 트립토크, 로그인·회원가입, 마이페이지 정적 화면이 구현되어 있다.

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
- `/login` 로그인 이미지·이메일·비밀번호 폼과 오류·입력 완료 상태
- `/signup` 이름·이메일·비밀번호·비밀번호 확인 폼과 필드 오류·완료 팝업
- 인증 화면의 400px 폼 영역과 1920px·781px·모바일 반응형 분기
- 공통 헤더의 로그인 메뉴에서 `/login` 이동
- `/mypage` 회원 정보·보유 포인트 요약
- 숙박권 거래내역·북마크 전환 상태
- 포인트 충전·사용 내역과 페이지 이동 상태
- 현재·새 비밀번호 입력 검증과 변경 완료 상태
- 공통 헤더의 마이페이지 메뉴에서 `/mypage` 이동
- 로그인 전 헤더의 로그인 버튼과 활성 메뉴 표시
- `/mypage`에서 로그인 후 프로필·포인트 드롭다운 표시
- 모바일 전체 메뉴와 로그인 전·후 상태 표시
- 마이페이지의 네이티브 `dialog` 포인트 충전 팝업
- 충전 금액 프리셋·직접 입력·최소 금액 검증 상태
- 충전 확인·완료와 예상 보유 포인트 표시

네이티브 `fetch` GraphQL 클라이언트, 동일 출처 프록시, 기능별 서비스와 Query·Mutation 문서는 준비했다.
페이지는 아직 mock 데이터를 사용하며 실제 로그인·회원가입·구매·등록·수정·문의·게시글·댓글 Mutation은 연결하지 않았다.
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
- PR #1의 Vercel·Vercel Preview Comments checks 통과
- `96f040e` 기준 Vercel main 배포 상태 `success` 확인
- 로그인·회원가입 추가 후 `npm run lint`, `npm run build` 통과
- 인증 화면 1920px·781px·390px·320px 가로 넘침 없음 확인
- 로그인 오류 포커스·완료 상태와 회원가입 필드 오류·완료 팝업 확인
- 헤더의 로그인 메뉴 이동과 인증 화면 console warning/error 없음 확인
- GraphQL live schema와 한글 메타데이터 양방향 검사 통과
- GraphQL 문서 생성, `npm run lint`, `npm run build` 통과
- 운영 의존성 audit 취약점 0건 확인
- 마이페이지 추가 후 `npm test`, `npm run lint`, `npm run build` 통과
- 마이페이지 1920px·781px·390px 렌더링과 가로 넘침 없음 확인
- 거래내역·북마크 전환, 포인트 페이지 이동, 비밀번호 불일치·완료 상태 확인
- 마이페이지 console warning/error 없음 확인
- 포인트 충전 금액 정규화·검증 테스트 통과
- 포인트 충전 1920px·781px·390px 렌더링과 가로 넘침 없음 확인
- 직접 입력 오류 포커스, 프리셋 선택, 확인·완료·닫기 포커스 복귀 확인
- 포인트 충전 console warning/error 없음 확인
- Figma의 로그인 전·후·프로필 클릭 헤더 배리에이션 확인
- 로그인 전·후 헤더와 데스크톱 프로필·모바일 메뉴 상태 확인
- 전체 12개 라우트의 1920px·781px·390px 화면에서 가로 넘침·404 없음 확인
- 트립토크·숙박권 수정 화면의 기존 미리보기 이미지 로드 확인
- GraphQL Query·Mutation 34개 live introspection 스키마 검증 통과
- `/api/graphql` 프록시를 통한 `fetchBoards` 읽기 요청 성공 확인
- API 준비 리팩터링 후 6개 대표 라우트의 1920px·781px·390px 렌더링·이미지·가로 넘침 확인

## 다음 작업: README 프로젝트 설명 교체

사용자에게 프로젝트 설명 시안을 먼저 확인받은 뒤 `README.md`를 교체한다.

1. 프로젝트 소개와 현재 정적 구현 범위를 작성
2. 주요 화면·기술 스택·실행·검증 명령 정리
3. GraphQL 준비 범위와 아직 연결하지 않은 인증·결제 Mutation을 명시

## 다음 세션 시작 방법

1. `git status --short --branch`로 브랜치와 작업 상태를 확인한다.
2. 승인된 시안대로 `README.md`만 교체한다.
3. 문서의 실행·검증 명령이 `package.json`과 일치하는지 확인한다.
4. 공개 조회(`fetchBoards`, `fetchTravelproducts`)부터 서비스 함수로 교체한다.
5. 토큰 저장 정책을 결정한 뒤 인증·마이페이지·Mutation을 연결한다.

## 주요 참고 자료

- Figma 숙박권 구매 메인 프레임: <https://www.figma.com/design/NtRv2iAX2RQp5BBQR5baC4/%EB%A9%94%EC%9D%B8%EC%BA%A0%ED%94%84--%EB%B3%B5%EC%82%AC-?node-id=285-31929&t=YsZN72ODO2GrnEYU-0>
- Figma 로그인·회원가입 섹션: <https://www.figma.com/design/NtRv2iAX2RQp5BBQR5baC4/%EB%A9%94%EC%9D%B8%EC%BA%A0%ED%94%84--%EB%B3%B5%EC%82%AC-?node-id=285-32640>
- 참고 프로젝트 절대 경로: `/Users/cheng80/Desktop/Sesac_Works/Master/triptalk_example`
- 기술 수준 제약 참고 프로젝트: `/Users/cheng80/Desktop/Sesac_Works/Master/core_master_codes`
- 로그인 참고 화면: `/Users/cheng80/Desktop/Sesac_Works/Master/triptalk_example/src/app/(auth)/login/page.tsx`
- 회원가입 참고 화면: `/Users/cheng80/Desktop/Sesac_Works/Master/triptalk_example/src/app/(auth)/signup/page.tsx`
- 인증 공통 화면: `components/auth/auth-form.tsx`
- 인증 공통 CSS: `components/auth/auth-form.module.css`
- 마이페이지 조립 화면: `app/(main)/mypage/page.tsx`
- 마이페이지 상태와 UI: `components/mypage/mypage.tsx`
- 마이페이지 CSS: `components/mypage/mypage.module.css`
- 숙박권 페이지: `app/(main)/travelproducts/page.tsx`
- 숙박권 CSS: `app/(main)/travelproducts/page.module.css`
- 숙박권 상세: `app/(main)/travelproducts/[travelproductId]/page.tsx`
- 숙박권 판매 폼: `components/travelproducts/travel-product-form.tsx`
- 트립토크 메인: `app/(main)/boards/page.tsx`
- 트립토크 상세: `components/boards/board-detail.tsx`
- 트립토크 등록·수정 폼: `components/boards/board-form.tsx`
- 공통 헤더: `components/commons/header.tsx`
- 공통 주소 검색: `components/commons/address-fields.tsx`
- mock 데이터: `data/boards.ts`, `data/travel-products.ts`, `data/mypage.ts`
- GraphQL 요청·문서: `graphql/client.ts`, `graphql/queries.ts`, `graphql/mutations.ts`, `graphql/types.ts`
- API 응답 변환과 기능 서비스: `services/`
- 순수 비즈니스 규칙: `domain/`
- 상태 로직: `hooks/`
- 데이터 타입: `types/`

## 주의사항

- 라우트는 루트 `app`을 유지하며 `src/app`으로 이동하지 않는다.
- `@/*`는 프로젝트 루트를 가리키는 현재 설정을 유지한다.
- 실제 API 전환 전까지 페이지는 mock 데이터를 유지하고, UI 컴포넌트에서 GraphQL 원본 타입을 직접 사용하지 않는다.
- access token 저장 방식은 아직 결정하지 않았으며 인증 Mutation 연결 전 별도로 확정한다.
- Kakao 우편번호 서비스는 별도 서비스 키 없이 사용하며 `.env` 설정이 필요하지 않다.
- Vercel main 배포 성공 상태는 확인했으나 배포된 공개 주소의 주요 화면 수동 확인은 남아 있다.
- `next.config.ts`의 `allowedDevOrigins`는 `172.16.1.108`만 허용한다. 개발 PC의 네트워크 IP가 바뀌면 갱신이 필요하다.

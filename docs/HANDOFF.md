# TripTrip 작업 인수인계

작성일: 2026-08-25

진행 체크리스트는 [PROGRESS.md](./PROGRESS.md)에서 관리한다.

## 현재 Git 상태

- 현재 체크아웃 브랜치: `main`
- `travelproducts-ui` 최신 커밋: `f229ed8 문서: 프로젝트 진행 상태와 인수인계 정리`
- `travelproducts-ui` 병합 커밋: `9bd8506 Merge remote-tracking branch 'origin/travelproducts-ui'`
- 최신 화면 커밋: `eac50b9 수정: 숙박권 구매 반응형 화면 보완`
- `main`과 `origin/main`은 현재 작업 커밋까지 동기화됨
- `travelproducts-ui`와 `origin/travelproducts-ui`는 `f229ed8`로 동기화됨
- `main`은 `travelproducts-ui`의 최신 커밋과 이후 반응형 보완 사항을 포함함

주요 변경 파일:

- `app/(main)/layout.tsx`
- `app/(main)/layout.module.css`
- `app/(main)/travelproducts/page.tsx`
- `app/(main)/travelproducts/styles.module.css`
- `docs/HANDOFF.md`
- `docs/PROGRESS.md`

## 현재 화면 범위

`travelproducts-ui`의 `/travelproducts`에는 다음 정적 화면이 구현되어 있다.

- 헤더와 메뉴
- 메인 배너
- 추천 숙소 영역
- 프로모션 배너
- 날짜·지역 검색 폼
- 숙소 카테고리
- 숙박권 카드 목록
- 데스크톱·태블릿·모바일 CSS 분기

GraphQL, Provider, API 요청, 로그인, 검색 처리, 판매 등록 이동 등 실제 기능은 구현하지 않았다.

## 다음 세션 시작 방법

1. `git status --short --branch`로 브랜치와 작업 상태를 확인한다.
2. 현재 변경사항을 보존한 뒤 `main`을 후속 작업의 기준으로 사용한다.
3. `yarn dev`를 실행한다.
4. `/travelproducts` 화면을 확인한다.
5. [PROGRESS.md](./PROGRESS.md)의 미완료 항목부터 이어서 작업한다.

## 주요 참고 자료

- Figma 숙박권 구매 메인 프레임: <https://www.figma.com/design/NtRv2iAX2RQp5BBQR5baC4/%EB%A9%94%EC%9D%B8%EC%BA%A0%ED%94%84--%EB%B3%B5%EC%82%AC-?node-id=285-31929&t=YsZN72ODO2GrnEYU-0>
- 참고 프로젝트 절대 경로: `/Users/cheng80/Desktop/Sesac_Works/Master/triptalk_example`
- 기술 수준 제약 참고 프로젝트: `/Users/cheng80/Desktop/Sesac_Works/Master/core_master_codes`
- 숙박권 페이지: `app/(main)/travelproducts/page.tsx`
- 숙박권 CSS: `app/(main)/travelproducts/styles.module.css`
- 공통 헤더: `app/(main)/layout.tsx`

## 주의사항

- `main`에는 `travelproducts-ui`의 상세 UI가 병합되어 있다.
- 실제 Vercel 배포 결과는 아직 확인하지 않았다.
- `next.config.ts`의 `allowedDevOrigins`는 `172.16.1.108`만 허용한다. 개발 PC의 네트워크 IP가 바뀌면 갱신이 필요하다.

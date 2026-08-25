# TripTrip 작업 인수인계

작성일: 2026-08-25

진행 체크리스트는 [PROGRESS.md](./PROGRESS.md)에서 관리한다.

## 현재 Git 상태

- 현재 체크아웃 브랜치: `dev`
- `dev`, `origin/dev`, `main`, `origin/main`의 기준 커밋: `1168487 문서: main 작업 상태와 진행 현황 갱신`
- 후속 작업은 단일 작업 브랜치 `dev`에서 진행
- 병합이 끝난 `travelproducts-ui`는 로컬과 원격에서 삭제 완료
- 이번 숙박권 정적 화면 작업은 아직 커밋·푸시하지 않은 상태
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
- `docs/HANDOFF.md`
- `docs/PROGRESS.md`

## 현재 화면 범위

`dev`에는 다음 숙박권 정적 화면이 구현되어 있다.

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
- 데스크톱·태블릿·모바일 CSS 분기

GraphQL, Apollo Provider, API 요청, 주소 검색, 실제 구매·등록·수정·문의 저장은 구현하지 않았다.
배너와 팝업, 폼 완료 표시는 브라우저 내부의 정적 상태만 사용한다.

## 다음 세션 시작 방법

1. `git status --short --branch`로 브랜치와 작업 상태를 확인한다.
2. 현재 변경사항을 보존한 뒤 `dev`에서 후속 작업을 진행한다.
3. `yarn dev`를 실행한다.
4. `/travelproducts`, `/travelproducts/1`, `/travelproducts/new`, `/travelproducts/1/edit`를 확인한다.
5. [PROGRESS.md](./PROGRESS.md)의 미완료 항목부터 이어서 작업한다.

## 주요 참고 자료

- Figma 숙박권 구매 메인 프레임: <https://www.figma.com/design/NtRv2iAX2RQp5BBQR5baC4/%EB%A9%94%EC%9D%B8%EC%BA%A0%ED%94%84--%EB%B3%B5%EC%82%AC-?node-id=285-31929&t=YsZN72ODO2GrnEYU-0>
- 참고 프로젝트 절대 경로: `/Users/cheng80/Desktop/Sesac_Works/Master/triptalk_example`
- 기술 수준 제약 참고 프로젝트: `/Users/cheng80/Desktop/Sesac_Works/Master/core_master_codes`
- 숙박권 페이지: `app/(main)/travelproducts/page.tsx`
- 숙박권 CSS: `app/(main)/travelproducts/styles.module.css`
- 숙박권 상세: `app/(main)/travelproducts/[travelproductId]/page.tsx`
- 숙박권 판매 폼: `app/(main)/travelproducts/_components/travel-product-form.tsx`
- 공통 헤더: `app/(main)/layout.tsx`

## 주의사항

- 라우트는 루트 `app`을 유지하며 `src/app`으로 이동하지 않는다.
- `@/*`는 프로젝트 루트를 가리키는 현재 설정을 유지한다.
- 실제 API가 준비되기 전에는 더미 데이터와 화면 상태만 작성한다.
- 실제 Vercel 배포 결과는 아직 확인하지 않았다.
- `next.config.ts`의 `allowedDevOrigins`는 `172.16.1.108`만 허용한다. 개발 PC의 네트워크 IP가 바뀌면 갱신이 필요하다.

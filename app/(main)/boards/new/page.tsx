/**
 * 역할: 새 트립토크 작성 라우트의 서버 진입점입니다.
 * 처리 흐름: 작성 모드의 BoardForm만 렌더링하며 초기 게시글 데이터는 전달하지 않습니다.
 * 주의사항: 폼의 검증·업로드·등록 요청은 전용 훅에서 처리합니다.
 */
import BoardForm from "@/components/boards/board-form";

export default function BoardNewPage() {
  return <BoardForm mode="create" />;
}

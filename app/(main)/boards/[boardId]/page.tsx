/**
 * 역할: 트립토크 상세 데이터를 조회해 상세 UI에 전달하는 서버 컴포넌트입니다.
 * 처리 흐름: 게시글 ID로 본문과 댓글을 조회한 뒤 본문 HTML을 서버에서 정제합니다.
 * 주의사항: 클라이언트에는 실행 가능한 태그가 제거된 데이터만 전달합니다.
 */
import BoardDetail from "@/components/boards/board-detail";
import { sanitizeRichText } from "@/domain/sanitize-rich-text";
import { getBoardDetail } from "@/services/boards";

type BoardDetailPageProps = {
  params: Promise<{ boardId: string }>;
};

export default async function BoardDetailPage({ params }: BoardDetailPageProps) {
  const { boardId } = await params;
  const board = await getBoardDetail(boardId);

  return (
    <BoardDetail
      boardId={boardId}
      board={{ ...board, contents: sanitizeRichText(board.contents) }}
      key={boardId}
    />
  );
}

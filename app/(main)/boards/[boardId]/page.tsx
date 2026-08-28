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

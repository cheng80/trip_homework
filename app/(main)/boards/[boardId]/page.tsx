import BoardDetail from "@/components/boards/board-detail";
import { boardDetail, boardViewer } from "@/data/boards";

type BoardDetailPageProps = {
  params: Promise<{ boardId: string }>;
};

export default async function BoardDetailPage({ params }: BoardDetailPageProps) {
  const { boardId } = await params;

  return <BoardDetail boardId={boardId} board={boardDetail} viewer={boardViewer} key={boardId} />;
}

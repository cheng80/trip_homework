import BoardForm from "../../_components/board-form";

type BoardEditPageProps = {
  params: Promise<{ boardId: string }>;
};

export default async function BoardEditPage({ params }: BoardEditPageProps) {
  const { boardId } = await params;

  return <BoardForm mode="edit" boardId={boardId} />;
}

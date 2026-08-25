import BoardForm from "@/components/boards/board-form";
import { boardFormValues } from "@/data/boards";

type BoardEditPageProps = {
  params: Promise<{ boardId: string }>;
};

export default async function BoardEditPage({ params }: BoardEditPageProps) {
  const { boardId } = await params;

  return <BoardForm mode="edit" boardId={boardId} initialValues={boardFormValues} />;
}

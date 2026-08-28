import BoardForm from "@/components/boards/board-form";
import { sanitizeRichText } from "@/domain/sanitize-rich-text";
import { getBoardForm } from "@/services/boards";

type BoardEditPageProps = {
  params: Promise<{ boardId: string }>;
};

export default async function BoardEditPage({ params }: BoardEditPageProps) {
  const { boardId } = await params;
  const initialValues = await getBoardForm(boardId);

  return (
    <BoardForm
      mode="edit"
      boardId={boardId}
      initialValues={{ ...initialValues, contents: sanitizeRichText(initialValues.contents) }}
    />
  );
}

/**
 * 역할: 트립토크 수정 화면에 기존 게시글 데이터를 공급하는 서버 컴포넌트입니다.
 * 처리 흐름: 라우트 ID로 게시글을 조회하고 저장된 본문을 에디터가 읽을 수 있는 안전한 HTML로 정제합니다.
 * 주의사항: 정제된 초기값만 클라이언트 폼 경계를 넘어가도록 유지합니다.
 */
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

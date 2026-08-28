/**
 * 역할: 서버에서 정제된 리치 텍스트 HTML을 공통 스타일로 출력합니다.
 * 처리 흐름: sanitizeRichText를 거친 문자열만 받는 계약으로 불필요한 클라이언트 파싱을 피합니다.
 * 주의사항: 정제되지 않은 사용자 입력을 직접 전달하면 안 됩니다.
 */
import styles from "./rich-text-content.module.css";

type RichTextContentProps = {
  sanitizedHtml: string;
};

export default function RichTextContent({ sanitizedHtml }: RichTextContentProps) {
  return <div className={styles.content} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}

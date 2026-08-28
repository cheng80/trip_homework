import styles from "./rich-text-content.module.css";

type RichTextContentProps = {
  sanitizedHtml: string;
};

export default function RichTextContent({ sanitizedHtml }: RichTextContentProps) {
  return <div className={styles.content} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
}

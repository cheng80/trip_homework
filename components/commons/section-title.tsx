import type { ReactNode } from "react";
import styles from "./section-title.module.css";

type SectionTitleProps = {
  as: "h1" | "h2";
  id: string;
  children: ReactNode;
};

export default function SectionTitle({ as: Title, id, children }: SectionTitleProps) {
  return <Title className={styles.title} id={id}>{children}</Title>;
}

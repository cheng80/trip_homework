import type { ComponentPropsWithoutRef, Ref } from "react";
import styles from "./dialog.module.css";

type DialogProps = ComponentPropsWithoutRef<"dialog"> & {
  ref?: Ref<HTMLDialogElement>;
};

export default function Dialog({ className, ...props }: DialogProps) {
  return <dialog className={`${styles.dialog} ${className ?? ""}`} {...props} />;
}

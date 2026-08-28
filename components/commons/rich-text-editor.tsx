"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { richTextLength } from "@/domain/rich-text";
import styles from "./rich-text-editor.module.css";

type RichTextEditorProps = {
  id: string;
  initialValue?: string;
  label: string;
  maxLength: number;
  name: string;
  placeholder: string;
  statusId: string;
};

const QuillEditor = dynamic(() => import("./quill-editor"), {
  ssr: false,
  loading: () => <div className={styles.loading} role="status">에디터를 불러오는 중입니다.</div>,
});

export default function RichTextEditor({
  id,
  initialValue = "",
  label,
  maxLength,
  name,
  placeholder,
  statusId,
}: RichTextEditorProps) {
  const [value, setValue] = useState(initialValue);
  const length = richTextLength(value);
  const invalid = length > maxLength;
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  return (
    <div className={styles.field} data-rich-text-field={name} data-invalid={invalid || undefined}>
      <label id={labelId} htmlFor={id}>{label} *</label>
      <div className={styles.editor}>
        <QuillEditor
          editorId={id}
          labelledBy={labelId}
          describedBy={`${descriptionId} ${statusId}`}
          invalid={invalid}
          value={value}
          placeholder={placeholder}
          onChange={setValue}
        />
      </div>
      <input type="hidden" name={name} value={value} />
      <div className={styles.description} id={descriptionId}>
        <small>제목과 목록 등 필요한 서식을 적용할 수 있습니다.</small>
        <span aria-live="polite">{length.toLocaleString()} / {maxLength.toLocaleString()}자</span>
      </div>
    </div>
  );
}

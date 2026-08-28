"use client";

import { useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";

type QuillEditorProps = {
  describedBy: string;
  editorId: string;
  invalid: boolean;
  labelledBy: string;
  onChange: (html: string) => void;
  placeholder: string;
  value: string;
};

const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "blockquote",
  "link",
];

export default function QuillEditor({
  describedBy,
  editorId,
  invalid,
  labelledBy,
  onChange,
  placeholder,
  value,
}: QuillEditorProps) {
  const editorRef = useRef<ReactQuill>(null);

  useEffect(() => {
    const editor = editorRef.current?.getEditor().root;
    if (!editor) return;
    editor.id = editorId;
    editor.setAttribute("role", "textbox");
    editor.setAttribute("aria-multiline", "true");
    editor.setAttribute("aria-required", "true");
    editor.setAttribute("aria-labelledby", labelledBy);
    editor.setAttribute("aria-describedby", describedBy);
    editor.setAttribute("aria-invalid", String(invalid));

    const toolbar = editor.closest(".quill")?.querySelector(".ql-toolbar");
    const labels = [
      ["button.ql-bold", "굵게"],
      ["button.ql-italic", "기울임"],
      ["button.ql-underline", "밑줄"],
      ["button.ql-strike", "취소선"],
      ['button.ql-list[value="ordered"]', "번호 목록"],
      ['button.ql-list[value="bullet"]', "글머리 기호 목록"],
      ["button.ql-blockquote", "인용"],
      ["button.ql-link", "링크"],
      ["button.ql-clean", "서식 지우기"],
    ] as const;
    labels.forEach(([selector, label]) => toolbar?.querySelector(selector)?.setAttribute("aria-label", label));
    toolbar?.querySelectorAll(".ql-header").forEach((control) => control.setAttribute("aria-label", "제목 스타일"));
  }, [describedBy, editorId, invalid, labelledBy]);

  return (
    <ReactQuill
      ref={editorRef}
      theme="snow"
      value={value}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
      onChange={(html) => {
        editorRef.current?.getEditor().root.setAttribute("aria-invalid", "false");
        onChange(html);
      }}
    />
  );
}

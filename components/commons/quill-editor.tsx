/**
 * 역할: React Quill 인스턴스와 툴바 설정을 캡슐화한 브라우저 전용 편집기입니다.
 * 처리 흐름: 허용 서식과 툴바 구성을 고정하고 실제 contenteditable 영역에 접근성 속성을 연결합니다.
 * 주의사항: 편집 결과는 HTML 문자열로 상위 제어 컴포넌트에 전달합니다.
 */
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

/**
 * Quill이 생성한 내부 DOM은 JSX에서 직접 속성을 지정할 수 없어 마운트 후 접근성 정보를 보강합니다.
 * 툴바 아이콘에도 한국어 이름을 부여해 스크린 리더가 기능을 설명할 수 있게 합니다.
 */
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
        // 사용자가 입력을 시작하면 이전 제출에서 설정한 오류 상태를 즉시 해제합니다.
        editorRef.current?.getEditor().root.setAttribute("aria-invalid", "false");
        onChange(html);
      }}
    />
  );
}

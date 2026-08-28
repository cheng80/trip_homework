import assert from "node:assert/strict";
import test from "node:test";
import {
  hasRichTextContent,
  richTextLength,
} from "./rich-text.ts";
import {
  sanitizeRichText,
  sanitizeRichTextRequest,
} from "./sanitize-rich-text.ts";

test("비어 있는 Quill HTML과 실제 본문을 구분한다", () => {
  assert.equal(hasRichTextContent("<p><br></p>"), false);
  assert.equal(hasRichTextContent("<p><strong>통영 여행</strong></p>"), true);
  assert.equal(richTextLength("<p>통영&nbsp;여행</p>"), 5);
});

test("Quill 서식은 보존하고 실행 가능한 HTML은 제거한다", () => {
  const html = [
    '<h2 onclick="alert(1)">여행 안내</h2>',
    '<p><strong>준비물</strong><script>alert(1)</script></p>',
    '<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span>수영복</li></ol>',
    '<p><a href="javascript:alert(1)" onmouseover="alert(1)">위험 링크</a></p>',
    '<p><a href="https://example.com/path">안전 링크</a></p>',
  ].join("");

  assert.equal(
    sanitizeRichText(html),
    '<h2>여행 안내</h2><p><strong>준비물</strong></p><ol><li data-list="bullet"><span class="ql-ui"></span>수영복</li></ol><p><a>위험 링크</a></p><p><a href="https://example.com/path" target="_blank" rel="noopener noreferrer">안전 링크</a></p>',
  );
});

test("기존 일반 텍스트의 문단과 줄바꿈을 HTML로 변환한다", () => {
  assert.equal(
    sanitizeRichText("첫 줄\n둘째 줄\n\n새 문단"),
    "<p>첫 줄<br />둘째 줄</p><p>새 문단</p>",
  );
});

test("게시글과 숙박권 저장 요청만 서버에서 정제한다", () => {
  const boardRequest = {
    query: "mutation ($input: CreateBoardInput!) { createBoard(createBoardInput: $input) { _id } }",
    variables: { input: { title: "여행", contents: '<p onclick="alert(1)">안전한 본문</p>' } },
  };
  const commentRequest = {
    query: "mutation CreateBoardComment { createBoardComment { _id } }",
    variables: { input: { contents: "<태그처럼 보이는 댓글>" } },
  };

  assert.deepEqual(sanitizeRichTextRequest(boardRequest), {
    ...boardRequest,
    variables: { input: { title: "여행", contents: "<p>안전한 본문</p>" } },
  });
  assert.equal(sanitizeRichTextRequest(commentRequest), commentRequest);
});

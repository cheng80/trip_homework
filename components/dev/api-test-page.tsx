/**
 * 역할: GraphQL 작업별 변수 예시와 실제 응답을 확인하는 개발용 클라이언트 화면입니다.
 * 처리 흐름: 선택한 작업의 요청을 프록시에 전송하고 생성된 ID를 후속 작업 변수에 재사용합니다.
 * 주의사항: 비밀번호는 화면 출력 전에 가리지만 실제 요청에는 사용자가 입력한 값을 전달합니다.
 */
"use client";

import { useRef, useState, type SubmitEvent } from "react";
import {
  extractApiTestIds,
  findMissingApiTestIds,
  redactApiTestSecrets,
  resolveApiTestIds,
  type ApiTestSavedIds,
} from "@/domain/api-test";
import {
  apiTestCategories,
  apiTestOperations,
  type ApiTestOperation,
  type ApiTestRisk,
} from "@/data/api-test-operations";
import styles from "./api-test-page.module.css";

const riskLabels: Record<ApiTestRisk, string> = {
  read: "조회",
  session: "세션 변경",
  write: "데이터 변경",
  destructive: "삭제",
  irreversible: "되돌리기 어려움",
};

const savedIdLabels: Record<keyof ApiTestSavedIds, string> = {
  boardId: "게시글 ID",
  boardCommentId: "댓글 ID",
  travelproductId: "숙박권 ID",
  questionId: "문의 ID",
  answerId: "답변 ID",
  paymentId: "결제 ID",
};

const savedIdKeys = Object.keys(savedIdLabels) as Array<keyof ApiTestSavedIds>;
const format = (value: unknown) => JSON.stringify(value, null, 2);
const defaultOperation = apiTestOperations.find((operation) => operation.id === "fetch-boards") as ApiTestOperation;

function isGraphQLError(body: unknown) {
  return typeof body === "object" && body !== null && "errors" in body;
}

export default function ApiTestPage() {
  const [selectedId, setSelectedId] = useState(defaultOperation.id);
  const selected = apiTestOperations.find((operation) => operation.id === selectedId) as ApiTestOperation;
  const [variablesText, setVariablesText] = useState(format(defaultOperation.variables));
  const [savedIds, setSavedIds] = useState<ApiTestSavedIds>({});
  const [requestText, setRequestText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [status, setStatus] = useState("실행할 API와 variables를 확인해 주세요.");
  const [outcome, setOutcome] = useState<"idle" | "success" | "error">("idle");
  const [pending, setPending] = useState(false);
  const variablesRef = useRef<HTMLTextAreaElement>(null);

  const selectOperation = (operation: ApiTestOperation) => {
    setSelectedId(operation.id);
    setVariablesText(format(operation.variables));
    setRequestText("");
    setResponseText("");
    setOutcome("idle");
    setStatus(`${operation.label} variables를 확인해 주세요.`);
  };

  const runOperation = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    let variables: unknown;
    try {
      variables = JSON.parse(variablesText) as unknown;
    } catch {
      setOutcome("error");
      setStatus("variables가 올바른 JSON 형식이 아닙니다.");
      variablesRef.current?.focus();
      return;
    }

    const resolvedVariables = resolveApiTestIds(variables, savedIds);
    const missingIds = findMissingApiTestIds(resolvedVariables);
    if (missingIds.length) {
      setOutcome("error");
      setStatus(`${missingIds.join(", ")} 값을 실제 테스트 값으로 바꾸거나 저장 ID에 입력해 주세요.`);
      variablesRef.current?.focus();
      return;
    }

    if (selected.risk !== "read" && selected.risk !== "session") {
      const detail = selected.risk === "destructive"
        ? "선택한 데이터가 실제로 삭제됩니다."
        : selected.risk === "irreversible"
          ? "계정·비밀번호·포인트 상태를 되돌리기 어려울 수 있습니다."
          : "공용 연습 서버의 데이터가 실제로 변경됩니다.";
      if (!window.confirm(`${selected.label}을 실행할까요?\n\n${detail}`)) {
        setOutcome("idle");
        setStatus("요청을 보내지 않고 취소했습니다.");
        return;
      }
    }

    const requestBody = { query: selected.query, variables: resolvedVariables };
    setRequestText(format({
      operation: selected.label,
      endpoint: "/api/graphql",
      variables: redactApiTestSecrets(resolvedVariables),
    }));
    setResponseText("");
    setPending(true);
    setOutcome("idle");
    setStatus(`${selected.label} 요청 중...`);

    try {
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });
      const body = await response.json() as unknown;
      setResponseText(format(body));

      if (!response.ok || isGraphQLError(body)) {
        setOutcome("error");
        setStatus(`${selected.label} 요청이 실패했습니다. 응답의 errors를 확인해 주세요.`);
        return;
      }

      const captured = extractApiTestIds(body);
      const capturedKeys = Object.keys(captured) as Array<keyof ApiTestSavedIds>;
      if (capturedKeys.length) setSavedIds((current) => ({ ...current, ...captured }));
      setOutcome("success");
      setStatus(capturedKeys.length
        ? `${selected.label} 성공 · ${capturedKeys.map((key) => savedIdLabels[key]).join(", ")} 저장 완료`
        : `${selected.label} 요청에 성공했습니다.`);
    } catch (error) {
      setOutcome("error");
      setStatus(error instanceof Error ? error.message : "API 요청 중 알 수 없는 오류가 발생했습니다.");
    } finally {
      setPending(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Development only</p>
        <h1>GraphQL API 기능 테스트</h1>
        <p>예시 variables를 수정하고 실제 요청·응답을 확인하세요. 이 페이지는 개발 환경에서만 열립니다.</p>
      </header>

      <section className={styles.warning} aria-labelledby="api-test-warning">
        <strong id="api-test-warning">공용 연습 서버 주의</strong>
        <p>전용 테스트 계정과 <code>[triptrip-test]</code> 데이터만 사용하세요. Mutation은 실제 데이터를 변경하며 자동 정리되지 않습니다.</p>
      </section>

      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="API 작업 목록">
          {apiTestCategories.map((category) => (
            <section className={styles.operationGroup} key={category}>
              <h2>{category}</h2>
              <div>
                {apiTestOperations.filter((operation) => operation.category === category).map((operation) => (
                  <button
                    type="button"
                    className={selected.id === operation.id ? styles.selectedOperation : undefined}
                    aria-current={selected.id === operation.id ? "true" : undefined}
                    onClick={() => selectOperation(operation)}
                    key={operation.id}
                  >
                    <span>{operation.label}</span>
                    <small data-risk={operation.risk}>{riskLabels[operation.risk]}</small>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </aside>

        <div className={styles.workspace}>
          <section className={styles.operationCard} aria-labelledby="selected-operation-title">
            <div className={styles.operationHeading}>
              <div>
                <span data-risk={selected.risk}>{riskLabels[selected.risk]}</span>
                <h2 id="selected-operation-title">{selected.label}</h2>
                <p>{selected.summary}</p>
              </div>
              <button type="button" onClick={() => setVariablesText(format(selected.variables))}>
                예시 초기화
              </button>
            </div>

            {selected.prerequisite && (
              <p className={styles.prerequisite}><strong>선행 조건</strong> {selected.prerequisite}</p>
            )}
            {selected.warning && <p className={styles.operationWarning}>{selected.warning}</p>}

            <form onSubmit={runOperation}>
              <label htmlFor="api-test-variables">Variables JSON</label>
              <textarea
                id="api-test-variables"
                value={variablesText}
                onChange={(event) => setVariablesText(event.currentTarget.value)}
                spellCheck={false}
                aria-describedby="api-test-variables-help"
                ref={variablesRef}
              />
              <p id="api-test-variables-help">
                <code>{"{{boardId}}"}</code> 같은 값은 아래 저장 ID가 있으면 요청 직전에 자동 치환됩니다.
              </p>
              <button className={styles.runButton} type="submit" disabled={pending}>
                {pending ? "요청 중..." : selected.risk === "read" ? "조회 실행" : "실제 요청 실행"}
              </button>
            </form>

            <details className={styles.queryDetails}>
              <summary>GraphQL 문서 보기</summary>
              <pre>{selected.query.trim()}</pre>
            </details>
          </section>

          <section className={styles.savedIds} aria-labelledby="saved-id-title">
            <div>
              <h2 id="saved-id-title">후속 요청용 저장 ID</h2>
              <p>생성 요청 성공 시 자동 입력됩니다. 목록 응답의 ID를 직접 붙여 넣어도 됩니다.</p>
            </div>
            <div className={styles.idGrid}>
              {savedIdKeys.map((key) => (
                <label key={key}>
                  {savedIdLabels[key]}
                  <input
                    type="text"
                    value={savedIds[key] ?? ""}
                    onChange={(event) => setSavedIds((current) => ({
                      ...current,
                      [key]: event.currentTarget.value || undefined,
                    }))}
                    placeholder={`{{${key}}}`}
                  />
                </label>
              ))}
            </div>
          </section>

          <p className={styles.status} data-outcome={outcome} role="status" aria-live="polite">{status}</p>

          <section className={styles.outputGrid} aria-label="API 요청과 응답">
            <article>
              <h2>보낸 요청</h2>
              <pre>{requestText || "아직 보낸 요청이 없습니다."}</pre>
            </article>
            <article>
              <h2>받은 응답</h2>
              <pre>{responseText || "아직 받은 응답이 없습니다."}</pre>
            </article>
          </section>
        </div>
      </div>
    </main>
  );
}

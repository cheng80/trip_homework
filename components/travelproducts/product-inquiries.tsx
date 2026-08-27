"use client";

import Image from "next/image";
import { useProductInquiries } from "@/hooks/use-product-inquiries";
import type { TravelInquiry } from "@/types/travel-products";
import styles from "./product-inquiries.module.css";

type ProductInquiriesProps = {
  productId: string;
  sellerId?: string;
  inquiries: TravelInquiry[];
};

export default function ProductInquiries({ productId, sellerId, inquiries: initialInquiries }: ProductInquiriesProps) {
  const state = useProductInquiries(
    productId,
    sellerId,
    initialInquiries,
  );

  return (
    <section className={styles.section} aria-labelledby="inquiry-title">
      <div className={styles.heading}>
        <h2 id="inquiry-title">상품 문의</h2>
        <span>{state.inquiries.length}개</span>
      </div>

      <form className={styles.form} onSubmit={state.handleSubmit}>
        <label htmlFor="inquiry">문의 내용</label>
        <textarea
          id="inquiry"
          name="inquiry"
          value={state.contents}
          onChange={(event) => state.setContents(event.currentTarget.value)}
          maxLength={200}
          placeholder="숙박권에 대해 궁금한 내용을 작성해 주세요."
          required
        />
        <button type="submit" disabled={state.pending}>{state.pending ? "등록 중..." : "문의하기"}</button>
        {state.status && <p className={styles.status} role="status" aria-live="polite">{state.status}</p>}
      </form>

      {state.inquiries.map((inquiry) => {
        const reply = inquiry.answer?.contents ?? inquiry.reply ?? inquiry.editableReply;
        return (
        <article className={styles.inquiry} key={inquiry.id}>
          <div className={styles.meta}>
            <div>
              <strong>{inquiry.writer}</strong>
              <time dateTime={inquiry.date}>{inquiry.date.replaceAll("-", ". ")}</time>
            </div>
            {state.currentUserId === inquiry.writerId && (
              <div className={styles.actions}>
                <button type="button" onClick={() => state.startQuestionEdit(inquiry)}>수정</button>
                <button type="button" onClick={() => void state.deleteQuestion(inquiry.id)}>삭제</button>
              </div>
            )}
          </div>

          {state.editingQuestionId === inquiry.id ? (
            <div className={styles.editor}>
              <label htmlFor={`question-${inquiry.id}`}>문의 수정</label>
              <textarea
                id={`question-${inquiry.id}`}
                value={state.editingQuestionContents}
                onChange={(event) => state.setEditingQuestionContents(event.currentTarget.value)}
                maxLength={200}
              />
              <button type="button" onClick={() => void state.saveQuestion(inquiry.id)}>수정 완료</button>
            </div>
          ) : <p>{inquiry.question}</p>}

          {reply && (
            <div className={styles.reply}>
              <Image src="/icon/outline/reply.svg" alt="" width={20} height={20} />
              <div>
                <div className={styles.replyHeader}>
                  <strong>판매자 답변</strong>
                  {inquiry.answer && state.currentUserId === inquiry.answer.writerId && (
                    <span className={styles.actions}>
                      <button type="button" onClick={() => state.startAnswerEdit(inquiry)}>수정</button>
                      <button type="button" onClick={() => void state.deleteAnswer(inquiry.id, inquiry.answer!.id)}>삭제</button>
                    </span>
                  )}
                </div>
                {state.editingAnswerId === inquiry.answer?.id ? (
                  <div className={styles.editor}>
                    <label htmlFor={`answer-${inquiry.id}`}>답변 수정</label>
                    <textarea
                      id={`answer-${inquiry.id}`}
                      value={state.editingAnswerContents}
                      onChange={(event) => state.setEditingAnswerContents(event.currentTarget.value)}
                      maxLength={200}
                    />
                    <button type="button" onClick={() => void state.updateAnswer(inquiry.id, inquiry.answer!.id)}>수정 완료</button>
                  </div>
                ) : <p>{reply}</p>}
              </div>
            </div>
          )}

          {!reply && state.isSeller && state.answeringId !== inquiry.id && (
            <button className={styles.answerButton} type="button" onClick={() => state.startAnswer(inquiry.id)}>
              답변하기
            </button>
          )}
          {!reply && state.answeringId === inquiry.id && (
            <div className={styles.editor}>
              <label htmlFor={`new-answer-${inquiry.id}`}>판매자 답변</label>
              <textarea
                id={`new-answer-${inquiry.id}`}
                value={state.answerContents}
                onChange={(event) => state.setAnswerContents(event.currentTarget.value)}
                maxLength={200}
                placeholder="문의에 대한 답변을 작성해 주세요."
              />
              <button type="button" onClick={() => void state.saveAnswer(inquiry.id)}>답변 등록</button>
            </div>
          )}
        </article>
        );
      })}
    </section>
  );
}

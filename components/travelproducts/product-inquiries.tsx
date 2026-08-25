"use client";

import Image from "next/image";
import { useProductInquiries } from "@/hooks/use-product-inquiries";
import type { TravelInquiry } from "@/types/travel-products";
import styles from "./product-inquiries.module.css";

type ProductInquiriesProps = {
  inquiries: TravelInquiry[];
};

export default function ProductInquiries({ inquiries }: ProductInquiriesProps) {
  const { handleSubmit } = useProductInquiries();

  return (
    <section className={styles.section} aria-labelledby="inquiry-title">
      <div className={styles.heading}>
        <h2 id="inquiry-title">상품 문의</h2>
        <span>{inquiries.length}개</span>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="inquiry">문의 내용</label>
        <textarea
          id="inquiry"
          name="inquiry"
          maxLength={200}
          placeholder="숙박권에 대해 궁금한 내용을 작성해 주세요."
        />
        <button type="submit">문의하기</button>
      </form>

      {inquiries.map((inquiry) => (
        <article className={styles.inquiry} key={inquiry.id}>
          <div className={styles.meta}>
            <strong>{inquiry.writer}</strong>
            <time dateTime={inquiry.date}>{inquiry.date.replaceAll("-", ". ")}</time>
          </div>
          <p>{inquiry.question}</p>
          {inquiry.reply && (
            <div className={styles.reply}>
              <Image src="/icon/outline/reply.svg" alt="" width={20} height={20} />
              <div>
                <strong>판매자 답변</strong>
                <p>{inquiry.reply}</p>
              </div>
            </div>
          )}
          {inquiry.editableReply && (
            <div className={styles.editReply}>
              <label htmlFor={`reply-${inquiry.id}`}>판매자 답변 수정</label>
              <input id={`reply-${inquiry.id}`} defaultValue={inquiry.editableReply} />
              <button type="button">수정 완료</button>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import styles from "./styles.module.css";

const imagePath = "/images/숙박권 구매화면 이미지";

export default function TravelProductDetailPage() {
  const confirmDialog = useRef<HTMLDialogElement>(null);
  const pointDialog = useRef<HTMLDialogElement>(null);

  const showPointDialog = () => {
    confirmDialog.current?.close();
    pointDialog.current?.showModal();
  };

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link className={styles.back} href="/travelproducts">
          <Image src="/icon/outline/left_arrow.svg" alt="" width={20} height={20} />
          숙박권 목록
        </Link>

        <section className={styles.product} aria-labelledby="product-title">
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              <Image
                src={`${imagePath}/a.png`}
                alt="숲으로 둘러싸인 감성 숙소"
                fill
                priority
                sizes="(max-width: 780px) 100vw, 55vw"
              />
            </div>
            {['b.png', 'c.png', 'd.png'].map((image, index) => (
              <div className={styles.subImage} key={image}>
                <Image
                  src={`${imagePath}/${image}`}
                  alt={`숙소 상세 이미지 ${index + 2}`}
                  fill
                  sizes="(max-width: 780px) 33vw, 18vw"
                />
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <p className={styles.location}>포항</p>
            <h1 id="product-title">당장 가고 싶은 숲속 감성 스테이</h1>
            <p className={styles.tags}>#플랜테리어 #룸서비스 #불멍</p>
            <strong className={styles.price}>32,900원</strong>

            <div className={styles.seller}>
              <Image
                src="/images/프로필 이미지/01.png"
                alt="트립호스트 프로필"
                width={48}
                height={48}
              />
              <div>
                <span>판매자</span>
                <strong>트립호스트</strong>
              </div>
            </div>

            <dl className={styles.info}>
              <div>
                <dt>사용 기한</dt>
                <dd>2026. 09. 01 ~ 2026. 12. 31</dd>
              </div>
              <div>
                <dt>이용 인원</dt>
                <dd>기준 2인 · 최대 4인</dd>
              </div>
            </dl>

            <button
              className={styles.buyButton}
              type="button"
              onClick={() => confirmDialog.current?.showModal()}
            >
              구매하기
            </button>
            <Link className={styles.editLink} href="/travelproducts/1/edit">
              판매글 수정 화면 보기
            </Link>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="description-title">
          <h2 id="description-title">숙박권 상세 정보</h2>
          <p>
            포항의 조용한 숲길 끝에 자리한 독채 숙소입니다. 넓은 창으로 들어오는 햇살과
            나무 향을 느끼며 온전히 쉬어갈 수 있어요. 객실과 테라스, 불멍 공간을 모두
            단독으로 이용할 수 있습니다.
          </p>
          <ul>
            <li>체크인 15:00 · 체크아웃 11:00</li>
            <li>예약 확정 후 상세 이용 안내를 전달합니다.</li>
            <li>양도 숙박권 특성상 구매 전 사용 기한을 확인해 주세요.</li>
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="location-title">
          <h2 id="location-title">상세 위치</h2>
          <div className={styles.address}>
            <Image src="/icon/outline/location.svg" alt="" width={24} height={24} />
            <div>
              <strong>경상북도 포항시 북구 송라면</strong>
              <p>구매 완료 후 정확한 주소와 입실 안내를 확인할 수 있습니다.</p>
            </div>
          </div>
          <div className={styles.map} role="img" aria-label="포항 숙소 위치를 나타내는 지도 자리">
            <span>포항 숙소 위치</span>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="inquiry-title">
          <div className={styles.sectionHeading}>
            <h2 id="inquiry-title">상품 문의</h2>
            <span>2개</span>
          </div>

          <form className={styles.inquiryForm} onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="inquiry">문의 내용</label>
            <textarea
              id="inquiry"
              name="inquiry"
              maxLength={200}
              placeholder="숙박권에 대해 궁금한 내용을 작성해 주세요."
            />
            <button type="submit">문의하기</button>
          </form>

          <article className={styles.inquiry}>
            <div className={styles.inquiryMeta}>
              <strong>여행하는 고양이</strong>
              <time dateTime="2026-08-22">2026. 08. 22</time>
            </div>
            <p>주말에도 추가 비용 없이 사용할 수 있나요?</p>
            <div className={styles.reply}>
              <Image src="/icon/outline/reply.svg" alt="" width={20} height={20} />
              <div>
                <strong>판매자 답변</strong>
                <p>네, 사용 기한 안에는 주말에도 추가 비용 없이 이용할 수 있습니다.</p>
              </div>
            </div>
          </article>

          <article className={styles.inquiry}>
            <div className={styles.inquiryMeta}>
              <strong>바다좋아</strong>
              <time dateTime="2026-08-21">2026. 08. 21</time>
            </div>
            <p>반려동물 동반이 가능한가요?</p>
            <div className={styles.editReply}>
              <label htmlFor="reply">판매자 답변 수정</label>
              <input id="reply" defaultValue="소형견 한 마리까지 동반 가능합니다." />
              <button type="button">수정 완료</button>
            </div>
          </article>
        </section>
      </div>

      <dialog className={styles.dialog} ref={confirmDialog} aria-labelledby="confirm-title">
        <form method="dialog">
          <button className={styles.closeButton} type="submit" aria-label="구매 팝업 닫기">
            <Image src="/icon/outline/close.svg" alt="" width={24} height={24} />
          </button>
          <h2 id="confirm-title">숙박권을 구매하시겠어요?</h2>
          <p>구매 금액 32,900원이 보유 포인트에서 차감됩니다.</p>
          <div className={styles.dialogButtons}>
            <button type="submit">취소</button>
            <button type="button" onClick={showPointDialog}>구매하기</button>
          </div>
        </form>
      </dialog>

      <dialog className={styles.dialog} ref={pointDialog} aria-labelledby="point-title">
        <form method="dialog">
          <button className={styles.closeButton} type="submit" aria-label="포인트 팝업 닫기">
            <Image src="/icon/outline/close.svg" alt="" width={24} height={24} />
          </button>
          <h2 id="point-title">포인트가 부족해요</h2>
          <p>현재 보유 포인트는 12,500P입니다. 충전 후 다시 구매해 주세요.</p>
          <div className={styles.pointSummary}>
            <span>부족한 포인트</span>
            <strong>20,400P</strong>
          </div>
          <div className={styles.dialogButtons}>
            <button type="submit">다음에</button>
            <button type="submit">포인트 충전하기</button>
          </div>
        </form>
      </dialog>
    </main>
  );
}

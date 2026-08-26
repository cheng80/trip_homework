"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import type { MypageMember, MypagePointHistory, MypageProduct } from "@/types/mypage";
import { validatePasswordChange, type PasswordError } from "./password-validation";
import { getChargeAmount, getChargeError } from "./point-charge";
import styles from "./mypage.module.css";

type MypageProps = {
  member: MypageMember;
  transactions: MypageProduct[];
  bookmarks: MypageProduct[];
  pointHistory: MypagePointHistory[];
};

type Section = "overview" | "points" | "password";
type ProductTab = "transactions" | "bookmarks";
type ChargeStep = "select" | "confirm" | "complete";

const sections: { id: Section; label: string; icon: string }[] = [
  { id: "overview", label: "마이페이지", icon: "/icon/filled/mypage.svg" },
  { id: "points", label: "포인트 사용 내역", icon: "/icon/outline/point.svg" },
  { id: "password", label: "비밀번호 변경", icon: "/icon/outline/edit.svg" },
];

const sectionTitles: Record<Section, string> = {
  overview: "마이페이지",
  points: "포인트 사용 내역",
  password: "비밀번호 변경",
};

const pointPageSize = 4;
const chargeOptions = [10000, 30000, 50000, 100000];

function ProductList({ products, bookmarked }: { products: MypageProduct[]; bookmarked?: boolean }) {
  return (
    <ul className={styles.productList}>
      {products.map((product) => (
        <li className={styles.productItem} key={`${bookmarked ? "bookmark" : "trade"}-${product.id}`}>
          <Link className={styles.productImage} href={`/travelproducts/${product.id}`}>
            <Image
              src={product.image}
              alt={`${product.location} ${product.title}`}
              fill
              loading={product.id === products[0]?.id && !bookmarked ? "eager" : undefined}
              sizes="(max-width: 780px) 96px, 144px"
            />
          </Link>

          <div className={styles.productContent}>
            <div className={styles.productTop}>
              <span className={styles.productStatus}>
                {bookmarked ? "북마크" : product.status}
              </span>
              {bookmarked && (
                <Image src="/icon/filled/bookmark.svg" alt="" width={20} height={20} />
              )}
            </div>
            <Link href={`/travelproducts/${product.id}`}>
              <h3>{product.location}: {product.title}</h3>
            </Link>
            <p>{product.tags}</p>
            <div className={styles.productMeta}>
              <time dateTime={product.date.replaceAll(". ", "-").replace(".", "")}>{product.date}</time>
              <strong>{product.price}</strong>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Mypage({ member, transactions, bookmarks, pointHistory }: MypageProps) {
  const [section, setSection] = useState<Section>("overview");
  const [productTab, setProductTab] = useState<ProductTab>("transactions");
  const [pointPage, setPointPage] = useState(1);
  const [passwordError, setPasswordError] = useState<PasswordError>(null);
  const [passwordStatus, setPasswordStatus] = useState("");
  const [chargeStep, setChargeStep] = useState<ChargeStep>("select");
  const [chargeValue, setChargeValue] = useState("");
  const [chargeError, setChargeError] = useState("");
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const passwordCheckRef = useRef<HTMLInputElement>(null);
  const chargeDialogRef = useRef<HTMLDialogElement>(null);
  const chargeInputRef = useRef<HTMLInputElement>(null);

  const pageCount = Math.ceil(pointHistory.length / pointPageSize);
  const visiblePointHistory = pointHistory.slice(
    (pointPage - 1) * pointPageSize,
    pointPage * pointPageSize,
  );

  const changeSection = (nextSection: Section) => {
    setSection(nextSection);
    requestAnimationFrame(() => document.querySelector<HTMLElement>("#mypage-title")?.focus());
  };

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextError = validatePasswordChange(
      String(formData.get("currentPassword") ?? ""),
      String(formData.get("newPassword") ?? ""),
      String(formData.get("passwordCheck") ?? ""),
    );

    if (nextError) {
      setPasswordError(nextError);
      setPasswordStatus("");
      requestAnimationFrame(() => {
        (nextError.field === "newPassword" ? newPasswordRef : passwordCheckRef).current?.focus();
      });
      return;
    }

    setPasswordError(null);
    setPasswordStatus("비밀번호 변경 입력이 완료되었습니다.");
    form.reset();
  };

  const clearPasswordState = () => {
    setPasswordError(null);
    setPasswordStatus("");
  };

  const chargeAmount = getChargeAmount(chargeValue);

  const resetChargeDialog = () => {
    setChargeStep("select");
    setChargeValue("");
    setChargeError("");
  };

  const openChargeDialog = () => {
    resetChargeDialog();
    chargeDialogRef.current?.showModal();
  };

  const focusChargeTitle = () => {
    requestAnimationFrame(() => chargeDialogRef.current?.querySelector<HTMLElement>("h2")?.focus());
  };

  const handleChargeSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextError = getChargeError(chargeAmount);
    if (nextError) {
      setChargeError(nextError);
      requestAnimationFrame(() => chargeInputRef.current?.focus());
      return;
    }

    setChargeError("");
    setChargeStep("confirm");
    focusChargeTitle();
  };

  const completeCharge = () => {
    setChargeStep("complete");
    focusChargeTitle();
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <p className={styles.sidebarTitle}>마이 메뉴</p>
          <nav className={styles.menu} aria-label="마이페이지 메뉴">
            {sections.map((item) => (
              <button
                className={section === item.id ? styles.activeMenu : undefined}
                type="button"
                aria-pressed={section === item.id}
                onClick={() => changeSection(item.id)}
                key={item.id}
              >
                <Image src={item.icon} alt="" width={24} height={24} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className={styles.content}>
          <h1 id="mypage-title" tabIndex={-1}>{sectionTitles[section]}</h1>

          {section === "overview" && (
            <>
              <section className={styles.summary} aria-label="회원 정보와 보유 포인트">
                <article className={styles.profileCard}>
                  <Image src={member.profile} alt="" width={72} height={72} />
                  <div>
                    <span>안녕하세요</span>
                    <h2>{member.name}님</h2>
                    <p>{member.email}</p>
                  </div>
                </article>

                <article className={styles.pointCard}>
                  <span className={styles.pointIcon} aria-hidden="true">
                    <Image src="/icon/outline/point.svg" alt="" width={28} height={28} />
                  </span>
                  <div>
                    <span>보유 포인트</span>
                    <strong>{member.points.toLocaleString()} P</strong>
                  </div>
                  <div className={styles.pointActions}>
                    <button type="button" onClick={openChargeDialog}>충전하기</button>
                    <button type="button" onClick={() => changeSection("points")}>내역 보기</button>
                  </div>
                </article>
              </section>

              <section className={styles.historyPanel} aria-labelledby="product-history-title">
                <div className={styles.panelHeading}>
                  <div>
                    <h2 id="product-history-title">숙박권 보관함</h2>
                    <p>거래한 숙박권과 북마크한 숙소를 확인해 보세요.</p>
                  </div>
                  <div className={styles.productTabs} aria-label="숙박권 보기">
                    <button
                      type="button"
                      aria-pressed={productTab === "transactions"}
                      onClick={() => setProductTab("transactions")}
                    >
                      거래내역
                    </button>
                    <button
                      type="button"
                      aria-pressed={productTab === "bookmarks"}
                      onClick={() => setProductTab("bookmarks")}
                    >
                      북마크
                    </button>
                  </div>
                </div>

                {productTab === "transactions" ? (
                  <ProductList products={transactions} />
                ) : (
                  <ProductList products={bookmarks} bookmarked />
                )}
              </section>
            </>
          )}

          {section === "points" && (
            <section className={styles.pointPanel} aria-labelledby="point-list-title">
              <div className={styles.pointHeading}>
                <div>
                  <h2 id="point-list-title">충전·사용 내역</h2>
                  <p>보유 포인트 <strong>{member.points.toLocaleString()} P</strong></p>
                </div>
                <label>
                  조회 기간
                  <select defaultValue="3months">
                    <option value="1month">최근 1개월</option>
                    <option value="3months">최근 3개월</option>
                    <option value="6months">최근 6개월</option>
                  </select>
                </label>
              </div>

              <div className={styles.pointTableHeader} aria-hidden="true">
                <span>일자</span>
                <span>내용</span>
                <span>구분</span>
                <span>포인트</span>
              </div>
              <ul className={styles.pointList}>
                {visiblePointHistory.map((item) => (
                  <li key={item.id}>
                    <time dateTime={item.date.replaceAll(". ", "-").replace(".", "")}>{item.date}</time>
                    <strong>{item.description}</strong>
                    <span>{item.amount > 0 ? "충전" : "사용"}</span>
                    <b className={item.amount > 0 ? styles.charge : styles.use}>
                      {item.amount > 0 ? "+" : "-"}{Math.abs(item.amount).toLocaleString()} P
                    </b>
                  </li>
                ))}
              </ul>

              <nav className={styles.pagination} aria-label="포인트 내역 페이지">
                <button
                  type="button"
                  aria-label="이전 페이지"
                  disabled={pointPage === 1}
                  onClick={() => setPointPage((current) => current - 1)}
                >
                  <Image src="/icon/outline/left_arrow.svg" alt="" width={18} height={18} />
                </button>
                {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                  <button
                    className={pointPage === page ? styles.currentPage : undefined}
                    type="button"
                    aria-current={pointPage === page ? "page" : undefined}
                    onClick={() => setPointPage(page)}
                    key={page}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  aria-label="다음 페이지"
                  disabled={pointPage === pageCount}
                  onClick={() => setPointPage((current) => current + 1)}
                >
                  <Image src="/icon/outline/right_arrow.svg" alt="" width={18} height={18} />
                </button>
              </nav>
            </section>
          )}

          {section === "password" && (
            <section className={styles.passwordPanel} aria-labelledby="password-title">
              <div className={styles.passwordHeading}>
                <h2 id="password-title">비밀번호 변경</h2>
                <p>안전한 계정 사용을 위해 새로운 비밀번호를 입력해 주세요.</p>
              </div>

              <form className={styles.passwordForm} onSubmit={handlePasswordSubmit}>
                <label htmlFor="current-password">현재 비밀번호</label>
                <input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="current-password"
                  placeholder="현재 비밀번호를 입력해 주세요."
                  onChange={clearPasswordState}
                />

                <label htmlFor="new-password">새 비밀번호</label>
                <input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="8자 이상 입력해 주세요."
                  aria-invalid={passwordError?.field === "newPassword"}
                  aria-describedby={passwordError?.field === "newPassword" ? "password-error" : undefined}
                  onChange={clearPasswordState}
                  ref={newPasswordRef}
                />

                <label htmlFor="password-check">새 비밀번호 확인</label>
                <input
                  id="password-check"
                  name="passwordCheck"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="새 비밀번호를 한번 더 입력해 주세요."
                  aria-invalid={passwordError?.field === "passwordCheck"}
                  aria-describedby={passwordError?.field === "passwordCheck" ? "password-error" : undefined}
                  onChange={clearPasswordState}
                  ref={passwordCheckRef}
                />

                <p
                  className={`${styles.passwordMessage} ${passwordStatus ? styles.successMessage : ""}`}
                  id="password-error"
                  role="status"
                >
                  {passwordError?.message ?? passwordStatus}
                </p>
                <button type="submit">비밀번호 변경</button>
              </form>
            </section>
          )}
        </div>
      </div>

      <dialog
        className={styles.chargeDialog}
        ref={chargeDialogRef}
        aria-labelledby={`charge-${chargeStep}-title`}
        onClose={resetChargeDialog}
      >
        <button
          className={styles.chargeClose}
          type="button"
          aria-label="포인트 충전 팝업 닫기"
          onClick={() => chargeDialogRef.current?.close()}
        >
          <Image src="/icon/outline/close.svg" alt="" width={24} height={24} />
        </button>

        {chargeStep === "select" && (
          <form className={styles.chargeContent} onSubmit={handleChargeSubmit}>
            <div className={styles.chargeHeading}>
              <span className={styles.chargeIcon} aria-hidden="true">
                <Image src="/icon/filled/charge.svg" alt="" width={28} height={28} />
              </span>
              <h2 id="charge-select-title" tabIndex={-1}>포인트 충전</h2>
              <p>충전할 금액을 선택하거나 직접 입력해 주세요.</p>
            </div>

            <fieldset className={styles.chargeOptions}>
              <legend>충전 금액 선택</legend>
              {chargeOptions.map((amount) => (
                <button
                  type="button"
                  aria-pressed={chargeAmount === amount}
                  onClick={() => {
                    setChargeValue(String(amount));
                    setChargeError("");
                  }}
                  key={amount}
                >
                  +{amount.toLocaleString()} P
                </button>
              ))}
            </fieldset>

            <label className={styles.chargeInputLabel} htmlFor="charge-amount">
              직접 입력
              <span>
                <input
                  id="charge-amount"
                  name="chargeAmount"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={chargeValue ? Number(chargeValue).toLocaleString() : ""}
                  placeholder="1,000"
                  aria-invalid={Boolean(chargeError)}
                  aria-describedby="charge-error"
                  onChange={(event) => {
                    const amount = getChargeAmount(event.currentTarget.value);
                    setChargeValue(amount ? String(amount) : "");
                    setChargeError("");
                  }}
                  ref={chargeInputRef}
                />
                P
              </span>
            </label>
            <p className={styles.chargeMessage} id="charge-error" role="status">{chargeError}</p>

            <button className={styles.chargePrimary} type="submit">충전하기</button>
          </form>
        )}

        {chargeStep === "confirm" && (
          <div className={styles.chargeContent}>
            <div className={styles.chargeHeading}>
              <span className={styles.chargeIcon} aria-hidden="true">
                <Image src="/icon/filled/charge.svg" alt="" width={28} height={28} />
              </span>
              <h2 id="charge-confirm-title" tabIndex={-1}>포인트를 충전하시겠어요?</h2>
              <p>선택한 금액을 확인해 주세요.</p>
            </div>

            <dl className={styles.chargeSummary}>
              <div>
                <dt>충전 금액</dt>
                <dd>{chargeAmount.toLocaleString()} P</dd>
              </div>
              <div>
                <dt>충전 후 포인트</dt>
                <dd>{(member.points + chargeAmount).toLocaleString()} P</dd>
              </div>
            </dl>

            <div className={styles.chargeButtons}>
              <button type="button" onClick={() => {
                setChargeStep("select");
                requestAnimationFrame(() => chargeInputRef.current?.focus());
              }}>
                다시 선택
              </button>
              <button type="button" onClick={completeCharge}>충전하기</button>
            </div>
          </div>
        )}

        {chargeStep === "complete" && (
          <div className={styles.chargeContent}>
            <div className={styles.chargeHeading}>
              <span className={`${styles.chargeIcon} ${styles.completeIcon}`} aria-hidden="true">
                <Image src="/icon/filled/check.svg" alt="" width={28} height={28} />
              </span>
              <h2 id="charge-complete-title" tabIndex={-1}>포인트 충전 완료</h2>
              <p>{chargeAmount.toLocaleString()}P 충전이 완료되었습니다.</p>
            </div>

            <div className={styles.chargeResult}>
              <span>보유 포인트</span>
              <strong>{(member.points + chargeAmount).toLocaleString()} P</strong>
            </div>
            <button
              className={styles.chargePrimary}
              type="button"
              onClick={() => chargeDialogRef.current?.close()}
            >
              확인
            </button>
          </div>
        )}
      </dialog>
    </main>
  );
}

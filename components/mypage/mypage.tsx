/**
 * 역할: 회원 정보, 거래, 찜, 포인트와 비밀번호 변경을 통합한 마이페이지 클라이언트 화면입니다.
 * 처리 흐름: API 데이터와 더미 충전 내역을 결합하고 URL로 선택된 섹션에 따라 필요한 UI를 렌더링합니다.
 * 주의사항: 인증 오류는 로그인 이동으로 연결하고 일반 오류는 현재 섹션의 상태 메시지로 표시합니다.
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { isAuthenticationErrorMessage } from "@/app/api/graphql/auth-session";
import Dialog from "@/components/commons/dialog";
import { getMypage, resetPassword } from "@/services/account";
import type {
  MypageData,
  MypageMember,
  MypagePointHistory,
  MypageProduct,
  MypageSection,
} from "@/types/mypage";
import { validatePasswordChange, type PasswordError } from "./password-validation";
import {
  applyPointCharge,
  applyStoredPointCharges,
  getChargeAmount,
  getChargeError,
  getPointChargeStorageKey,
  parseStoredPointCharges,
} from "./point-charge";
import {
  filterPointHistoryByPeriod,
  type PointHistoryPeriod,
} from "./point-history";
import styles from "./mypage.module.css";

type MypageProps = {
  member: MypageMember;
  transactions: MypageProduct[];
  bookmarks: MypageProduct[];
  pointHistory: MypagePointHistory[];
  initialSection?: MypageSection;
  openChargeOnMount?: boolean;
};

type ProductTab = "transactions" | "bookmarks";
type ChargeStep = "select" | "confirm" | "complete";

const sections: { id: MypageSection; label: string; icon: string }[] = [
  { id: "overview", label: "마이페이지", icon: "/icon/filled/mypage.svg" },
  { id: "points", label: "포인트 사용 내역", icon: "/icon/outline/point.svg" },
  { id: "password", label: "비밀번호 변경", icon: "/icon/outline/edit.svg" },
];

const sectionTitles: Record<MypageSection, string> = {
  overview: "마이페이지",
  points: "포인트 사용 내역",
  password: "비밀번호 변경",
};

const pointPageSize = 4;
const chargeOptions = [10000, 30000, 50000, 100000];

/** 거래·찜 목록이 비었을 때의 안내와 상품 카드 반복 구조를 공유합니다. */
function ProductList({ products, bookmarked }: { products: MypageProduct[]; bookmarked?: boolean }) {
  if (products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <strong>{bookmarked ? "찜한 숙박권이 없습니다." : "거래한 숙박권이 없습니다."}</strong>
        <p>
          {bookmarked
            ? "관심 있는 숙박권을 찜하면 여기에 표시됩니다."
            : "숙박권을 구매하거나 판매하면 여기에 표시됩니다."}
        </p>
        <Link href="/travelproducts">숙박권 둘러보기</Link>
      </div>
    );
  }

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

export default function Mypage({
  member,
  transactions,
  bookmarks,
  pointHistory,
  initialSection = "overview",
  openChargeOnMount = false,
}: MypageProps) {
  const router = useRouter();
  const [data, setData] = useState<MypageData>({ member, transactions, bookmarks, pointHistory });
  const [dataError, setDataError] = useState("");
  const [section, setSection] = useState<MypageSection>(initialSection);
  const [productTab, setProductTab] = useState<ProductTab>("transactions");
  const [pointPage, setPointPage] = useState(1);
  const [pointPeriod, setPointPeriod] = useState<PointHistoryPeriod>(3);
  const [passwordError, setPasswordError] = useState<PasswordError>(null);
  const [passwordStatus, setPasswordStatus] = useState("");
  const [passwordRequestError, setPasswordRequestError] = useState("");
  const [passwordPending, setPasswordPending] = useState(false);
  const [chargeStep, setChargeStep] = useState<ChargeStep>("select");
  const [chargeValue, setChargeValue] = useState("");
  const [chargeError, setChargeError] = useState("");
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const passwordCheckRef = useRef<HTMLInputElement>(null);
  const chargeDialogRef = useRef<HTMLDialogElement>(null);
  const chargeInputRef = useRef<HTMLInputElement>(null);
  const {
    member: currentMember,
    transactions: currentTransactions,
    bookmarks: currentBookmarks,
    pointHistory: currentPointHistory,
  } = data;

  /**
   * 서버에서 최신 마이페이지 데이터를 다시 읽고 사용자별 로컬 충전 내역을 합산합니다.
   * 인증 만료는 로그인 이동으로 처리하고 그 외 실패는 정적 초기 데이터와 오류 문구를 유지합니다.
   */
  useEffect(() => {
    getMypage().then((nextData) => {
      let storedCharges = parseStoredPointCharges(null);
      try {
        storedCharges = parseStoredPointCharges(
          localStorage.getItem(getPointChargeStorageKey(nextData.member.id)),
        );
      } catch {
        // 브라우저 저장소가 차단된 경우 서버 포인트만 표시한다.
      }
      setData(applyStoredPointCharges(nextData, storedCharges));
      setDataError("");
    }).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "마이페이지 정보를 불러오지 못했습니다.";
      if (isAuthenticationErrorMessage(message)) {
        router.replace("/login");
        return;
      }
      setDataError(message.split("\n")[0]);
    });
  }, [router]);

  // 포인트 충전 링크로 진입한 경우 최초 마운트 직후 대화상자를 자동으로 엽니다.
  useEffect(() => {
    if (!openChargeOnMount || chargeDialogRef.current?.open) return;
    chargeDialogRef.current?.showModal();
  }, [openChargeOnMount]);

  const filteredPointHistory = filterPointHistoryByPeriod(currentPointHistory, pointPeriod);
  const pageCount = Math.max(1, Math.ceil(filteredPointHistory.length / pointPageSize));
  const visiblePointHistory = filteredPointHistory.slice(
    (pointPage - 1) * pointPageSize,
    pointPage * pointPageSize,
  );

  const changeSection = (nextSection: MypageSection) => {
    setSection(nextSection);
    requestAnimationFrame(() => document.querySelector<HTMLElement>("#mypage-title")?.focus());
  };

  /** 비밀번호 형식을 먼저 검증하고 성공 시 API 요청·폼 초기화·사용자 피드백을 한 흐름으로 처리합니다. */
  const handlePasswordSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
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
      setPasswordRequestError("");
      requestAnimationFrame(() => {
        (nextError.field === "newPassword" ? newPasswordRef : passwordCheckRef).current?.focus();
      });
      return;
    }

    setPasswordPending(true);
    setPasswordError(null);
    setPasswordRequestError("");
    try {
      await resetPassword(String(formData.get("newPassword") ?? ""));
      setPasswordStatus("비밀번호가 변경되었습니다.");
      form.reset();
      window.alert("비밀번호가 변경되었습니다.");
    } catch (error) {
      setPasswordStatus("");
      setPasswordRequestError(error instanceof Error ? error.message.split("\n")[0] : "비밀번호를 변경하지 못했습니다.");
    } finally {
      setPasswordPending(false);
    }
  };

  const clearPasswordState = () => {
    setPasswordError(null);
    setPasswordStatus("");
    setPasswordRequestError("");
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

  /** 선택·직접 입력한 충전 금액을 검증한 뒤 실제 반영 전 확인 단계로 이동합니다. */
  const handleChargeSubmit = (event: SubmitEvent<HTMLFormElement>) => {
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

  /**
   * 더미 충전 내역을 사용자별 localStorage에 영구 저장하고 현재 화면 데이터에도 즉시 반영합니다.
   * 저장 실패 시 메모리 값도 바꾸지 않아 새로고침 전후 포인트가 불일치하지 않게 합니다.
   */
  const completeCharge = () => {
    const date = new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date()).replace(/\.$/, "");

    const charge = { id: `local-charge-${Date.now()}`, date, amount: chargeAmount };
    const storageKey = getPointChargeStorageKey(currentMember.id);

    try {
      const storedCharges = parseStoredPointCharges(localStorage.getItem(storageKey));
      localStorage.setItem(storageKey, JSON.stringify([...storedCharges, charge]));
    } catch {
      setChargeError("더미 포인트를 저장하지 못했습니다. 브라우저 저장소를 확인해 주세요.");
      setChargeStep("select");
      focusChargeTitle();
      return;
    }

    setData((current) => applyPointCharge(current, charge.amount, charge.id, charge.date));
    setPointPage(1);
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
          {dataError && <p className={styles.dataError} role="alert">{dataError}</p>}

          {section === "overview" && (
            <>
              <section className={styles.summary} aria-label="회원 정보와 보유 포인트">
                <article className={styles.profileCard}>
                  <Image src={currentMember.profile} alt="" width={72} height={72} />
                  <div>
                    <span>안녕하세요</span>
                    <h2>{currentMember.name}님</h2>
                    <p>{currentMember.email}</p>
                  </div>
                </article>

                <article className={styles.pointCard}>
                  <span className={styles.pointIcon} aria-hidden="true">
                    <Image src="/icon/outline/point.svg" alt="" width={28} height={28} />
                  </span>
                  <div>
                    <span>보유 포인트</span>
                    <strong>{currentMember.points.toLocaleString()} P</strong>
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
                  <ProductList products={currentTransactions} />
                ) : (
                  <ProductList products={currentBookmarks} bookmarked />
                )}
              </section>
            </>
          )}

          {section === "points" && (
            <section className={styles.pointPanel} aria-labelledby="point-list-title">
              <div className={styles.pointHeading}>
                <div>
                  <h2 id="point-list-title">충전·사용 내역</h2>
                  <p>보유 포인트 <strong>{currentMember.points.toLocaleString()} P</strong></p>
                </div>
                <label>
                  조회 기간
                  <select
                    value={pointPeriod}
                    onChange={(event) => {
                      setPointPeriod(Number(event.currentTarget.value) as PointHistoryPeriod);
                      setPointPage(1);
                    }}
                  >
                    <option value={1}>최근 1개월</option>
                    <option value={3}>최근 3개월</option>
                    <option value={6}>최근 6개월</option>
                  </select>
                </label>
              </div>

              <div className={styles.pointTableHeader} aria-hidden="true">
                <span>일자</span>
                <span>내용</span>
                <span>구분</span>
                <span>포인트</span>
              </div>
              {visiblePointHistory.length > 0 ? (
                <>
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
                </>
              ) : (
                <div className={styles.emptyState}>
                  <strong>선택한 기간의 포인트 내역이 없습니다.</strong>
                  <p>조회 기간을 늘리거나 포인트를 충전해 보세요.</p>
                  <button type="button" onClick={openChargeDialog}>포인트 충전하기</button>
                </div>
              )}
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
                  {passwordError?.message ?? passwordRequestError ?? passwordStatus}
                </p>
                <button type="submit" disabled={passwordPending}>
                  {passwordPending ? "변경 중..." : "비밀번호 변경"}
                </button>
              </form>
            </section>
          )}
        </div>
      </div>

      <Dialog
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
                <dd>{(currentMember.points + chargeAmount).toLocaleString()} P</dd>
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
              <strong>{currentMember.points.toLocaleString()} P</strong>
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
      </Dialog>
    </main>
  );
}

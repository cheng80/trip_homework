"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import styles from "./auth-form.module.css";

type AuthFormProps = {
  mode: "login" | "signup";
};

type AuthField = "email" | "name" | "password" | "passwordCheck";
type AuthErrors = Partial<Record<AuthField, string>>;

const LOGIN_ERROR = "아이디 또는 비밀번호를 확인해 주세요.";

function getInput(form: HTMLFormElement, name: AuthField) {
  return form.elements.namedItem(name) as HTMLInputElement;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const isLogin = mode === "login";
  const successDialog = useRef<HTMLDialogElement>(null);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [status, setStatus] = useState("");

  const updateField = (field: AuthField, isValid: boolean) => {
    setStatus("");
    if (!isValid) return;

    setErrors((current) => {
      if (!current[field]) return current;

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const email = getInput(form, "email");
    const password = getInput(form, "password");
    const nextErrors: AuthErrors = {};

    if (!email.value) {
      nextErrors.email = isLogin ? LOGIN_ERROR : "이메일을 입력해 주세요.";
    } else if (!email.validity.valid) {
      nextErrors.email = isLogin ? LOGIN_ERROR : "이메일 형식으로 입력해 주세요.";
    }

    if (!isLogin) {
      const name = getInput(form, "name");
      if (!name.value.trim()) nextErrors.name = "이름을 입력해 주세요.";
    }

    if (!password.value) {
      nextErrors.password = isLogin ? LOGIN_ERROR : "비밀번호를 입력해 주세요.";
    }

    if (!isLogin) {
      const passwordCheck = getInput(form, "passwordCheck");

      if (!passwordCheck.value) {
        nextErrors.passwordCheck = "비밀번호를 한번 더 입력해 주세요.";
      } else if (password.value !== passwordCheck.value) {
        nextErrors.passwordCheck = "비밀번호가 서로 달라요.";
      }
    }

    setErrors(nextErrors);
    setStatus("");

    const firstError = (Object.keys(nextErrors) as AuthField[])[0];
    if (firstError) {
      const firstInput = getInput(form, firstError);
      requestAnimationFrame(() => firstInput.focus());
      return;
    }

    if (isLogin) {
      setStatus("로그인 입력이 완료되었습니다.");
      return;
    }

    successDialog.current?.showModal();
  };

  const loginError = errors.email ?? errors.password;

  return (
    <main className={styles.page}>
      <section className={styles.formSide}>
        <header className={styles.mobileHeader}>
          <span>로그인</span>
          <Link href="/" aria-label="로그인 화면 닫기">
            <Image src="/icon/outline/close.svg" alt="" width={24} height={24} />
          </Link>
        </header>

        <div className={`${styles.formBox} ${isLogin ? styles.loginBox : ""}`}>
          {isLogin && (
            <Link className={styles.logo} href="/" aria-label="트립트립 홈">
              <Image src="/logo/logo.svg" alt="" width={164} height={112} />
            </Link>
          )}

          <h1>{isLogin ? "트립트립에 오신걸 환영합니다." : "회원가입"}</h1>
          <p className={styles.description}>
            {isLogin
              ? "트립트립에 로그인 하세요."
              : "회원가입을 위해 아래 빈칸을 모두 채워 주세요."}
          </p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={isLogin ? styles.loginField : styles.signupField}>
              <label className={isLogin ? styles.visuallyHidden : undefined} htmlFor="email">
                이메일 {!isLogin && <span aria-hidden="true">*</span>}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="이메일을 입력해 주세요."
                aria-invalid={Boolean(errors.email)}
                aria-describedby={isLogin && loginError ? "login-error" : errors.email ? "email-error" : undefined}
                onChange={(event) => updateField("email", Boolean(event.currentTarget.value) && event.currentTarget.validity.valid)}
              />
              {!isLogin && errors.email && (
                <p className={styles.fieldError} id="email-error">{errors.email}</p>
              )}
            </div>

            {!isLogin && (
              <div className={styles.signupField}>
                <label htmlFor="name">이름 <span aria-hidden="true">*</span></label>
                <input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="이름을 입력해 주세요."
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  onChange={(event) => updateField("name", Boolean(event.currentTarget.value.trim()))}
                />
                {errors.name && <p className={styles.fieldError} id="name-error">{errors.name}</p>}
              </div>
            )}

            <div className={isLogin ? styles.loginField : styles.signupField}>
              <label className={isLogin ? styles.visuallyHidden : undefined} htmlFor="password">
                비밀번호 {!isLogin && <span aria-hidden="true">*</span>}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder="비밀번호를 입력해 주세요."
                aria-invalid={Boolean(errors.password)}
                aria-describedby={isLogin && loginError ? "login-error" : errors.password ? "password-error" : undefined}
                onChange={(event) => updateField("password", Boolean(event.currentTarget.value))}
              />
              {!isLogin && errors.password && (
                <p className={styles.fieldError} id="password-error">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div className={styles.signupField}>
                <label htmlFor="passwordCheck">비밀번호 확인 <span aria-hidden="true">*</span></label>
                <input
                  id="passwordCheck"
                  name="passwordCheck"
                  type="password"
                  required
                  autoComplete="new-password"
                  placeholder="비밀번호를 한번 더 입력해 주세요."
                  aria-invalid={Boolean(errors.passwordCheck)}
                  aria-describedby={errors.passwordCheck ? "password-check-error" : undefined}
                  onChange={(event) => {
                    const passwordInput = event.currentTarget.form?.elements.namedItem("password") as HTMLInputElement;
                    updateField(
                      "passwordCheck",
                      Boolean(event.currentTarget.value) && event.currentTarget.value === passwordInput.value,
                    );
                  }}
                />
                {errors.passwordCheck && (
                  <p className={styles.fieldError} id="password-check-error">{errors.passwordCheck}</p>
                )}
              </div>
            )}

            {isLogin && (
              <p
                className={`${styles.loginMessage} ${loginError ? styles.errorMessage : styles.successMessage}`}
                id="login-error"
                aria-live="polite"
              >
                {loginError ?? status}
              </p>
            )}

            <button className={styles.submitButton} type="submit">
              {isLogin ? "로그인" : "회원가입"}
            </button>
          </form>

          {isLogin && <Link className={styles.moveLink} href="/signup">회원가입</Link>}
        </div>
      </section>

      <div className={styles.picture} aria-hidden="true">
        <Image
          src="/images/로그인 화면 이미지/login.png"
          alt=""
          fill
          sizes="(max-width: 780px) 100vw, calc(100vw - 400px)"
          preload
        />
      </div>

      {!isLogin && (
        <dialog className={styles.successDialog} ref={successDialog} aria-labelledby="signup-success-title">
          <h2 id="signup-success-title">회원가입을 축하 드려요.</h2>
          <span className={styles.dialogLogo} aria-hidden="true">
            <Image src="/logo/logo.svg" alt="" width={164} height={112} />
          </span>
          <Link href="/login">로그인 하기</Link>
        </dialog>
      )}
    </main>
  );
}

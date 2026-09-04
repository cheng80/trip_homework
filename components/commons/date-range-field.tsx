/**
 * 역할: 날짜 검색 필드와 범위 선택 달력 팝업을 공통으로 제공합니다.
 * 처리 흐름: 달력 아이콘으로 팝업을 열고 시작일·종료일을 선택한 뒤 숨은 필드로 제출합니다.
 * 주의사항: 텍스트 직접 입력 대신 달력에서만 날짜를 고르며 Escape와 바깥 클릭으로 닫습니다.
 */
"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import {
  dateRangeState,
  formatDateAria,
  formatDateRange,
  monthCells,
  selectRangeDate,
  shiftMonth,
  toIsoDate,
} from "@/domain/date-range";
import styles from "./date-range-field.module.css";

const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

type DateRangeFieldProps = {
  className?: string;
  label: string;
  startName: string;
  endName: string;
  startDate?: string;
  endDate?: string;
  placeholder?: string;
  tone?: "light" | "board";
};

export default function DateRangeField({
  className,
  label,
  startName,
  endName,
  startDate = "",
  endDate = "",
  placeholder = "YYYY. MM. DD - YYYY. MM. DD",
  tone = "light",
}: DateRangeFieldProps) {
  const labelId = useId();
  const dialogId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);
  const today = toIsoDate(new Date());
  const initialMonth = startDate || today;
  const [view, setView] = useState({
    year: Number(initialMonth.slice(0, 4)),
    month: Number(initialMonth.slice(5, 7)),
  });

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      setOpen(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        requestAnimationFrame(() => triggerRef.current?.focus());
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    const focusTarget = popoverRef.current?.querySelector<HTMLButtonElement>(
      '[aria-selected="true"], [aria-current="date"], [role="gridcell"]',
    );
    focusTarget?.focus();
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const display = formatDateRange(start, end);
  const cells = monthCells(view.year, view.month);
  const dates = cells.filter((iso): iso is string => iso != null);
  const focusIso = dates.includes(start) ? start : dates.includes(today) ? today : dates[0] ?? "";

  return (
    <div className={`${styles.field} ${className ?? ""}`}>
      <button
        ref={triggerRef}
        className={`${styles.trigger} ${tone === "board" ? styles.boardTrigger : ""}`}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        aria-labelledby={labelId}
        onClick={() => {
          if (open) {
            close();
            return;
          }
          const monthSource = start || today;
          setView({
            year: Number(monthSource.slice(0, 4)),
            month: Number(monthSource.slice(5, 7)),
          });
          setOpen(true);
        }}
      >
        <Image src="/icon/outline/calendar.svg" alt="" width={20} height={20} />
        <span className={styles.srOnly} id={labelId}>{label}</span>
        <span className={display ? styles.value : styles.placeholder}>
          {display || placeholder}
        </span>
      </button>

      <input type="hidden" name={startName} value={start} />
      <input type="hidden" name={endName} value={end} />

      {open ? (
        <div
          ref={popoverRef}
          className={styles.popover}
          id={dialogId}
          role="dialog"
          aria-modal="false"
          aria-label="날짜 선택"
        >
          <div className={styles.monthNav}>
            <button
              type="button"
              aria-label="이전 달"
              onClick={() => setView((current) => shiftMonth(current.year, current.month, -1))}
            >
              <Image src="/icon/outline/left_arrow.svg" alt="" width={18} height={18} />
            </button>
            <strong>{view.year}. {String(view.month).padStart(2, "0")}</strong>
            <button
              type="button"
              aria-label="다음 달"
              onClick={() => setView((current) => shiftMonth(current.year, current.month, 1))}
            >
              <Image src="/icon/outline/right_arrow.svg" alt="" width={18} height={18} />
            </button>
          </div>

          <div className={styles.weekdays} aria-hidden="true">
            {weekdays.map((day) => <span key={day}>{day}</span>)}
          </div>

          <div
            className={styles.grid}
            role="grid"
            aria-label={`${view.year}년 ${view.month}월`}
            onKeyDown={(event) => {
              const keys: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
              const delta = keys[event.key];
              if (delta == null) return;
              event.preventDefault();
              const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("[role=gridcell]")];
              const index = buttons.indexOf(event.target as HTMLButtonElement);
              buttons.at(Math.max(0, Math.min(buttons.length - 1, index + delta)))?.focus();
            }}
          >
            {cells.map((iso, index) => {
              if (!iso) return <span className={styles.empty} key={`empty-${index}`} />;

              const state = dateRangeState(iso, start, end);
              const selected = state === "start" || state === "end" || state === "single";
              return (
                <button
                  className={`${styles.day} ${state ? styles[state] : ""}`}
                  type="button"
                  role="gridcell"
                  tabIndex={iso === focusIso ? 0 : -1}
                  aria-selected={selected}
                  aria-current={iso === today ? "date" : undefined}
                  aria-label={formatDateAria(iso)}
                  onClick={() => {
                    const next = selectRangeDate({ start, end }, iso);
                    setStart(next.start);
                    setEnd(next.end);
                    if (next.end) close();
                  }}
                  key={iso}
                >
                  {Number(iso.slice(8))}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

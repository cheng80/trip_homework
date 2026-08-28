/**
 * 역할: 포인트 충전 등 간단한 작업에 사용하는 공통 모달 대화상자입니다.
 * 처리 흐름: 열림 상태일 때만 렌더링하고 배경 클릭과 닫기 버튼 이벤트를 호출부로 전달합니다.
 * 주의사항: 제목 연결과 modal 속성을 제공해 보조 기술이 대화상자로 인식하게 합니다.
 */
import type { ComponentPropsWithoutRef, Ref } from "react";
import styles from "./dialog.module.css";

type DialogProps = ComponentPropsWithoutRef<"dialog"> & {
  ref?: Ref<HTMLDialogElement>;
};

export default function Dialog({ className, ...props }: DialogProps) {
  return <dialog className={`${styles.dialog} ${className ?? ""}`} {...props} />;
}

/**
 * 역할: 숙박권 문의와 답변의 권한·편집·mutation 상태를 관리하는 클라이언트 훅입니다.
 * 처리 흐름: 현재 사용자와 답변 목록을 보강한 뒤 질문자와 판매자 동작을 구분합니다.
 * 주의사항: 각 저장·삭제 결과를 로컬 문의 배열에 반영해 전체 페이지 재조회 없이 UI를 갱신합니다.
 */
"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import { getLoggedInUser } from "@/services/account";
import { useAuthStore } from "@/stores/auth-store";
import {
  createTravelproductQuestion,
  createTravelproductQuestionAnswer,
  deleteTravelproductQuestion,
  deleteTravelproductQuestionAnswer,
  getTravelproductQuestionAnswers,
  updateTravelproductQuestion,
  updateTravelproductQuestionAnswer,
} from "@/services/travel-products";
import type { TravelInquiry } from "@/types/travel-products";

export function useProductInquiries(
  productId: string,
  sellerId: string | undefined,
  initialInquiries: TravelInquiry[],
) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [currentUserId, setCurrentUserId] = useState("");
  const [contents, setContents] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editingQuestionContents, setEditingQuestionContents] = useState("");
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerContents, setAnswerContents] = useState("");
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [editingAnswerContents, setEditingAnswerContents] = useState("");
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const accessToken = useAuthStore((store) => store.accessToken);
  const isAuthReady = useAuthStore((store) => store.isAuthReady);

  // 최초 문의에는 답변이 포함되지 않으므로 현재 사용자와 질문별 답변을 병렬로 보강합니다.
  useEffect(() => {
    if (isAuthReady && accessToken) {
      getLoggedInUser().then((user) => setCurrentUserId(user.id)).catch(() => undefined);
    }
    Promise.all(initialInquiries.map(async (inquiry) => ({
      inquiryId: inquiry.id,
      answer: (await getTravelproductQuestionAnswers(inquiry.id).catch(() => []))[0],
    }))).then((answers) => {
      setInquiries((current) => current.map((inquiry) => ({
        ...inquiry,
        answer: answers.find((item) => item.inquiryId === inquiry.id)?.answer,
      })));
    });
  }, [accessToken, initialInquiries, isAuthReady]);

  const message = (error: unknown, fallback: string) => (
    error instanceof Error ? error.message.split("\n")[0] : fallback
  );

  /** 새 문의를 등록하고 서버가 확정한 작성자 정보를 포함한 항목을 목록 맨 앞에 추가합니다. */
  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = contents.trim();
    if (!question) return;
    setPending(true);
    setStatus("");
    try {
      const created = await createTravelproductQuestion(productId, question);
      setInquiries((current) => [created, ...current]);
      setContents("");
    } catch (error) {
      setStatus(message(error, "문의를 등록하지 못했습니다."));
    } finally {
      setPending(false);
    }
  };

  const startQuestionEdit = (inquiry: TravelInquiry) => {
    setEditingQuestionId(inquiry.id);
    setEditingQuestionContents(inquiry.question);
  };

  /** 질문 수정 결과의 본문과 작성자 정보를 기존 항목에 병합합니다. */
  const saveQuestion = async (questionId: string) => {
    const question = editingQuestionContents.trim();
    if (!question) return;
    setStatus("");
    try {
      const updated = await updateTravelproductQuestion(questionId, question);
      setInquiries((current) => current.map((inquiry) => (
        inquiry.id === questionId ? { ...inquiry, ...updated } : inquiry
      )));
      setEditingQuestionId(null);
    } catch (error) {
      setStatus(message(error, "문의를 수정하지 못했습니다."));
    }
  };

  /** 질문 삭제 성공 시 연결된 답변을 포함한 문의 항목 전체를 화면에서 제거합니다. */
  const deleteQuestion = async (questionId: string) => {
    if (!window.confirm("문의를 삭제할까요? 삭제한 문의는 복구할 수 없습니다.")) return;
    setStatus("");
    try {
      await deleteTravelproductQuestion(questionId);
      setInquiries((current) => current.filter((inquiry) => inquiry.id !== questionId));
    } catch (error) {
      setStatus(message(error, "문의를 삭제하지 못했습니다."));
    }
  };

  /** 판매자 답변을 생성해 해당 문의의 단일 answer 슬롯에 연결합니다. */
  const saveAnswer = async (questionId: string) => {
    const answer = answerContents.trim();
    if (!answer) return;
    setStatus("");
    try {
      const created = await createTravelproductQuestionAnswer(questionId, answer);
      setInquiries((current) => current.map((inquiry) => (
        inquiry.id === questionId ? { ...inquiry, answer: created } : inquiry
      )));
      setAnsweringId(null);
      setAnswerContents("");
    } catch (error) {
      setStatus(message(error, "답변을 등록하지 못했습니다."));
    }
  };

  /** 답변 수정 결과만 교체해 질문 정보와 목록 순서는 그대로 유지합니다. */
  const updateAnswer = async (questionId: string, answerId: string) => {
    const answer = editingAnswerContents.trim();
    if (!answer) return;
    setStatus("");
    try {
      const updated = await updateTravelproductQuestionAnswer(answerId, answer);
      setInquiries((current) => current.map((inquiry) => (
        inquiry.id === questionId ? { ...inquiry, answer: updated } : inquiry
      )));
      setEditingAnswerId(null);
    } catch (error) {
      setStatus(message(error, "답변을 수정하지 못했습니다."));
    }
  };

  /** 답변 삭제 성공 시 문의는 남기고 answer 값만 제거합니다. */
  const deleteAnswer = async (questionId: string, answerId: string) => {
    if (!window.confirm("답변을 삭제할까요? 삭제한 답변은 복구할 수 없습니다.")) return;
    setStatus("");
    try {
      await deleteTravelproductQuestionAnswer(answerId);
      setInquiries((current) => current.map((inquiry) => (
        inquiry.id === questionId ? { ...inquiry, answer: undefined } : inquiry
      )));
    } catch (error) {
      setStatus(message(error, "답변을 삭제하지 못했습니다."));
    }
  };

  return {
    inquiries,
    currentUserId,
    isSeller: Boolean(currentUserId && currentUserId === sellerId),
    contents,
    setContents,
    status,
    pending,
    handleSubmit,
    editingQuestionId,
    editingQuestionContents,
    setEditingQuestionContents,
    startQuestionEdit,
    saveQuestion,
    deleteQuestion,
    answeringId,
    answerContents,
    setAnswerContents,
    startAnswer: (questionId: string) => {
      setAnsweringId(questionId);
      setAnswerContents("");
    },
    saveAnswer,
    editingAnswerId,
    editingAnswerContents,
    setEditingAnswerContents,
    startAnswerEdit: (inquiry: TravelInquiry) => {
      if (!inquiry.answer) return;
      setEditingAnswerId(inquiry.answer.id);
      setEditingAnswerContents(inquiry.answer.contents);
    },
    updateAnswer,
    deleteAnswer,
  };
}

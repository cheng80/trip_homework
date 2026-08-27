"use client";

import { useEffect, useState, type FormEvent } from "react";
import { getLoggedInUser } from "@/services/account";
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

  useEffect(() => {
    getLoggedInUser().then((user) => setCurrentUserId(user.id)).catch(() => undefined);
    Promise.all(initialInquiries.map(async (inquiry) => ({
      inquiryId: inquiry.id,
      answer: (await getTravelproductQuestionAnswers(inquiry.id).catch(() => []))[0],
    }))).then((answers) => {
      setInquiries((current) => current.map((inquiry) => ({
        ...inquiry,
        answer: answers.find((item) => item.inquiryId === inquiry.id)?.answer,
      })));
    });
  }, [initialInquiries]);

  const message = (error: unknown, fallback: string) => (
    error instanceof Error ? error.message.split("\n")[0] : fallback
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

import { randomUUID } from "node:crypto";
import { QUESTION_CATEGORIES, QUESTION_LIMITS } from "./limits";
import { readJsonArray, updateJsonArray } from "./json-store";

export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number];

export type QuestionInput = {
  question: string;
  answer: string;
  category: QuestionCategory;
};

export type QuestionErrors = Partial<
  Record<"question" | "answer" | "category", string>
>;

export type QuestionValidationResult =
  | { ok: true; values: QuestionInput }
  | { ok: false; errors: QuestionErrors };

export type StoredQuestion = QuestionInput & {
  id: string;
  createdAt: string;
};

const dataFile = "questions.json";

export function validateQuestion(input: unknown): QuestionValidationResult {
  const errors: QuestionErrors = {};
  const { question, answer, category } = (input ??
    {}) as Record<string, unknown>;

  const questionValue = typeof question === "string" ? question.trim() : "";
  const answerValue = typeof answer === "string" ? answer.trim() : "";
  const categoryValue = typeof category === "string" ? category.trim() : "";

  if (!questionValue) {
    errors.question = "Question can't be blank.";
  }
  if (!answerValue) {
    errors.answer = "Answer can't be blank.";
  }
  if (!QUESTION_CATEGORIES.includes(categoryValue as QuestionCategory)) {
    errors.category =
      "Category must be one of: Background, Work, Skills, Personal.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    values: {
      question: questionValue.slice(0, QUESTION_LIMITS.question),
      answer: answerValue.slice(0, QUESTION_LIMITS.answer),
      category: categoryValue as QuestionCategory,
    },
  };
}

export function createQuestion(values: QuestionInput): StoredQuestion {
  return {
    id: randomUUID(),
    ...values,
    createdAt: new Date().toISOString(),
  };
}

export function readQuestions(): Promise<StoredQuestion[]> {
  return readJsonArray<StoredQuestion>(dataFile);
}

export async function getQuestionsNewestFirst(): Promise<StoredQuestion[]> {
  const questions = await readQuestions();
  return questions
    .map((question, index) => ({ question, index }))
    .sort((a, b) => {
      if (a.question.createdAt === b.question.createdAt) {
        return b.index - a.index;
      }
      return a.question.createdAt < b.question.createdAt ? 1 : -1;
    })
    .map((entry) => entry.question);
}

export async function getQuestionById(
  id: string
): Promise<StoredQuestion | undefined> {
  const questions = await readQuestions();
  return questions.find((question) => question.id === id);
}

export async function saveQuestion(question: StoredQuestion): Promise<void> {
  await updateJsonArray<StoredQuestion>(dataFile, (questions) => [
    ...questions,
    question,
  ]);
}

export async function updateQuestion(
  id: string,
  values: QuestionInput
): Promise<StoredQuestion | undefined> {
  let updated: StoredQuestion | undefined;
  await updateJsonArray<StoredQuestion>(dataFile, (questions) =>
    questions.map((question) => {
      if (question.id !== id) {
        return question;
      }
      updated = {
        ...question,
        question: values.question,
        answer: values.answer,
        category: values.category,
      };
      return updated;
    })
  );
  return updated;
}

export async function deleteQuestion(
  id: string
): Promise<StoredQuestion | undefined> {
  let deleted: StoredQuestion | undefined;
  await updateJsonArray<StoredQuestion>(dataFile, (questions) => {
    const target = questions.find((question) => question.id === id);
    if (!target) {
      return questions;
    }
    deleted = target;
    return questions.filter((question) => question.id !== id);
  });
  return deleted;
}

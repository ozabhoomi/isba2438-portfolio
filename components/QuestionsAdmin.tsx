"use client";

import { useEffect, useState } from "react";
import { QUESTION_CATEGORIES, QUESTION_LIMITS } from "@/lib/limits";
import { getCategoryColors } from "@/lib/category-styles";
import type { QuestionErrors, StoredQuestion } from "@/lib/questions";
import FormField, {
  errorClass,
  sectionHeadingClass,
  submitButtonClass,
  successClass,
} from "./FormUI";
import { sendJson, submitJson } from "@/lib/submit-json";

const actionButtonClass =
  "rounded-full border border-aubergine/25 px-4 py-1.5 text-sm font-medium transition-colors hover:border-aubergine hover:bg-blush";
const deleteButtonClass =
  "rounded-full border border-red-600/30 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:border-red-600 hover:bg-red-50";
const cancelButtonClass =
  "rounded-full border border-aubergine/25 px-5 py-3 text-base font-medium transition-colors hover:border-aubergine hover:bg-blush disabled:opacity-50";

export default function QuestionsAdmin() {
  const [questions, setQuestions] = useState<StoredQuestion[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [errors, setErrors] = useState<QuestionErrors>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [editing, setEditing] = useState<StoredQuestion | null>(null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/questions")
      .then((res) => {
        if (!res.ok) throw new Error("list request failed");
        return res.json() as Promise<{ questions?: StoredQuestion[] }>;
      })
      .then((body) => {
        if (cancelled) return;
        setQuestions(body.questions ?? []);
        setListError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setListError("Couldn't load questions. Please refresh the page.");
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  function startEdit(question: StoredQuestion) {
    setEditing(question);
    setErrors({});
    setSuccess(null);
    setRequestError(null);
    setFormKey((key) => key + 1);
  }

  function exitEditMode() {
    setEditing(null);
    setFormKey((key) => key + 1);
  }

  function cancelEdit() {
    setEditing(null);
    setErrors({});
    setSuccess(null);
    setRequestError(null);
    setFormKey((key) => key + 1);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = {
      question: data.get("question"),
      answer: data.get("answer"),
      category: data.get("category"),
    };

    setSending(true);
    setErrors({});
    setSuccess(null);
    setRequestError(null);

    const result = editing
      ? await sendJson<QuestionErrors>(
          "PUT",
          `/api/questions/${editing.id}`,
          payload
        )
      : await submitJson<QuestionErrors>("/api/questions", payload);

    setSending(false);

    if (result.kind === "created") {
      setSuccess("Question created successfully.");
      exitEditMode();
      setRefreshKey((key) => key + 1);
      return;
    }
    if (result.kind === "ok") {
      setSuccess("Changes saved.");
      exitEditMode();
      setRefreshKey((key) => key + 1);
      return;
    }
    if (result.kind === "invalid") {
      setErrors(result.errors);
      return;
    }
    if (result.kind === "notFound") {
      setRequestError(result.message);
      exitEditMode();
      setRefreshKey((key) => key + 1);
      return;
    }
    setRequestError(result.message);
  }

  async function handleDelete(question: StoredQuestion) {
    if (!window.confirm(`Delete "${question.question}"? This can't be undone.`)) {
      return;
    }
    setSuccess(null);
    setRequestError(null);

    const result = await sendJson<QuestionErrors>(
      "DELETE",
      `/api/questions/${question.id}`
    );

    if (result.kind === "ok") {
      setSuccess("Question deleted.");
      if (editing?.id === question.id) {
        exitEditMode();
      }
      setRefreshKey((key) => key + 1);
      return;
    }
    if (result.kind === "notFound") {
      setRequestError(result.message);
      if (editing?.id === question.id) {
        exitEditMode();
      }
      setRefreshKey((key) => key + 1);
      return;
    }
    if (result.kind === "failed") {
      setRequestError(result.message);
    }
  }

  return (
    <div className="mt-8">
      <form
        key={formKey}
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-md flex-col gap-4"
      >
        {editing && (
          <p className="rounded-lg border border-saffron/40 bg-blush px-3 py-2 text-sm">
            Editing “{editing.question}”
          </p>
        )}
        <FormField
          id="question"
          label="Question"
          placeholder="What recruiters usually ask"
          maxLength={QUESTION_LIMITS.question}
          error={errors.question}
          defaultValue={editing?.question ?? ""}
        />
        <FormField
          id="answer"
          label="Answer"
          placeholder="Your answer, in your own words"
          maxLength={QUESTION_LIMITS.answer}
          rows={4}
          error={errors.answer}
          defaultValue={editing?.answer ?? ""}
        />
        <FormField
          id="category"
          label="Category"
          placeholder="Category"
          options={QUESTION_CATEGORIES}
          error={errors.category}
          defaultValue={editing?.category ?? "Background"}
        />
        <div className="flex items-center gap-3">
          <button type="submit" disabled={sending} className={submitButtonClass}>
            {sending ? "Saving..." : editing ? "Save changes" : "Add question"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={cancelEdit}
              disabled={sending}
              className={cancelButtonClass}
            >
              Cancel
            </button>
          )}
        </div>
        {requestError && (
          <p role="alert" className={errorClass}>
            {requestError}
          </p>
        )}
        {success && (
          <p role="status" className={successClass}>
            {success}
          </p>
        )}
      </form>

      <section className="mt-12">
        <h2 className={sectionHeadingClass}>Existing questions</h2>
        {listError && <p className={`mt-4 ${errorClass}`}>{listError}</p>}
        {questions === null && !listError && (
          <p className="mt-4 text-sm text-aubergine/75">Loading…</p>
        )}
        {questions?.length === 0 && (
          <p className="mt-4 text-sm text-aubergine/75">
            No questions yet. Create one with the form above.
          </p>
        )}
        {questions && questions.length > 0 && (
          <ul className="mt-4 divide-y divide-aubergine/15">
            {questions.map((question) => (
              <li key={question.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="font-medium">{question.question}</h3>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryColors(question.category).badge}`}
                  >
                    {question.category}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-aubergine/85">
                  {question.answer.length > 160
                    ? `${question.answer.slice(0, 160)}…`
                    : question.answer}
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => startEdit(question)}
                    className={actionButtonClass}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(question)}
                    className={deleteButtonClass}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

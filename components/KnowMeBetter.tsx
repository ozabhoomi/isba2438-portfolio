"use client";

import { useEffect, useState } from "react";
import { QUESTION_CATEGORIES } from "@/lib/limits";
import { getCategoryColors } from "@/lib/category-styles";
import type { StoredQuestion } from "@/lib/questions";
import QuestionCard from "./QuestionCard";
import { errorClass } from "./FormUI";

type Filter = "All" | (typeof QUESTION_CATEGORIES)[number];

const FILTERS: Filter[] = ["All", ...QUESTION_CATEGORIES];

const filterIdleClass =
  "rounded-full border border-aubergine/25 px-4 py-1.5 text-sm font-medium transition-colors hover:border-aubergine hover:bg-blush";
const filterActiveClass =
  "rounded-full border border-aubergine bg-aubergine px-4 py-1.5 text-sm font-medium text-ivory transition-colors hover:bg-aubergine-deep";
const filterActiveCategoryClass =
  "rounded-full border border-transparent px-4 py-1.5 text-sm font-medium transition-colors";

export default function KnowMeBetter() {
  const [questions, setQuestions] = useState<StoredQuestion[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Filter>("All");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/questions", { cache: "no-store" })
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
  }, []);

  const visible = questions?.filter(
    (question) =>
      activeCategory === "All" || question.category === activeCategory
  );

  return (
    <div>
      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = activeCategory === filter;
          const categoryColors = filter === "All" ? null : getCategoryColors(filter);
          const activeClass =
            filter === "All"
              ? filterActiveClass
              : `${filterActiveCategoryClass} ${categoryColors?.button ?? ""}`;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveCategory(filter)}
              className={active ? activeClass : filterIdleClass}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {listError && <p className={`mt-8 ${errorClass}`}>{listError}</p>}
      {questions === null && !listError && (
        <p className="mt-8 text-sm text-aubergine/75">Loading…</p>
      )}
      {visible && visible.length === 0 && (
        <p className="mt-8 text-sm text-aubergine/75">
          {activeCategory === "All"
            ? "No questions yet."
            : `No questions in ${activeCategory} yet.`}
        </p>
      )}
      {visible && visible.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {visible.map((question) => (
            <QuestionCard
              key={question.id}
              question={question.question}
              answer={question.answer}
              category={question.category}
            />
          ))}
        </div>
      )}
    </div>
  );
}

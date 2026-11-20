"use client";

import { useState } from "react";
import { getCategoryColors } from "@/lib/category-styles";

type QuestionCardProps = {
  question: string;
  answer: string;
  category: string;
  isAdded: boolean;
  onAdd: () => void;
};

const addedButtonClass =
  "rounded-full bg-aubergine px-4 py-1.5 text-sm font-medium text-ivory";
const addButtonClass =
  "rounded-full border border-aubergine/25 px-4 py-1.5 text-sm font-medium transition-colors hover:border-aubergine hover:bg-blush cursor-pointer";

export default function QuestionCard({
  question,
  answer,
  category,
  isAdded,
  onAdd,
}: QuestionCardProps) {
  const [open, setOpen] = useState(false);
  const colors = getCategoryColors(category);

  return (
    <div className="rounded-2xl border border-aubergine/15 bg-white p-6 transition-colors hover:border-saffron">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-saffron"
      >
        <span className="flex items-center justify-between gap-4">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.badge}`}
          >
            {category}
          </span>
          <span className="font-mono text-sm text-aubergine/75" aria-hidden="true">
            {open ? "−" : "+"}
          </span>
        </span>
        <span className="mt-3 block font-serif text-xl font-semibold tracking-tight">
          {question}
        </span>
      </button>
      {open && (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-aubergine/85">
          {answer}
        </p>
      )}
      <div className="mt-4">
        {isAdded ? (
          <span className={addedButtonClass} aria-label="Already in your agenda">
            Added
          </span>
        ) : (
          <button type="button" onClick={onAdd} className={addButtonClass}>
            Add to agenda
          </button>
        )}
      </div>
    </div>
  );
}

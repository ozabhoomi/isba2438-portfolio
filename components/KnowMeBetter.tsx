"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { QUESTION_CATEGORIES } from "@/lib/limits";
import { getCategoryColors } from "@/lib/category-styles";
import {
  AGENDA_NOTE_LIMIT,
  AGENDA_TIMEZONE_LIMIT,
  PREFERRED_TIMES,
  emptyAgenda,
  loadAgenda,
  saveAgenda,
  type Agenda,
} from "@/lib/agenda-storage";
import type { StoredQuestion } from "@/lib/questions";
import QuestionCard from "./QuestionCard";
import FormField, { errorClass } from "./FormUI";

type Filter = "All" | (typeof QUESTION_CATEGORIES)[number];

const FILTERS: Filter[] = ["All", ...QUESTION_CATEGORIES];

const filterIdleClass =
  "rounded-full border border-aubergine/25 px-4 py-1.5 text-sm font-medium transition-colors hover:border-aubergine hover:bg-blush";
const filterActiveClass =
  "rounded-full border border-aubergine bg-aubergine px-4 py-1.5 text-sm font-medium text-ivory transition-colors hover:bg-aubergine-deep";
const filterActiveCategoryClass =
  "rounded-full border border-transparent px-4 py-1.5 text-sm font-medium transition-colors";
const removeButtonClass =
  "rounded-full border border-red-600/30 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:border-red-600 hover:bg-red-50 cursor-pointer";
const clearButtonClass =
  "rounded-full border border-red-600/30 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:border-red-600 hover:bg-red-50 cursor-pointer";
const requestButtonClass =
  "inline-block rounded-full bg-aubergine px-6 py-3 text-base font-medium text-ivory transition-colors hover:bg-aubergine-deep";

export default function KnowMeBetter() {
  const [questions, setQuestions] = useState<StoredQuestion[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Filter>("All");

  const [agenda, setAgenda] = useState<Agenda>(() => emptyAgenda());
  const [saveFailed, setSaveFailed] = useState(false);
  const hydratedRef = useRef(false);

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

  useEffect(() => {
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (cancelled) return;
      setAgenda(loadAgenda());
      hydratedRef.current = true;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleItems = useMemo(() => {
    if (!questions) {
      return agenda.items;
    }
    const knownIds = new Set(questions.map((question) => question.id));
    return agenda.items.filter((item) => knownIds.has(item.questionId));
  }, [questions, agenda.items]);

  const effectiveAgenda = useMemo<Agenda>(
    () => ({ ...agenda, items: visibleItems }),
    [agenda, visibleItems]
  );

  function applyAgenda(next: Agenda) {
    setAgenda(next);
    setSaveFailed(!saveAgenda(next));
  }

  function isAdded(questionId: string): boolean {
    return visibleItems.some((item) => item.questionId === questionId);
  }

  function addToAgenda(questionId: string) {
    if (isAdded(questionId)) {
      return;
    }
    applyAgenda({
      ...effectiveAgenda,
      items: [...effectiveAgenda.items, { questionId, notes: "" }],
    });
  }

  function removeFromAgenda(questionId: string) {
    applyAgenda({
      ...effectiveAgenda,
      items: effectiveAgenda.items.filter(
        (item) => item.questionId !== questionId
      ),
    });
  }

  function updateNotes(questionId: string, notes: string) {
    applyAgenda({
      ...effectiveAgenda,
      items: effectiveAgenda.items.map((item) =>
        item.questionId === questionId
          ? { ...item, notes: notes.slice(0, AGENDA_NOTE_LIMIT) }
          : item
      ),
    });
  }

  function clearAgenda() {
    if (!window.confirm("Clear your whole agenda? This can't be undone.")) {
      return;
    }
    applyAgenda(emptyAgenda());
  }

  const questionsLoaded = questions !== null;
  const agendaEntries = visibleItems
    .map((item) => ({
      item,
      question: questions?.find((q) => q.id === item.questionId),
    }))
    .filter((entry) => entry.question !== undefined);

  function buildRequestMessage(): string {
    const timezone = effectiveAgenda.timezone.trim();
    const lines = ["I'd like to request an intro call."];
    if (timezone) {
      lines.push(`Preferred time: ${effectiveAgenda.preferredTime} (${timezone})`);
    } else {
      lines.push(`Preferred time: ${effectiveAgenda.preferredTime}`);
    }
    lines.push("", "Questions I'd like to cover:");
    agendaEntries.forEach((entry, index) => {
      lines.push(`${index + 1}. ${entry.question!.question}`);
      if (entry.item.notes.trim()) {
        lines.push(`   My notes: ${entry.item.notes.trim()}`);
      }
    });
    return lines.join("\n");
  }

  const visible = questions?.filter(
    (question) =>
      activeCategory === "All" || question.category === activeCategory
  );

  return (
    <div>
      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const active = activeCategory === filter;
          const categoryColors =
            filter === "All" ? null : getCategoryColors(filter);
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
              isAdded={isAdded(question.id)}
              onAdd={() => addToAgenda(question.id)}
            />
          ))}
        </div>
      )}

      <section className="mt-16 rounded-2xl border border-aubergine/15 bg-blush p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-2xl font-semibold tracking-tight">
            Your interview agenda
          </h2>
          {agenda.items.length > 0 && (
            <button
              type="button"
              onClick={clearAgenda}
              className={clearButtonClass}
            >
              Clear agenda
            </button>
          )}
        </div>
        <p className="mt-2 text-sm text-aubergine/75">
          Your agenda is saved in this browser only. Nothing is sent to the
          server until you request the call.
        </p>

        {!questionsLoaded ? (
          <p className="mt-6 text-sm text-aubergine/75">Loading…</p>
        ) : agendaEntries.length === 0 ? (
          <p className="mt-6 text-sm text-aubergine/75">
            Your agenda is empty. Tap “Add to agenda” on any question above to
            build your interview list.
          </p>
        ) : (
          <>
            <ul className="mt-6 divide-y divide-aubergine/15">
              {agendaEntries.map(({ item, question }) => (
                <li key={item.questionId} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-medium">{question!.question}</p>
                    <button
                      type="button"
                      onClick={() => removeFromAgenda(item.questionId)}
                      className={removeButtonClass}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-2">
                    <FormField
                      id={`agenda-note-${item.questionId}`}
                      label="My notes"
                      placeholder="Anything you want to ask about this (optional)"
                      maxLength={AGENDA_NOTE_LIMIT}
                      rows={2}
                      value={item.notes}
                      onChange={(event) =>
                        updateNotes(item.questionId, event.target.value)
                      }
                    />
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <FormField
                id="agenda-preferred-time"
                label="Preferred time"
                placeholder="Preferred time"
                options={PREFERRED_TIMES}
                value={effectiveAgenda.preferredTime}
                onChange={(event) =>
                  applyAgenda({
                    ...effectiveAgenda,
                    preferredTime: event.target
                      .value as Agenda["preferredTime"],
                  })
                }
              />
              <FormField
                id="agenda-timezone"
                label="Your timezone"
                placeholder="e.g. PST"
                maxLength={AGENDA_TIMEZONE_LIMIT}
                value={effectiveAgenda.timezone}
                onChange={(event) =>
                  applyAgenda({
                    ...effectiveAgenda,
                    timezone: event.target.value.slice(
                      0,
                      AGENDA_TIMEZONE_LIMIT
                    ),
                  })
                }
              />
            </div>

            <div className="mt-6">
              <Link
                href={`/contact-me?message=${encodeURIComponent(buildRequestMessage())}`}
                className={requestButtonClass}
              >
                Request this call
              </Link>
            </div>
          </>
        )}

        {saveFailed && (
          <p role="alert" className={`mt-4 ${errorClass}`}>
            Couldn&apos;t save your agenda in this browser. Your changes may
            not survive a refresh.
          </p>
        )}
      </section>
    </div>
  );
}

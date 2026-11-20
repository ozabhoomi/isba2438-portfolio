export const AGENDA_STORAGE_KEY = "portfolio-interview-agenda";

export const PREFERRED_TIMES = [
  "Weekday mornings",
  "Weekday afternoons",
  "Evenings",
  "Flexible",
] as const;

export type PreferredTime = (typeof PREFERRED_TIMES)[number];

export type AgendaItem = {
  questionId: string;
  notes: string;
};

export type Agenda = {
  items: AgendaItem[];
  preferredTime: PreferredTime;
  timezone: string;
};

export const AGENDA_NOTE_LIMIT = 300;
export const AGENDA_TIMEZONE_LIMIT = 60;

export function emptyAgenda(): Agenda {
  return { items: [], preferredTime: "Flexible", timezone: "" };
}

function isPreferredTime(value: unknown): value is PreferredTime {
  return PREFERRED_TIMES.includes(value as PreferredTime);
}

export function loadAgenda(): Agenda {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return emptyAgenda();
    }

    const raw = window.localStorage.getItem(AGENDA_STORAGE_KEY);
    if (raw === null) {
      return emptyAgenda();
    }

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return emptyAgenda();
    }

    const record = parsed as Record<string, unknown>;
    const itemsRaw = Array.isArray(record.items) ? record.items : [];

    const items: AgendaItem[] = [];
    const seenIds = new Set<string>();
    for (const entry of itemsRaw) {
      if (typeof entry !== "object" || entry === null) {
        continue;
      }
      const candidate = entry as Record<string, unknown>;
      if (typeof candidate.questionId !== "string" || candidate.questionId === "") {
        continue;
      }
      if (seenIds.has(candidate.questionId)) {
        continue;
      }
      seenIds.add(candidate.questionId);
      items.push({
        questionId: candidate.questionId,
        notes:
          typeof candidate.notes === "string"
            ? candidate.notes.slice(0, AGENDA_NOTE_LIMIT)
            : "",
      });
    }

    return {
      items,
      preferredTime: isPreferredTime(record.preferredTime)
        ? record.preferredTime
        : "Flexible",
      timezone:
        typeof record.timezone === "string"
          ? record.timezone.slice(0, AGENDA_TIMEZONE_LIMIT)
          : "",
    };
  } catch {
    return emptyAgenda();
  }
}

export function saveAgenda(agenda: Agenda): boolean {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return false;
    }
    window.localStorage.setItem(AGENDA_STORAGE_KEY, JSON.stringify(agenda));
    return true;
  } catch {
    return false;
  }
}

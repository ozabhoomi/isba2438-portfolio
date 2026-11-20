"use client";

import { useEffect, useState } from "react";
import { PROJECT_LIMITS } from "@/lib/limits";
import type { Project, ProjectErrors } from "@/lib/projects";
import FormField, {
  errorClass,
  sectionHeadingClass,
  submitButtonClass,
  successClass,
} from "./FormUI";
import { sendJson, submitJson } from "@/lib/submit-json";

type SectionDraft = {
  heading: string;
  paragraphs: string;
  bullets: string;
  hasStat: boolean;
  statValue: string;
  statLabel: string;
};

const emptySection = (): SectionDraft => ({
  heading: "",
  paragraphs: "",
  bullets: "",
  hasStat: false,
  statValue: "",
  statLabel: "",
});

const actionButtonClass =
  "rounded-full border border-aubergine/25 px-4 py-1.5 text-sm font-medium transition-colors hover:border-aubergine hover:bg-blush";
const deleteButtonClass =
  "rounded-full border border-red-600/30 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:border-red-600 hover:bg-red-50";
const cancelButtonClass =
  "rounded-full border border-aubergine/25 px-5 py-3 text-base font-medium transition-colors hover:border-aubergine hover:bg-blush disabled:opacity-50";
const addSectionButtonClass =
  "w-fit rounded-full border border-aubergine/25 px-5 py-2 text-sm font-medium transition-colors hover:border-aubergine hover:bg-blush";
const sectionBoxClass =
  "flex flex-col gap-3 rounded-xl border border-aubergine/15 bg-white p-4";

function toDraft(project: Project): SectionDraft[] {
  return project.sections.map((section) => ({
    heading: section.heading,
    paragraphs: (section.body ?? []).join("\n\n"),
    bullets: (section.bullets ?? []).join("\n"),
    hasStat: Boolean(section.stat),
    statValue: section.stat?.value ?? "",
    statLabel: section.stat?.label ?? "",
  }));
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [sections, setSections] = useState<SectionDraft[]>([]);

  const [errors, setErrors] = useState<ProjectErrors>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error("list request failed");
        return res.json() as Promise<{ projects?: Project[] }>;
      })
      .then((body) => {
        if (cancelled) return;
        setProjects(body.projects ?? []);
        setListError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setListError("Couldn't load projects. Please refresh the page.");
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setContext("");
    setDate("");
    setSummary("");
    setSkills("");
    setSections([]);
  }

  function clearMessages() {
    setErrors({});
    setSuccess(null);
    setRequestError(null);
  }

  function startEdit(project: Project) {
    setEditingId(project.id);
    setTitle(project.title);
    setContext(project.context);
    setDate(project.date);
    setSummary(project.summary);
    setSkills(project.skills.join(", "));
    setSections(toDraft(project));
    clearMessages();
  }

  function cancelEdit() {
    resetForm();
    clearMessages();
  }

  function updateSection(index: number, patch: Partial<SectionDraft>) {
    setSections((prev) =>
      prev.map((section, i) => (i === index ? { ...section, ...patch } : section))
    );
  }

  function buildPayload() {
    return {
      title,
      context,
      date,
      summary,
      skills,
      sections: sections.map((section) => ({
        heading: section.heading,
        paragraphs: section.paragraphs,
        bullets: section.bullets,
        statValue: section.hasStat ? section.statValue : "",
        statLabel: section.hasStat ? section.statLabel : "",
      })),
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    clearMessages();

    const result = editingId
      ? await sendJson<ProjectErrors>(
          "PUT",
          `/api/projects/${editingId}`,
          buildPayload()
        )
      : await submitJson<ProjectErrors>("/api/projects", buildPayload());

    setSending(false);

    if (result.kind === "created") {
      setSuccess("Project created successfully.");
      resetForm();
      setRefreshKey((key) => key + 1);
      return;
    }
    if (result.kind === "ok") {
      setSuccess("Changes saved.");
      resetForm();
      setRefreshKey((key) => key + 1);
      return;
    }
    if (result.kind === "invalid") {
      setErrors(result.errors);
      return;
    }
    if (result.kind === "notFound") {
      setRequestError(result.message);
      resetForm();
      setRefreshKey((key) => key + 1);
      return;
    }
    setRequestError(result.message);
  }

  async function handleDelete(project: Project) {
    if (!window.confirm(`Delete "${project.title}"? This can't be undone.`)) {
      return;
    }
    setSuccess(null);
    setRequestError(null);

    const result = await sendJson<ProjectErrors>(
      "DELETE",
      `/api/projects/${project.id}`
    );

    if (result.kind === "ok") {
      setSuccess("Project deleted.");
      if (editingId === project.id) {
        resetForm();
      }
      setRefreshKey((key) => key + 1);
      return;
    }
    if (result.kind === "notFound") {
      setRequestError(result.message);
      if (editingId === project.id) {
        resetForm();
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
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-md flex-col gap-4"
      >
        {editingId && (
          <p className="rounded-lg border border-saffron/40 bg-blush px-3 py-2 text-sm">
            Editing “{title}”
          </p>
        )}
        <FormField
          id="project-title"
          label="Title"
          placeholder="Project title"
          maxLength={PROJECT_LIMITS.title}
          error={errors.title}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <FormField
          id="project-context"
          label="Context"
          placeholder="Company · Team, or Competition · Award"
          maxLength={PROJECT_LIMITS.context}
          error={errors.context}
          value={context}
          onChange={(event) => setContext(event.target.value)}
        />
        <FormField
          id="project-date"
          label="Date"
          placeholder="June 2026 – Present"
          maxLength={PROJECT_LIMITS.date}
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <FormField
          id="project-summary"
          label="Summary"
          placeholder="One or two sentences shown on the projects page"
          maxLength={PROJECT_LIMITS.summary}
          rows={3}
          error={errors.summary}
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
        />
        <FormField
          id="project-skills"
          label="Skills (comma separated)"
          placeholder="Python, XGBoost, Tableau"
          value={skills}
          onChange={(event) => setSkills(event.target.value)}
        />

        <div className="mt-2">
          <h3 className={sectionHeadingClass}>Sections</h3>
          <div className="mt-3 flex flex-col gap-4">
            {sections.map((section, index) => (
              <div key={index} className={sectionBoxClass}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">Section {index + 1}</p>
                  <button
                    type="button"
                    onClick={() =>
                      setSections((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    className={deleteButtonClass}
                  >
                    Remove
                  </button>
                </div>
                <FormField
                  id={`section-${index}-heading`}
                  label="Heading"
                  placeholder="Overview"
                  maxLength={PROJECT_LIMITS.sectionHeading}
                  value={section.heading}
                  onChange={(event) =>
                    updateSection(index, { heading: event.target.value })
                  }
                />
                <FormField
                  id={`section-${index}-paragraphs`}
                  label="Paragraphs (blank line between paragraphs)"
                  placeholder={"First paragraph.\n\nSecond paragraph."}
                  rows={4}
                  value={section.paragraphs}
                  onChange={(event) =>
                    updateSection(index, { paragraphs: event.target.value })
                  }
                />
                <FormField
                  id={`section-${index}-bullets`}
                  label="Bullets (one per line, optional)"
                  placeholder={"First bullet\nSecond bullet"}
                  rows={3}
                  value={section.bullets}
                  onChange={(event) =>
                    updateSection(index, { bullets: event.target.value })
                  }
                />
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input
                    type="checkbox"
                    checked={section.hasStat}
                    onChange={(event) =>
                      updateSection(index, { hasStat: event.target.checked })
                    }
                  />
                  Show a stat card
                </label>
                {section.hasStat && (
                  <div className="flex flex-col gap-3">
                    <FormField
                      id={`section-${index}-stat-value`}
                      label="Stat value"
                      placeholder="32%"
                      maxLength={PROJECT_LIMITS.statValue}
                      value={section.statValue}
                      onChange={(event) =>
                        updateSection(index, { statValue: event.target.value })
                      }
                    />
                    <FormField
                      id={`section-${index}-stat-label`}
                      label="Stat label"
                      placeholder="reduction in team workload"
                      maxLength={PROJECT_LIMITS.statLabel}
                      value={section.statLabel}
                      onChange={(event) =>
                        updateSection(index, { statLabel: event.target.value })
                      }
                    />
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSections((prev) => [...prev, emptySection()])}
              className={addSectionButtonClass}
            >
              Add section
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <button type="submit" disabled={sending} className={submitButtonClass}>
            {sending ? "Saving..." : editingId ? "Save changes" : "Create project"}
          </button>
          {editingId && (
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
        <h2 className={sectionHeadingClass}>Existing projects</h2>
        {listError && <p className={`mt-4 ${errorClass}`}>{listError}</p>}
        {projects === null && !listError && (
          <p className="mt-4 text-sm text-aubergine/75">Loading…</p>
        )}
        {projects?.length === 0 && (
          <p className="mt-4 text-sm text-aubergine/75">
            No projects yet. Create one with the form above.
          </p>
        )}
        {projects && projects.length > 0 && (
          <ul className="mt-4 divide-y divide-aubergine/15">
            {projects.map((project) => (
              <li key={project.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="font-mono text-xs text-aubergine/75">
                    {project.date}
                  </p>
                </div>
                <p className="mt-1 font-mono text-xs text-aubergine/75">
                  /project/{project.slug}
                </p>
                <p className="mt-2 text-sm leading-6 text-aubergine/85">
                  {project.summary}
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => startEdit(project)}
                    className={actionButtonClass}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project)}
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

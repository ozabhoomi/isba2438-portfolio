import { randomUUID } from "node:crypto";
import { PROJECT_LIMITS } from "./limits";
import { generateSlug } from "./blogs";
import { readJsonArray, updateJsonArray } from "./json-store";

export type ProjectSection = {
  heading: string;
  body?: string[];
  bullets?: string[];
  stat?: { value: string; label: string };
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  context: string;
  date: string;
  summary: string;
  sections: ProjectSection[];
  skills: string[];
};

export type ProjectInput = {
  title: string;
  context: string;
  date: string;
  summary: string;
  skills: string[];
  sections: ProjectSection[];
};

export type ProjectErrors = Partial<
  Record<"title" | "context" | "summary", string>
>;

export type ProjectValidationResult =
  | { ok: true; values: ProjectInput; slug: string }
  | { ok: false; errors: ProjectErrors };

const dataFile = "projects.json";

export function getProjects(): Promise<Project[]> {
  return readJsonArray<Project>(dataFile);
}

export async function getProjectBySlug(
  slug: string
): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug);
}

export async function projectSlugExists(slug: string): Promise<boolean> {
  const projects = await getProjects();
  return projects.some((project) => project.slug === slug);
}

export function createProject(values: ProjectInput, slug: string): Project {
  return {
    id: randomUUID(),
    slug,
    title: values.title,
    context: values.context,
    date: values.date,
    summary: values.summary,
    sections: values.sections,
    skills: values.skills,
  };
}

export async function saveProject(project: Project): Promise<void> {
  await updateJsonArray<Project>(dataFile, (projects) => [...projects, project]);
}

export async function getProjectById(
  id: string
): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((project) => project.id === id);
}

export async function updateProject(
  id: string,
  values: ProjectInput
): Promise<Project | undefined> {
  let updated: Project | undefined;
  await updateJsonArray<Project>(dataFile, (projects) =>
    projects.map((project) => {
      if (project.id !== id) {
        return project;
      }
      updated = {
        ...project,
        title: values.title,
        context: values.context,
        date: values.date,
        summary: values.summary,
        sections: values.sections,
        skills: values.skills,
      };
      return updated;
    })
  );
  return updated;
}

export async function deleteProject(
  id: string
): Promise<Project | undefined> {
  let deleted: Project | undefined;
  await updateJsonArray<Project>(dataFile, (projects) => {
    const target = projects.find((project) => project.id === id);
    if (!target) {
      return projects;
    }
    deleted = target;
    return projects.filter((project) => project.id !== id);
  });
  return deleted;
}

export function validateProject(input: unknown): ProjectValidationResult {
  const errors: ProjectErrors = {};
  const { title, context, date, summary, skills, sections } = (input ??
    {}) as Record<string, unknown>;

  const titleValue = typeof title === "string" ? title.trim() : "";
  const contextValue = typeof context === "string" ? context.trim() : "";
  const dateValue = typeof date === "string" ? date.trim() : "";
  const summaryValue = typeof summary === "string" ? summary.trim() : "";
  const skillsValue = typeof skills === "string" ? skills : "";

  if (!titleValue) {
    errors.title = "Title can't be blank.";
  }
  if (!contextValue) {
    errors.context = "Context can't be blank.";
  }
  if (!summaryValue) {
    errors.summary = "Summary can't be blank.";
  }

  const slug = generateSlug(titleValue);
  if (titleValue && !slug) {
    errors.title = "Title must include at least one letter or number.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const skillsArray = skillsValue
    .split(",")
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0)
    .map((skill) => skill.slice(0, PROJECT_LIMITS.skill))
    .slice(0, PROJECT_LIMITS.skillCount);

  const sectionsArray: ProjectSection[] = Array.isArray(sections)
    ? sections
        .map((section) => normalizeSection(section))
        .filter((section): section is ProjectSection => section !== undefined)
        .slice(0, PROJECT_LIMITS.sectionCount)
    : [];

  return {
    ok: true,
    values: {
      title: titleValue.slice(0, PROJECT_LIMITS.title),
      context: contextValue.slice(0, PROJECT_LIMITS.context),
      date: dateValue.slice(0, PROJECT_LIMITS.date),
      summary: summaryValue.slice(0, PROJECT_LIMITS.summary),
      skills: skillsArray,
      sections: sectionsArray,
    },
    slug,
  };
}

function normalizeSection(section: unknown): ProjectSection | undefined {
  const { heading, paragraphs, bullets, statValue, statLabel } = (section ??
    {}) as Record<string, unknown>;

  const headingValue =
    typeof heading === "string"
      ? heading.trim().slice(0, PROJECT_LIMITS.sectionHeading)
      : "";
  const body =
    typeof paragraphs === "string"
      ? paragraphs
          .split(/\n\s*\n/)
          .map((paragraph) => paragraph.trim())
          .filter((paragraph) => paragraph.length > 0)
          .map((paragraph) => paragraph.slice(0, PROJECT_LIMITS.sectionParagraph))
          .slice(0, PROJECT_LIMITS.paragraphCount)
      : [];
  const bulletList =
    typeof bullets === "string"
      ? bullets
          .split("\n")
          .map((bullet) => bullet.trim())
          .filter((bullet) => bullet.length > 0)
          .map((bullet) => bullet.slice(0, PROJECT_LIMITS.sectionBullet))
          .slice(0, PROJECT_LIMITS.bulletCount)
      : [];
  const statValueText =
    typeof statValue === "string"
      ? statValue.trim().slice(0, PROJECT_LIMITS.statValue)
      : "";
  const statLabelText =
    typeof statLabel === "string"
      ? statLabel.trim().slice(0, PROJECT_LIMITS.statLabel)
      : "";

  const hasContent =
    headingValue.length > 0 ||
    body.length > 0 ||
    bulletList.length > 0 ||
    statValueText.length > 0;
  if (!hasContent) {
    return undefined;
  }

  return {
    heading: headingValue,
    ...(body.length > 0 ? { body } : {}),
    ...(bulletList.length > 0 ? { bullets: bulletList } : {}),
    ...(statValueText
      ? { stat: { value: statValueText, label: statLabelText } }
      : {}),
  };
}

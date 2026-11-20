export const CONTACT_LIMITS = {
  name: 200,
  email: 200,
  message: 5000,
} as const;

export const BLOG_LIMITS = {
  title: 200,
  author: 200,
  content: 50000,
  slug: 100,
} as const;

export const PROJECT_LIMITS = {
  title: 200,
  context: 200,
  date: 100,
  summary: 2000,
  skill: 100,
  skillCount: 20,
  sectionHeading: 200,
  sectionParagraph: 5000,
  paragraphCount: 20,
  sectionBullet: 500,
  bulletCount: 30,
  statValue: 50,
  statLabel: 300,
  sectionCount: 20,
} as const;

export const QUESTION_CATEGORIES = [
  "Background",
  "Work",
  "Skills",
  "Personal",
] as const;

export const QUESTION_LIMITS = {
  question: 300,
  answer: 2000,
} as const;

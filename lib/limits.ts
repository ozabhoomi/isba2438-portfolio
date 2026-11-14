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

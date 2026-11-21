# Personal Portfolio

Personal portfolio site for Bhoomi Oza, built with [Next.js](https://nextjs.org) (App Router), TypeScript, and Tailwind CSS. Released under the [MIT License](LICENSE).

## Features

- Home page with hero, portrait, stat cards, and real contact links
- About Me, Projects with case-study detail pages, and a public blog
- Know Me Better: recruiter Q&A with category filters and a browser-saved interview agenda
- Two contact forms: one using a Next.js server action, one posting with `fetch`
- Admin hub with full create, read, update, and delete for blogs, projects, questions, and contact messages
- JSON-file storage through a shared store (per-file write queue, temp file + atomic rename, immutable ids)
- Plum-and-saffron theme (Fraunces serif headings), with category colors defined once and reused everywhere

## Routes

### Public

| Route | Page |
| --- | --- |
| `/` | Home — hero, portrait, story, stat cards, contact links |
| `/about-me` | About Me — education, experience, and skills |
| `/projects` | Projects — list, read from `data/projects.json` at request time |
| `/project/[slug]` | Project case study (e.g. `/project/tiers-of-service-intake-framework`); unknown slugs render the not-found page |
| `/blogs` | Blog — index of posts, loaded from the posts API |
| `/blogs/[slug]` | Blog post reader; deleted posts show an in-app not-found view |
| `/know-me-better` | Know Me Better — recruiter questions with category filters and the interview agenda |
| `/contact-me-server-form` | Contact — form handled by a Next.js server action |
| `/contact-me` | Contact — form posting with `fetch`; accepts `?message=` to prefill the message box |

Unknown URLs show a custom 404 page.

### Admin (linked from the footer; not in the navbar)

| Route | Page |
| --- | --- |
| `/admin` | Admin hub — links to the four admin pages |
| `/admin/blogs` | Create, edit, and delete blog posts |
| `/admin/messages` | Read contact messages, edit them, mark them handled, delete them |
| `/admin/projects` | Create, edit, and delete projects |
| `/admin/questions` | Create, edit, and delete Know Me Better questions |

## API Endpoints

### Contact messages

| Endpoint | Method | Behavior |
| --- | --- | --- |
| `/api/contact` | `POST` | Validates `name`, `email`, `message` and appends the message. `201` created, `400` bad JSON or field errors, `500` save failure. |
| `/api/contact` | `GET` | All messages, newest first, `Cache-Control: no-store`. `200`. |
| `/api/contact/[id]` | `GET` | One message. `200`, `404` unknown id. |
| `/api/contact/[id]` | `PUT` | Updates `name`, `email`, `message`, `status` (`"new"` / `"handled"`); keeps `id` and `receivedAt`. `200`, `400` bad JSON / field errors / invalid status, `404` unknown id. |
| `/api/contact/[id]` | `DELETE` | Deletes the message. `200` with the deleted id, `404` unknown id. |

### Blog posts

| Endpoint | Method | Behavior |
| --- | --- | --- |
| `/api/blogs` | `GET` | All posts, newest first, `Cache-Control: no-store`. `200`. |
| `/api/blogs` | `POST` | Creates a post (`title`, `author`, `content`); the slug is generated from the title. `201` with the post, `400` bad JSON or field errors, `409` duplicate slug, `500` save failure. |
| `/api/blogs/[id]` | `GET` | One post. `200`, `404` unknown id. |
| `/api/blogs/[id]` | `PUT` | Updates `title`, `author`, `content`; keeps `id`, `slug`, and `createdAt`. `200`, `400`, `404`. |
| `/api/blogs/[id]` | `DELETE` | Deletes the post. `200` with the deleted id, `404` unknown id. |

### Projects

| Endpoint | Method | Behavior |
| --- | --- | --- |
| `/api/projects` | `GET` | All projects. `200`. |
| `/api/projects` | `POST` | Creates a project (`title`, `context`, `date`, `summary`, comma-separated `skills`, `sections` with headings, paragraphs, bullets, optional stat). Slug generated from the title. `201`, `400`, `409` duplicate slug, `500`. |
| `/api/projects/[id]` | `GET` | One project. `200`, `404`. |
| `/api/projects/[id]` | `PUT` | Updates title, context, date, summary, skills, sections; keeps `id` and `slug`. `200`, `400`, `404`. |
| `/api/projects/[id]` | `DELETE` | Deletes the project. `200` with the deleted id, `404` unknown id. |

### Know Me Better questions

| Endpoint | Method | Behavior |
| --- | --- | --- |
| `/api/questions` | `GET` | All questions, newest first, `Cache-Control: no-store`. `200`. |
| `/api/questions` | `POST` | Creates a question (`question`, `answer`, `category` from Background / Work / Skills / Personal). `201`, `400` bad JSON / field errors / invalid category, `500`. |
| `/api/questions/[id]` | `GET` | One question. `200`, `404`. |
| `/api/questions/[id]` | `PUT` | Updates question, answer, category; keeps `id` and `createdAt`. `200`, `400`, `404`. |
| `/api/questions/[id]` | `DELETE` | Deletes the question. `200` with the deleted id, `404` unknown id. |

## Forms & Data

All data lives in JSON files under `data/`, read and written through [lib/json-store.ts](lib/json-store.ts): reads tolerate a missing file, writes are serialized per file with a promise queue and land atomically (temp file + rename). Every record has an immutable `id` created with `crypto.randomUUID()`.

| File | Records |
| --- | --- |
| [data/messages.json](data/messages.json) | Contact messages: `id`, `name`, `email`, `message`, `receivedAt`, `status` (`"new"` / `"handled"`) |
| [data/blogs.json](data/blogs.json) | Blog posts: `id`, `slug`, `title`, `author`, `content`, `createdAt` |
| [data/projects.json](data/projects.json) | Projects: `id`, `slug`, `title`, `context`, `date`, `summary`, `sections`, `skills` |
| [data/questions.json](data/questions.json) | Know Me Better questions: `id`, `question`, `answer`, `category`, `createdAt` |

Both contact forms validate on the server in [lib/contact.ts](lib/contact.ts). The server-action form (`/contact-me-server-form`) submits through [app/contact-me-server-form/actions.ts](app/contact-me-server-form/actions.ts); the fetch form (`/contact-me`) posts to `/api/contact`. Blog and project slugs are generated from the title once at creation and never change, so URLs stay stable. The data folder and files are created automatically if they are missing.

## Interview agenda (localStorage)

On `/know-me-better`, a recruiter can add questions to an agenda with per-question notes (300 chars), a preferred time, and a timezone. It is saved only in the visitor's browser via [lib/agenda-storage.ts](lib/agenda-storage.ts) under the storage key `portfolio-interview-agenda`, and is never sent to the server on its own. Missing, corrupted, or unavailable storage falls back to an empty agenda. Agenda entries whose question no longer exists are dropped automatically. "Request this call" opens `/contact-me?message=...` with the questions, notes, and preferred time prefilled.

## Component structure

- `components/PageContainer.tsx` — max-width page wrapper; `components/SectionHeading.tsx` — shared small heading
- `components/PostList.tsx` + `components/BlogCard.tsx` + [lib/use-posts.ts](lib/use-posts.ts) — blog list for `/blogs` (public variant) and `/admin/blogs` (admin variant with action buttons passed in)
- `components/ProjectCard.tsx` — project list card; `components/StatCard.tsx` — stat cards on the home and project pages
- `components/QuestionCard.tsx` — purely presentational Q&A card; `components/KnowMeBetter.tsx` — the parent that fetches `/api/questions` and owns the agenda
- `components/FormUI.tsx` — shared `FormField` (input, textarea, or select) and button/status classes; [lib/submit-json.ts](lib/submit-json.ts) — `submitJson` (POST) and `sendJson` (PUT/DELETE) helpers
- Admin: `components/BlogAdmin.tsx`, `components/MessagesAdmin.tsx`, `components/ProjectsAdmin.tsx`, `components/QuestionsAdmin.tsx`
- `lib/category-styles.ts` — the one place mapping question categories to badge/button colors

## Getting Started

Requires Node.js 18.18 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # run ESLint
```

## Known limits

- **No login.** The admin pages and all write APIs are open to anyone with the URL.
- **JSON file storage.** There is no database; the write queue prevents lost updates within one server process, not across processes or machines.
- **Not-found status codes.** `/blogs/[slug]` renders its not-found view in the browser and returns HTTP 200; `/project/[slug]` renders the not-found page on the server but also returns 200, because Cache Components streams the shell first.
- **Agenda is per browser.** The localStorage agenda lives in one browser on one device; clearing site data clears it.

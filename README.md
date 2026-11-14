# Personal Portfolio

Personal portfolio site for Bhoomi Oza, built with [Next.js](https://nextjs.org) (App Router), TypeScript, and Tailwind CSS.

## Pages & Routes

| Route | Page |
| --- | --- |
| `/` | Home — intro and highlights |
| `/about-me` | About Me — education, experience, and skills |
| `/projects` | Projects — list of projects |
| `/project/[slug]` | Project case study (e.g. `/project/tiers-of-service-intake-framework`) |
| `/blogs` | Blog — index of posts, loaded from the posts API |
| `/blogs/[slug]` | Blog post reader |
| `/contact-me-server-form` | Contact — form handled by a Next.js server action |
| `/contact-me` | Contact — form posting with `fetch` |
| `/admin/blogs` | Admin — create blog posts (not linked in the navigation) |

Unknown URLs show a custom 404 page.

## API Endpoints

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/contact` | `POST` | Validates a contact submission (`name`, `email`, `message`) and appends it to `data/messages.json`. Returns `201` on success, `400` with field errors, `500` on save failure. |
| `/api/blogs` | `GET` | Returns all posts, newest first (`Cache-Control: no-store`). |
| `/api/blogs` | `POST` | Creates a post (`title`, `author`, `content`); the slug is generated from the title. Returns `201` with the post, `400` with field errors, `409` if the slug already exists, `500` on save failure. |

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

## Forms & Data

Both contact forms validate input on the server in [lib/contact.ts](lib/contact.ts). The server-action form (`/contact-me-server-form`) submits through [app/contact-me-server-form/actions.ts](app/contact-me-server-form/actions.ts); the fetch form (`/contact-me`) posts to `/api/contact`. Valid submissions are appended to [data/messages.json](data/messages.json) as JSON records with a timestamp.

Blog posts are validated and saved in [lib/blogs.ts](lib/blogs.ts) and stored in [data/blogs.json](data/blogs.json). Slugs are generated from the title and must be unique. The data folder and files are created automatically if they are missing.

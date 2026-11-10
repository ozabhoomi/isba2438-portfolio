# Personal Portfolio

Personal portfolio site for Bhoomi Oza, built with [Next.js](https://nextjs.org) (App Router), TypeScript, and Tailwind CSS.

## Pages & Routes

| Route | Page |
| --- | --- |
| `/` | Home — intro and highlights |
| `/about-me` | About Me — education, experience, and skills |
| `/projects` | Projects — list of projects |
| `/project/[slug]` | Project case study (e.g. `/project/tiers-of-service-intake-framework`) |
| `/contact-me-server-form` | Contact — form handled by a Next.js server action |

Unknown URLs show a custom 404 page.

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

## Contact Form

The contact form submits through a [server action](app/contact-me-server-form/actions.ts). Input is validated in [lib/contact.ts](lib/contact.ts), and each valid submission is appended to [data/messages.json](data/messages.json) as a JSON record with a timestamp. The data folder and file are created automatically if they are missing.

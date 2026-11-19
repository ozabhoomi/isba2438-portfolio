import Link from "next/link";
import ProfilePhoto from "@/components/ProfilePhoto";

const highlights = [
  {
    stat: "M.S.",
    label: "Business Analytics, Santa Clara University",
  },
  {
    stat: "3.96",
    label: "GPA, with Dean’s List honors (2x)",
  },
  {
    stat: "2.3 years",
    label: "Business and management consulting experience",
  },
];

const contactLinks = [
  { label: "Email", href: "mailto:ozabhoomi06@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/bhoomi-ozaa/" },
  { label: "GitHub", href: "https://github.com/ozabhoomi" },
  {
    label: "Tableau",
    href: "https://public.tableau.com/app/profile/bhoomi.oza/vizzes",
  },
];

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-24 sm:py-32">
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div>
            <p className="font-mono text-sm text-aubergine/75">
              Data &amp; Business Analytics · Santa Clara, CA
            </p>
            <h1 className="mt-6 font-serif text-6xl font-semibold leading-none tracking-tight sm:text-7xl">
              Bhoomi Oza
            </h1>
          </div>
          <div className="shrink-0 self-center lg:self-auto">
            <ProfilePhoto />
          </div>
        </div>

        <div className="mt-12 max-w-2xl">
          <p className="text-lg leading-8 text-aubergine/85">
            I’m finishing my M.S. in Business Analytics at Santa Clara
            University with a 3.96 GPA. My path started in science. I earned a
            bachelor’s and a master’s in biotechnology in Mumbai, then moved
            into consulting, where I spent over two years doing market research
            and competitive intelligence. I came to Santa Clara to build
            stronger analytical and technical skills, and I now use them as a
            Data Insights Intern on the Global People Services team at
            CooperVision.
          </p>
          <p className="mt-6 text-lg leading-8 text-aubergine/85">
            I was born and raised in Mumbai and moved to the US for higher
            education. Studying in a new country taught me about different
            cultures and broadened how I see the world.
          </p>
          <p className="mt-6 text-lg leading-8 text-aubergine/85">
            Outside of work, I’m a trained Indian classical dancer. I’ve danced
            for over 13 years, and I teach the art form to underprivileged
            students.
          </p>
          <p className="mt-6 text-lg leading-8 text-aubergine/85">
            I’m interested in data and business analysis, product roles, and
            consulting roles.
          </p>
          <div className="mt-10">
            <Link
              href="/about-me"
              className="inline-block rounded-full bg-aubergine px-7 py-3 text-base font-medium text-ivory transition-colors hover:bg-aubergine-deep"
            >
              More about me
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-5 pb-28 sm:grid-cols-3">
        {highlights.map((item) => (
          <div
            key={item.stat}
            className="rounded-2xl border border-aubergine/10 bg-blush p-8"
          >
            <p className="font-serif text-5xl font-semibold text-saffron">
              {item.stat}
            </p>
            <p className="mt-3 text-sm leading-6 text-aubergine/85">
              {item.label}
            </p>
          </div>
        ))}
      </section>

      <section className="pb-28">
        <h2 className="text-3xl font-semibold tracking-tight">Contact me</h2>
        <p className="mt-3 max-w-2xl text-aubergine/85">
          The best way to reach me is email. You can also find me here.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          {contactLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full border border-aubergine/25 px-6 py-3 text-base font-medium transition-colors hover:border-aubergine hover:bg-blush"
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

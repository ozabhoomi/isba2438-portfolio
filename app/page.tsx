import Link from "next/link";

const highlights = [
  {
    stat: "32%",
    label: "cut in ad hoc request workload from the Tiers of Service intake framework I designed and piloted",
  },
  {
    stat: "90+",
    label: "HR stakeholders relying on the 6+ workforce dashboards I build and refresh every week",
  },
  {
    stat: "3.96",
    label: "GPA in the M.S. Business Analytics program at Santa Clara University, with Dean's List honors (2x)",
  },
];

const links = [{ label: "Email", href: "mailto:ozabhoomi06@gmail.com" }];

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-20">
        <p className="font-mono text-sm text-zinc-500 dark:text-zinc-400">
          Data &amp; Business Analytics · Santa Clara, CA
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          I turn messy data into decisions leaders act on.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          I&apos;m Bhoomi Oza — an M.S. Business Analytics candidate at Santa
          Clara University, currently on the Global People Services team at
          CooperVision. I own the intake framework that cut ad hoc request load
          32%, build the workforce dashboards 90+ HR stakeholders rely on
          weekly, and prepare talent insights for reports presented to the CEO
          and Board. Teams count on me to own a process end to end — and
          deliver, week after week.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium transition-colors hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/about-me"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            More about me
          </Link>
        </div>
      </section>

      <section className="grid gap-4 pb-24 sm:grid-cols-3">
        {highlights.map((item) => (
          <div
            key={item.stat}
            className="rounded-xl border border-zinc-200 p-5 dark:border-zinc-800"
          >
            <p className="font-mono text-2xl font-semibold">{item.stat}</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {item.label}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

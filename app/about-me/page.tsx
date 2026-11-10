import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me | Bhoomi Oza",
};

const education = [
  {
    school: "Santa Clara University, Leavey School of Business",
    location: "Santa Clara, CA",
    degree: "M.S. Business Analytics",
    date: "Expected December 2026",
    details: [
      "GPA: 3.96 · Dean's List (2x)",
      "Relevant Coursework: Machine Learning, SQL, Supply-Chain Analytics, AI-Assisted Software Development (PRDs, Next.js)",
    ],
  },
  {
    school: "Mithibai College, Chauhan Institute of Science, University of Mumbai",
    location: "Mumbai, India",
    degree: "M.Sc. Biotechnology, 2022 · B.Sc. Biotechnology, 2020",
    date: "",
    details: [],
  },
];

const experience = [
  {
    role: "Data Insights Intern",
    company: "CooperVision · Global People Services Team",
    location: "San Ramon, CA",
    date: "June 2026 – Present",
    bullets: [
      "Designed and piloted a Tiers of Service intake framework, contributing to a 32% reduction in ad hoc request workload and increasing capacity for strategic analytics",
      "Built 6+ workforce analytics dashboards used by 90+ HR stakeholders to track talent acquisition, talent health, organizational structure, and AI adoption",
      "Prepared workforce metrics and talent insights for executive reports presented to the CEO, COO, and Board, highlighting organizational trends and talent priorities",
      "Refresh dashboards weekly using Tableau, Excel, and Power Query, delivering targeted insights on succession planning, performance ratings, and engagement to HR leaders and HR Business Partners",
    ],
  },
  {
    role: "Business Analytics Intern (Student Practicum)",
    company: "Box · Customer Success Team",
    location: "Remote, US",
    date: "January 2026 – May 2026",
    bullets: [
      "Analyzed feature adoption, engagement, and retention patterns across SaaS accounts using logistic regression, XGBoost, and K-means clustering to identify user segments, churn risks, and adoption opportunities",
      "Presented customer segmentation and engagement recommendations to the Customer Success team to inform product adoption and retention strategies",
    ],
  },
  {
    role: "Research Analyst",
    company: "Argus Media · Consulting Division",
    location: "Mumbai, India",
    date: "January 2023 – August 2024",
    bullets: [
      "Conducted market research and forecasting across energy and commodity markets, translating pricing, supply-demand dynamics, and trade data into insights for market intelligence reports",
      "Developed time-series forecasts, market scenarios, and DCF models to evaluate price outlooks and project feasibility",
      "Represented Research and Consulting on a cross-functional team with Data Science and Market Reporting to build an R Shiny forecasting dashboard with adjustable market-scenario parameters",
      "Automated reporting workflows in R, saving the consulting team ~10 hours per week",
    ],
  },
  {
    role: "Analyst",
    company: "Axience Consulting",
    location: "Mumbai, India",
    date: "May 2022 – December 2022",
    bullets: [
      "Delivered competitive intelligence and market benchmarking across 5+ consulting engagements to inform client portfolio and market positioning decisions; received the “Outstanding Contribution – Individual” award",
    ],
  },
];

const skillGroups = [
  {
    label: "Programming & Development",
    skills: [
      "SQL",
      "PostgreSQL",
      "Python (pandas, scikit-learn, XGBoost, gurobipy)",
      "R (tidyverse, Shiny)",
      "Git",
    ],
  },
  {
    label: "Visualization & Reporting",
    skills: ["Tableau", "Power BI", "Excel", "Power Query"],
  },
  {
    label: "Analytics & Product",
    skills: [
      "Forecasting",
      "Predictive Modeling",
      "Machine Learning",
      "KPI Development",
      "Cohort Analysis",
      "Statistical Methods",
    ],
  },
];

const sectionHeading =
  "text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400";

export default function AboutMe() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-16">
        <h1 className="text-4xl font-semibold tracking-tight">About me</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Business analytics rooted in science — trained in biotechnology,
          sharpened in consulting, and currently building people analytics at
          CooperVision while finishing my M.S. at Santa Clara University.
        </p>
      </section>

      <section className="py-12">
        <h2 className={sectionHeading}>Education</h2>
        <div className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
          {education.map((item) => (
            <div key={item.school} className="py-6 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-medium">{item.school}</h3>
                <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {item.location}
                </p>
              </div>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {item.degree}
                {item.date && (
                  <span className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    {"  ·  "}
                    {item.date}
                  </span>
                )}
              </p>
              {item.details.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-600 marker:text-zinc-400 dark:text-zinc-400">
                  {item.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <h2 className={sectionHeading}>Experience</h2>
        <div className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800">
          {experience.map((job) => (
            <div key={job.company} className="py-6 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="font-medium">
                  {job.role}
                  <span className="font-normal text-zinc-500 dark:text-zinc-400">
                    {" "}
                    · {job.company}
                  </span>
                </h3>
                <p className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                  {job.date} · {job.location}
                </p>
              </div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-600 marker:text-zinc-400 dark:text-zinc-400">
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 pb-24">
        <h2 className={sectionHeading}>Skills</h2>
        <div className="mt-6 flex flex-col gap-6">
          {skillGroups.map((group) => (
            <div
              key={group.label}
              className="grid gap-3 sm:grid-cols-[14rem_1fr] sm:gap-6"
            >
              <h3 className="text-sm font-medium">{group.label}</h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

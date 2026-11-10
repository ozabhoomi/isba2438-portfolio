export type ProjectSection = {
  heading: string;
  body?: string[];
  bullets?: string[];
  stat?: { value: string; label: string };
};

export type Project = {
  slug: string;
  title: string;
  context: string;
  date: string;
  summary: string;
  sections: ProjectSection[];
  skills: string[];
};

export const projects: Project[] = [
  {
    slug: "tiers-of-service-intake-framework",
    title: "Global People Services Tiers of Service Project",
    context: "CooperVision · Global People Services Team",
    date: "June 2026 – Present",
    summary:
      "Designed, secured approval for, and launched a tiered service framework covering all analytics and reporting requests across the Global People Services team — reducing workload 32% through a self-service analytics model.",
    sections: [
      {
        heading: "Overview",
        body: [
          "The Tiers of Service project introduced a tiered service framework to handle all ad hoc as well as recurring analytics and data reporting requests within the Global People Services (GPS) team at CooperVision.",
        ],
      },
      {
        heading: "The Problem",
        body: [
          "The GPS team currently handles 3,250+ reports — including recurrences and versions of reports — along with ~370 unique analytical reports. With HR access expanding, the team needed a structured way to manage that volume.",
        ],
      },
      {
        heading: "What I Did",
        bullets: [
          "Designed the tiered service framework covering all ad hoc and recurring analytics and data reporting requests",
          "Handled triaging of requests coming into the team",
          "Designed a self-service model with ready-to-use reports and dashboards that reduces the burden on the team",
          "Aligned reports to business priorities and strategic analysis, enabling more predictive analytics",
        ],
      },
      {
        heading: "Piloting the Framework",
        body: [
          "I piloted the framework internally within Tiers of Service, collecting feedback along the way and working on incorporating it into the framework.",
        ],
      },
      {
        heading: "Launch",
        body: [
          "After securing approval from the HR ELT team, I launched Tiers of Service for the GPS team.",
        ],
      },
      {
        heading: "Result",
        body: ["Introducing Tiers of Service reduced the team's workload by 32%."],
        stat: {
          value: "32%",
          label: "reduction in team workload after introducing Tiers of Service",
        },
      },
    ],
    skills: ["KPI Development", "Tableau"],
  },
  {
    slug: "sales-forecasting-analytics-showdown",
    title: "Sales Forecasting & Marketing Analytics",
    context: "2nd Place · Analytics Showdown Competition",
    date: "November 2025",
    summary:
      "Built an XGBoost model with engineered features to forecast sales from historical trends, promotional activity, and ad spend, supporting sales planning and marketing analysis.",
    sections: [
      {
        heading: "Overview",
        body: [
          "An Analytics Showdown competition project: build a machine learning model that forecasts sales to support sales planning and marketing analysis.",
        ],
      },
      {
        heading: "The Problem",
        body: ["Forecast sales from historical trends, promotional activity, and ad spend."],
      },
      {
        heading: "What I Did",
        bullets: [
          "Built an XGBoost model to forecast sales",
          "Engineered features from historical sales patterns, promotional activity, and advertising spend as model inputs",
        ],
      },
      {
        heading: "Result",
        body: ["The project earned 2nd place in the Analytics Showdown Competition."],
        stat: {
          value: "2nd",
          label: "place · Analytics Showdown Competition, November 2025",
        },
      },
    ],
    skills: ["Python", "XGBoost", "scikit-learn", "Forecasting"],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

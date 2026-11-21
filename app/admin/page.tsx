import type { Metadata } from "next";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";

export const metadata: Metadata = {
  title: "Admin | Bhoomi Oza",
  robots: { index: false },
};

const adminSections = [
  {
    href: "/admin/blogs",
    title: "Blogs",
    description: "Create, edit, and delete the blog posts shown on the blog.",
  },
  {
    href: "/admin/messages",
    title: "Messages",
    description:
      "Read the messages from the contact forms, edit them, mark them handled, or delete them.",
  },
  {
    href: "/admin/projects",
    title: "Projects",
    description:
      "Create, edit, and delete the projects shown on the projects page.",
  },
  {
    href: "/admin/questions",
    title: "Questions",
    description:
      "Create, edit, and delete the questions on the Know Me Better page.",
  },
];

export default function AdminPage() {
  return (
    <PageContainer>
      <section className="py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Admin</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-aubergine/85">
          Manage everything visitors see on the site.
        </p>
        <p className="mt-3 max-w-2xl rounded-lg border border-saffron/40 bg-blush px-4 py-3 text-sm leading-6 text-aubergine">
          Note: these admin pages have no login. Anyone with the URL can view
          and change the content.
        </p>

        <div className="mt-10 flex flex-col gap-4">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="flex flex-col gap-1 rounded-xl border border-aubergine/15 p-6 transition-colors hover:border-saffron"
            >
              <h2 className="font-medium">{section.title}</h2>
              <p className="font-mono text-xs text-aubergine/75">
                {section.href}
              </p>
              <p className="mt-1 text-sm leading-6 text-aubergine/85">
                {section.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}

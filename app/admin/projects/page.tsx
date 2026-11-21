import type { Metadata } from "next";
import ProjectsAdmin from "@/components/ProjectsAdmin";
import PageContainer from "@/components/PageContainer";

export const metadata: Metadata = {
  title: "Admin · Projects | Bhoomi Oza",
  robots: { index: false },
};

export default function AdminProjectsPage() {
  return (
    <PageContainer>
      <section className="py-16">
        <h1 className="text-4xl font-semibold tracking-tight">
          Admin · Projects
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-aubergine/85">
          Create, edit, and delete the projects shown on the projects page.
        </p>
        <ProjectsAdmin />
      </section>
    </PageContainer>
  );
}

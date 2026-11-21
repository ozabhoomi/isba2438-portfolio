import type { Metadata } from "next";
import QuestionsAdmin from "@/components/QuestionsAdmin";
import PageContainer from "@/components/PageContainer";

export const metadata: Metadata = {
  title: "Admin · Questions | Bhoomi Oza",
  robots: { index: false },
};

export default function AdminQuestionsPage() {
  return (
    <PageContainer>
      <section className="py-16">
        <h1 className="text-4xl font-semibold tracking-tight">
          Admin · Questions
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-aubergine/85">
          Create, edit, and delete the questions shown on the Know Me Better
          page.
        </p>
        <QuestionsAdmin />
      </section>
    </PageContainer>
  );
}

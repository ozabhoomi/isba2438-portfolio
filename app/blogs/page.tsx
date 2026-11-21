import type { Metadata } from "next";
import PageContainer from "@/components/PageContainer";
import PostList from "@/components/PostList";

export const metadata: Metadata = {
  title: "Blog | Bhoomi Oza",
};

export default function BlogsPage() {
  return (
    <PageContainer>
      <section className="py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-aubergine/85">
          Thoughts and write-ups, served fresh from the posts API.
        </p>
        <PostList variant="public" />
      </section>
    </PageContainer>
  );
}

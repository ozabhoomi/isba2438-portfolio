import type { Metadata } from "next";
import BlogIndex from "@/components/BlogIndex";

export const metadata: Metadata = {
  title: "Blog | Bhoomi Oza",
};

export default function BlogsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-aubergine/85">
          Thoughts and write-ups, served fresh from the posts API.
        </p>
        <BlogIndex />
      </section>
    </div>
  );
}

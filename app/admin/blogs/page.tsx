import type { Metadata } from "next";
import BlogAdmin from "@/components/BlogAdmin";

export const metadata: Metadata = {
  title: "Admin · Blogs | Bhoomi Oza",
  robots: { index: false },
};

export default function AdminBlogsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Admin · Blogs</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-aubergine/85">
          Create blog posts and review the ones already published. Posts appear
          newest first, same order the API returns them.
        </p>
        <BlogAdmin />
      </section>
    </div>
  );
}

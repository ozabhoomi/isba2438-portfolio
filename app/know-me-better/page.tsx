import type { Metadata } from "next";
import KnowMeBetter from "@/components/KnowMeBetter";

export const metadata: Metadata = {
  title: "Know Me Better | Bhoomi Oza",
};

export default function KnowMeBetterPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-16">
        <h1 className="text-4xl font-semibold tracking-tight">
          Know me better
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-aubergine/85">
          Questions recruiters usually ask, with my answers. Pick a category,
          then tap a question to read it.
        </p>
        <KnowMeBetter />
      </section>
    </div>
  );
}

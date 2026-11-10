import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Bhoomi Oza",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Contact</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          Want to talk data, analytics, or opportunities? Send a message and it
          lands in my message log — I read every one.
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}

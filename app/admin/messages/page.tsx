import type { Metadata } from "next";
import MessagesAdmin from "@/components/MessagesAdmin";

export const metadata: Metadata = {
  title: "Admin · Messages | Bhoomi Oza",
  robots: { index: false },
};

export default function AdminMessagesPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-16">
        <h1 className="text-4xl font-semibold tracking-tight">
          Admin · Messages
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-aubergine/85">
          Messages sent through the contact forms, newest first. Edit them,
          mark them as handled, or delete them.
        </p>
        <MessagesAdmin />
      </section>
    </div>
  );
}

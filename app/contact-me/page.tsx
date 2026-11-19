import type { Metadata } from "next";
import ContactFormApi from "@/components/ContactFormApi";

export const metadata: Metadata = {
  title: "Contact | Bhoomi Oza",
};

export default function ContactApiPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      <section className="py-16">
        <h1 className="text-4xl font-semibold tracking-tight">Contact</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-aubergine/85">
          Another way to reach me — this form sends your message through the
          /api/contact endpoint.
        </p>
        <div className="mt-8">
          <ContactFormApi />
        </div>
      </section>
    </div>
  );
}

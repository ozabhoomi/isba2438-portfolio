"use client";

import { useActionState } from "react";
import type { ContactFormState } from "@/lib/contact";
import { submitContact } from "@/app/contact-me-server-form/actions";

const initialContactFormState: ContactFormState = {
  status: "idle",
  errors: {},
};

const labelClass = "text-sm font-medium";
const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-400";
const errorClass = "text-sm text-red-600 dark:text-red-400";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContact,
    initialContactFormState
  );

  return (
    <form
      key={state.submittedAt ?? "fresh"}
      action={formAction}
      noValidate
      className="flex w-full max-w-md flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          maxLength={200}
          placeholder="Your name"
          className={inputClass}
        />
        {state.errors.name && <p className={errorClass}>{state.errors.name}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          maxLength={200}
          placeholder="you@example.com"
          className={inputClass}
        />
        {state.errors.email && (
          <p className={errorClass}>{state.errors.email}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className={labelClass}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="What's on your mind?"
          rows={4}
          maxLength={5000}
          className={inputClass}
        />
        {state.errors.message && (
          <p className={errorClass}>{state.errors.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {pending ? "Sending..." : "Send message"}
      </button>

      {state.formError && <p className={errorClass}>{state.formError}</p>}
      {state.status === "success" && (
        <p role="status" className="text-sm text-emerald-600 dark:text-emerald-400">
          Thanks! Your message was sent successfully.
        </p>
      )}
    </form>
  );
}

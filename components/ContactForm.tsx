"use client";

import { useActionState } from "react";
import { CONTACT_LIMITS } from "@/lib/limits";
import type { ContactFormState } from "@/lib/contact";
import { submitContact } from "@/app/contact-me-server-form/actions";
import FormField, {
  errorClass,
  successClass,
  submitButtonClass,
} from "./FormUI";

const initialContactFormState: ContactFormState = {
  status: "idle",
  errors: {},
};

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
      <FormField
        id="name"
        label="Name"
        placeholder="Your name"
        maxLength={CONTACT_LIMITS.name}
        error={state.errors.name}
      />
      <FormField
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        maxLength={CONTACT_LIMITS.email}
        error={state.errors.email}
      />
      <FormField
        id="message"
        label="Message"
        placeholder="What's on your mind?"
        maxLength={CONTACT_LIMITS.message}
        rows={4}
        error={state.errors.message}
      />
      <button type="submit" disabled={pending} className={submitButtonClass}>
        {pending ? "Sending..." : "Send message"}
      </button>
      {state.formError && <p className={errorClass}>{state.formError}</p>}
      {state.status === "success" && (
        <p role="status" className={successClass}>
          Thanks! Your message was sent successfully.
        </p>
      )}
    </form>
  );
}

"use client";

import { useState } from "react";
import { CONTACT_LIMITS } from "@/lib/limits";
import type { ContactErrors } from "@/lib/contact";
import FormField, {
  errorClass,
  successClass,
  submitButtonClass,
} from "./FormUI";
import { submitJson } from "@/lib/submit-json";

export default function ContactFormApi() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message"),
    };

    setSending(true);
    setErrors({});
    setSuccess(false);
    setRequestError(null);

    const result = await submitJson<ContactErrors>("/api/contact", payload);

    setSending(false);

    if (result.kind === "created") {
      setSuccess(true);
      form.reset();
      return;
    }
    if (result.kind === "invalid") {
      setErrors(result.errors);
      return;
    }
    setRequestError(result.message);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full max-w-md flex-col gap-4"
    >
      <FormField
        id="name"
        label="Name"
        placeholder="Your name"
        maxLength={CONTACT_LIMITS.name}
        error={errors.name}
      />
      <FormField
        id="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        maxLength={CONTACT_LIMITS.email}
        error={errors.email}
      />
      <FormField
        id="message"
        label="Message"
        placeholder="What's on your mind?"
        maxLength={CONTACT_LIMITS.message}
        rows={4}
        error={errors.message}
      />
      <button type="submit" disabled={sending} className={submitButtonClass}>
        {sending ? "Sending..." : "Send message"}
      </button>
      {requestError && (
        <p role="alert" className={errorClass}>
          {requestError}
        </p>
      )}
      {success && (
        <p role="status" className={successClass}>
          Thanks! Your message was sent successfully.
        </p>
      )}
    </form>
  );
}

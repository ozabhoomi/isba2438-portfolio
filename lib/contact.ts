import { randomUUID } from "node:crypto";
import { CONTACT_LIMITS } from "./limits";
import { updateJsonArray } from "./json-store";

export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export type ContactFormState = {
  status: "idle" | "success" | "error";
  errors: ContactErrors;
  formError?: string;
  submittedAt?: number;
};

export type ContactValidationResult =
  | { ok: true; values: ContactInput }
  | { ok: false; errors: ContactErrors };

export type StoredMessage = ContactInput & {
  id: string;
  receivedAt: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s.@]+(\.[^\s.@]+)+$/;

export function validateContact(input: unknown): ContactValidationResult {
  const errors: ContactErrors = {};
  const { name, email, message } = (input ?? {}) as Record<string, unknown>;

  const nameValue = typeof name === "string" ? name.trim() : "";
  const emailValue = typeof email === "string" ? email.trim() : "";
  const messageValue = typeof message === "string" ? message.trim() : "";

  if (!nameValue) {
    errors.name = "Name can't be blank.";
  }
  if (!messageValue) {
    errors.message = "Message can't be blank.";
  }

  if (!emailValue) {
    errors.email = "Email can't be blank.";
  } else if (!EMAIL_PATTERN.test(emailValue)) {
    errors.email =
      "Enter a valid email: exactly one @, something before it, a domain with a dot that has text on both sides, and no spaces.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    values: {
      name: nameValue.slice(0, CONTACT_LIMITS.name),
      email: emailValue.slice(0, CONTACT_LIMITS.email),
      message: messageValue.slice(0, CONTACT_LIMITS.message),
    },
  };
}

export async function saveContactMessage(values: ContactInput): Promise<void> {
  const message: StoredMessage = {
    id: randomUUID(),
    ...values,
    receivedAt: new Date().toISOString(),
  };

  await updateJsonArray<StoredMessage>("messages.json", (messages) => [
    ...messages,
    message,
  ]);
}

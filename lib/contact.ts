import { randomUUID } from "node:crypto";
import { CONTACT_LIMITS } from "./limits";
import { readJsonArray, updateJsonArray } from "./json-store";

export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactStatus = "new" | "handled";

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
  status: ContactStatus;
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
    status: "new",
  };

  await updateJsonArray<StoredMessage>("messages.json", (messages) => [
    ...messages,
    message,
  ]);
}

export function readContactMessages(): Promise<StoredMessage[]> {
  return readJsonArray<StoredMessage>("messages.json");
}

export async function getContactMessagesNewestFirst(): Promise<
  StoredMessage[]
> {
  const messages = await readContactMessages();
  return messages
    .map((message, index) => ({ message, index }))
    .sort((a, b) => {
      if (a.message.receivedAt === b.message.receivedAt) {
        return b.index - a.index;
      }
      return a.message.receivedAt < b.message.receivedAt ? 1 : -1;
    })
    .map((entry) => entry.message);
}

export async function getContactMessageById(
  id: string
): Promise<StoredMessage | undefined> {
  const messages = await readContactMessages();
  return messages.find((message) => message.id === id);
}

export async function updateContactMessage(
  id: string,
  values: ContactInput,
  status: ContactStatus
): Promise<StoredMessage | undefined> {
  let updated: StoredMessage | undefined;
  await updateJsonArray<StoredMessage>("messages.json", (messages) =>
    messages.map((message) => {
      if (message.id !== id) {
        return message;
      }
      updated = {
        ...message,
        name: values.name,
        email: values.email,
        message: values.message,
        status,
      };
      return updated;
    })
  );
  return updated;
}

export async function deleteContactMessage(
  id: string
): Promise<StoredMessage | undefined> {
  let deleted: StoredMessage | undefined;
  await updateJsonArray<StoredMessage>("messages.json", (messages) => {
    const target = messages.find((message) => message.id === id);
    if (!target) {
      return messages;
    }
    deleted = target;
    return messages.filter((message) => message.id !== id);
  });
  return deleted;
}

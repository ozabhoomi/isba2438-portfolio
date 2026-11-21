"use client";

import { useEffect, useState } from "react";
import { CONTACT_LIMITS } from "@/lib/limits";
import type {
  ContactErrors,
  ContactStatus,
  StoredMessage,
} from "@/lib/contact";
import FormField, {
  errorClass,
  submitButtonClass,
  successClass,
} from "./FormUI";
import SectionHeading from "./SectionHeading";
import { sendJson } from "@/lib/submit-json";

const actionButtonClass =
  "rounded-full border border-aubergine/25 px-4 py-1.5 text-sm font-medium transition-colors hover:border-aubergine hover:bg-blush";
const deleteButtonClass =
  "rounded-full border border-red-600/30 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:border-red-600 hover:bg-red-50";
const cancelButtonClass =
  "rounded-full border border-aubergine/25 px-5 py-3 text-base font-medium transition-colors hover:border-aubergine hover:bg-blush disabled:opacity-50";

function statusBadgeClass(status: ContactStatus): string {
  return status === "handled"
    ? "border-emerald-600/30 text-emerald-700"
    : "border-saffron/50 text-saffron";
}

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<StoredMessage[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [editing, setEditing] = useState<StoredMessage | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/contact")
      .then((res) => {
        if (!res.ok) throw new Error("list request failed");
        return res.json() as Promise<{ messages?: StoredMessage[] }>;
      })
      .then((body) => {
        if (cancelled) return;
        setMessages(body.messages ?? []);
        setListError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setListError("Couldn't load messages. Please refresh the page.");
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  function startEdit(message: StoredMessage) {
    setEditing(message);
    setErrors({});
    setSuccess(null);
    setRequestError(null);
    setFormKey((key) => key + 1);
  }

  function exitEditMode() {
    setEditing(null);
    setFormKey((key) => key + 1);
  }

  function cancelEdit() {
    setEditing(null);
    setErrors({});
    setSuccess(null);
    setRequestError(null);
    setFormKey((key) => key + 1);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) {
      return;
    }
    const data = new FormData(event.currentTarget);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message"),
      status: editing.status,
    };

    setSending(true);
    setErrors({});
    setSuccess(null);
    setRequestError(null);

    const result = await sendJson<ContactErrors>(
      "PUT",
      `/api/contact/${editing.id}`,
      payload
    );

    setSending(false);

    if (result.kind === "ok") {
      setSuccess("Changes saved.");
      exitEditMode();
      setRefreshKey((key) => key + 1);
      return;
    }
    if (result.kind === "invalid") {
      setErrors(result.errors);
      return;
    }
    if (result.kind === "notFound") {
      setRequestError(result.message);
      exitEditMode();
      setRefreshKey((key) => key + 1);
      return;
    }
    setRequestError(result.message);
  }

  async function handleToggle(message: StoredMessage) {
    const nextStatus: ContactStatus =
      message.status === "new" ? "handled" : "new";
    setSuccess(null);
    setRequestError(null);

    const result = await sendJson<ContactErrors>(
      "PUT",
      `/api/contact/${message.id}`,
      {
        name: message.name,
        email: message.email,
        message: message.message,
        status: nextStatus,
      }
    );

    if (result.kind === "ok") {
      setSuccess(
        nextStatus === "handled"
          ? "Message marked as handled."
          : "Message marked as new."
      );
      if (editing?.id === message.id) {
        exitEditMode();
      }
      setRefreshKey((key) => key + 1);
      return;
    }
    if (result.kind === "notFound") {
      setRequestError(result.message);
      if (editing?.id === message.id) {
        exitEditMode();
      }
      setRefreshKey((key) => key + 1);
      return;
    }
    if (result.kind === "failed") {
      setRequestError(result.message);
    }
  }

  async function handleDelete(message: StoredMessage) {
    if (
      !window.confirm(
        `Delete the message from "${message.name}"? This can't be undone.`
      )
    ) {
      return;
    }
    setSuccess(null);
    setRequestError(null);

    const result = await sendJson<ContactErrors>(
      "DELETE",
      `/api/contact/${message.id}`
    );

    if (result.kind === "ok") {
      setSuccess("Message deleted.");
      if (editing?.id === message.id) {
        exitEditMode();
      }
      setRefreshKey((key) => key + 1);
      return;
    }
    if (result.kind === "notFound") {
      setRequestError(result.message);
      if (editing?.id === message.id) {
        exitEditMode();
      }
      setRefreshKey((key) => key + 1);
      return;
    }
    if (result.kind === "failed") {
      setRequestError(result.message);
    }
  }

  return (
    <div className="mt-8">
      {editing && (
        <form
          key={formKey}
          onSubmit={handleSave}
          noValidate
          className="flex w-full max-w-md flex-col gap-4"
        >
          <p className="rounded-lg border border-saffron/40 bg-blush px-3 py-2 text-sm">
            Editing message from “{editing.name}”
          </p>
          <FormField
            id="name"
            label="Name"
            placeholder="Name"
            maxLength={CONTACT_LIMITS.name}
            error={errors.name}
            defaultValue={editing.name}
          />
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="Email"
            maxLength={CONTACT_LIMITS.email}
            error={errors.email}
            defaultValue={editing.email}
          />
          <FormField
            id="message"
            label="Message"
            placeholder="Message"
            maxLength={CONTACT_LIMITS.message}
            rows={4}
            error={errors.message}
            defaultValue={editing.message}
          />
          <div className="flex items-center gap-3">
            <button type="submit" disabled={sending} className={submitButtonClass}>
              {sending ? "Saving..." : "Save changes"}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              disabled={sending}
              className={cancelButtonClass}
            >
              Cancel
            </button>
          </div>
          {requestError && (
            <p role="alert" className={errorClass}>
              {requestError}
            </p>
          )}
          {success && (
            <p role="status" className={successClass}>
              {success}
            </p>
          )}
        </form>
      )}
      {!editing && (requestError || success) && (
        <div className="max-w-md">
          {requestError && (
            <p role="alert" className={errorClass}>
              {requestError}
            </p>
          )}
          {success && (
            <p role="status" className={successClass}>
              {success}
            </p>
          )}
        </div>
      )}

      <section className="mt-10">
        <SectionHeading>All messages</SectionHeading>
        {listError && <p className={`mt-4 ${errorClass}`}>{listError}</p>}
        {messages === null && !listError && (
          <p className="mt-4 text-sm text-aubergine/75">Loading…</p>
        )}
        {messages?.length === 0 && (
          <p className="mt-4 text-sm text-aubergine/75">
            No messages yet. Messages sent through the contact forms will
            appear here.
          </p>
        )}
        {messages && messages.length > 0 && (
          <ul className="mt-4 divide-y divide-aubergine/15">
            {messages.map((message) => (
              <li key={message.id} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="font-medium">{message.name}</h3>
                  <p className="font-mono text-xs text-aubergine/75">
                    {message.receivedAt.slice(0, 10)}
                  </p>
                </div>
                <p className="mt-1 font-mono text-xs text-aubergine/75">
                  {message.email}
                </p>
                <span
                  className={`mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(message.status)}`}
                >
                  {message.status}
                </span>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-aubergine/85">
                  {message.message.length > 280
                    ? `${message.message.slice(0, 280)}…`
                    : message.message}
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => startEdit(message)}
                    className={actionButtonClass}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggle(message)}
                    className={actionButtonClass}
                  >
                    {message.status === "new" ? "Mark handled" : "Mark new"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(message)}
                    className={deleteButtonClass}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

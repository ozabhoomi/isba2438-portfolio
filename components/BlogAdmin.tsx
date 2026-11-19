"use client";

import { useState } from "react";
import { BLOG_LIMITS } from "@/lib/limits";
import type { BlogErrors, BlogPost } from "@/lib/blogs";
import FormField, {
  errorClass,
  submitButtonClass,
  successClass,
} from "./FormUI";
import BlogList from "./BlogList";
import { sendJson, submitJson } from "@/lib/submit-json";

const cancelButtonClass =
  "rounded-full border border-aubergine/25 px-5 py-3 text-base font-medium transition-colors hover:border-aubergine hover:bg-blush disabled:opacity-50";

export default function BlogAdmin() {
  const [errors, setErrors] = useState<BlogErrors>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [formKey, setFormKey] = useState(0);

  function startEdit(post: BlogPost) {
    setEditing(post);
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      title: data.get("title"),
      author: data.get("author"),
      content: data.get("content"),
    };

    setSending(true);
    setErrors({});
    setSuccess(null);
    setRequestError(null);

    const result = editing
      ? await sendJson<BlogErrors>("PUT", `/api/blogs/${editing.id}`, payload)
      : await submitJson<BlogErrors>("/api/blogs", payload);

    setSending(false);

    if (result.kind === "created") {
      setSuccess("Post created successfully.");
      form.reset();
      setRefreshKey((key) => key + 1);
      return;
    }
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

  async function handleDelete(post: BlogPost) {
    if (!window.confirm(`Delete "${post.title}"? This can't be undone.`)) {
      return;
    }
    setSuccess(null);
    setRequestError(null);

    const result = await sendJson<BlogErrors>(
      "DELETE",
      `/api/blogs/${post.id}`
    );

    if (result.kind === "ok") {
      setSuccess("Post deleted.");
      if (editing?.id === post.id) {
        exitEditMode();
      }
      setRefreshKey((key) => key + 1);
      return;
    }
    if (result.kind === "notFound") {
      setRequestError(result.message);
      if (editing?.id === post.id) {
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
      <form
        key={formKey}
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-md flex-col gap-4"
      >
        {editing && (
          <p className="rounded-lg border border-saffron/40 bg-blush px-3 py-2 text-sm">
            Editing “{editing.title}”
          </p>
        )}
        <FormField
          id="title"
          label="Title"
          placeholder="Post title"
          maxLength={BLOG_LIMITS.title}
          error={errors.title}
          defaultValue={editing?.title ?? ""}
        />
        <FormField
          id="author"
          label="Author"
          placeholder="Your name"
          maxLength={BLOG_LIMITS.author}
          error={errors.author}
          defaultValue={editing?.author ?? ""}
        />
        <FormField
          id="content"
          label="Content"
          placeholder="Write your post…"
          maxLength={BLOG_LIMITS.content}
          rows={6}
          error={errors.content}
          defaultValue={editing?.content ?? ""}
        />
        <div className="flex items-center gap-3">
          <button type="submit" disabled={sending} className={submitButtonClass}>
            {sending ? "Saving..." : editing ? "Save changes" : "Create post"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={cancelEdit}
              disabled={sending}
              className={cancelButtonClass}
            >
              Cancel
            </button>
          )}
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
      <BlogList
        refreshKey={refreshKey}
        editingId={editing?.id ?? null}
        onEdit={startEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

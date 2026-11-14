"use client";

import { useState } from "react";
import { BLOG_LIMITS } from "@/lib/limits";
import type { BlogErrors } from "@/lib/blogs";
import FormField, {
  errorClass,
  submitButtonClass,
  successClass,
} from "./FormUI";
import BlogList from "./BlogList";
import { submitJson } from "@/lib/submit-json";

export default function BlogAdmin() {
  const [errors, setErrors] = useState<BlogErrors>({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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

    const result = await submitJson<BlogErrors>("/api/blogs", payload);

    setSending(false);

    if (result.kind === "created") {
      setSuccess("Post created successfully.");
      form.reset();
      setRefreshKey((key) => key + 1);
      return;
    }
    if (result.kind === "invalid") {
      setErrors(result.errors);
      return;
    }
    setRequestError(result.message);
  }

  return (
    <div className="mt-8">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex w-full max-w-md flex-col gap-4"
      >
        <FormField
          id="title"
          label="Title"
          placeholder="Post title"
          maxLength={BLOG_LIMITS.title}
          error={errors.title}
        />
        <FormField
          id="author"
          label="Author"
          placeholder="Your name"
          maxLength={BLOG_LIMITS.author}
          error={errors.author}
        />
        <FormField
          id="content"
          label="Content"
          placeholder="Write your post…"
          maxLength={BLOG_LIMITS.content}
          rows={6}
          error={errors.content}
        />
        <button type="submit" disabled={sending} className={submitButtonClass}>
          {sending ? "Saving..." : "Create post"}
        </button>
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
      <BlogList refreshKey={refreshKey} />
    </div>
  );
}

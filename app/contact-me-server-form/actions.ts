"use server";

import {
  saveContactMessage,
  validateContact,
  type ContactFormState,
} from "@/lib/contact";

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const result = validateContact({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!result.ok) {
    return { status: "error", errors: result.errors };
  }

  try {
    await saveContactMessage(result.values);
  } catch {
    return {
      status: "error",
      errors: {},
      formError: "Something went wrong saving your message. Please try again.",
    };
  }

  return { status: "success", errors: {}, submittedAt: Date.now() };
}

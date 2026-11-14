const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-400";

export const errorClass = "text-sm text-red-600 dark:text-red-400";
export const successClass = "text-sm text-emerald-600 dark:text-emerald-400";
export const submitButtonClass =
  "w-fit rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300";
export const sectionHeadingClass =
  "text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400";

type FormFieldProps = {
  id: string;
  label: string;
  type?: "text" | "email";
  placeholder: string;
  maxLength: number;
  rows?: number;
  error?: string;
};

export default function FormField({
  id,
  label,
  type = "text",
  placeholder,
  maxLength,
  rows,
  error,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {rows ? (
        <textarea
          id={id}
          name={id}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className={inputClass}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          className={inputClass}
        />
      )}
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

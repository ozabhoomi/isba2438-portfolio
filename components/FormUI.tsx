const inputClass =
  "w-full rounded-lg border border-aubergine/15 bg-white px-3 py-2 text-sm outline-none focus:border-saffron";

export const errorClass = "text-sm text-red-600";
export const successClass = "text-sm text-emerald-600";
export const submitButtonClass =
  "w-fit rounded-full bg-aubergine px-6 py-3 text-base font-medium text-ivory transition-colors hover:bg-aubergine-deep disabled:opacity-50";
export const sectionHeadingClass =
  "text-sm font-semibold uppercase tracking-widest text-aubergine/75";

type FormFieldProps = {
  id: string;
  label: string;
  type?: "text" | "email";
  placeholder: string;
  maxLength: number;
  rows?: number;
  error?: string;
  defaultValue?: string;
};

export default function FormField({
  id,
  label,
  type = "text",
  placeholder,
  maxLength,
  rows,
  error,
  defaultValue,
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
          defaultValue={defaultValue}
          className={inputClass}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          defaultValue={defaultValue}
          className={inputClass}
        />
      )}
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}

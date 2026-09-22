import { Fragment, useRef, useState, type FormEvent } from "react";
import { isFieldVisible } from "../lib/forms";
import type { FormDefinition } from "../types/content";

export default function ContentForm({
  definition,
  id,
  successMessage,
  submitClassName = "bg-[#046e00] hover:bg-[#035800]",
}: {
  definition: FormDefinition;
  id: string;
  successMessage: string;
  submitClassName?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{
    message: string;
    error?: boolean;
  } | null>(null);
  const [sending, setSending] = useState(false);
  const submitting = useRef(false);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || submitting.current) return;
    if (!definition.action) {
      if (definition.demoMode) {
        setValues({});
        setStatus({ message: successMessage });
      } else {
        setStatus({
          message:
            "This form is not connected yet. Your details have not been sent.",
          error: true,
        });
      }
      return;
    }
    submitting.current = true;
    setSending(true);
    setStatus({ message: "Sending…" });
    try {
      const response = await fetch(definition.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(String(response.status));
      setValues({});
      setStatus({ message: successMessage });
    } catch {
      setStatus({
        message:
          "Something went wrong sending this. Please try again, or email us if the problem persists.",
        error: true,
      });
    } finally {
      submitting.current = false;
      setSending(false);
    }
  };
  return (
    <form
      id={`${id}-form`}
      action={definition.action || undefined}
      method="post"
      onSubmit={submit}
      className="px-6 py-7 sm:px-8 space-y-5"
    >
      {definition.fields.map((field) => {
        const visible = isFieldVisible(field, definition.fields, values);
        const inputClass =
          "w-full px-4 rounded-none bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#40b830] focus:border-transparent text-sm";
        const common = {
          id: `${id}-${field.name}`,
          name: field.name,
          required: field.required,
          disabled: !visible,
          value: values[field.name] ?? "",
          autoComplete: field.autocomplete,
          placeholder: field.placeholder,
          onChange: (
            event: React.ChangeEvent<
              HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
            >,
          ) =>
            setValues((previous) => ({
              ...previous,
              [field.name]: event.target.value,
            })),
        };
        return (
          <Fragment key={field.name}>
            <div hidden={!visible}>
              <label
                htmlFor={common.id}
                className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#046e00] mb-2"
              >
                {field.label}
                {field.required && (
                  <span className="text-slate-400 font-semibold normal-case tracking-normal">
                    {" "}
                    (required)
                  </span>
                )}
              </label>
              {field.type === "select" ? (
                <select {...common} className={`${inputClass} h-11`}>
                  <option value="">Please choose…</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  {...common}
                  rows={field.rows ?? 4}
                  className={`${inputClass} py-3 resize-y`}
                />
              ) : (
                <input
                  {...common}
                  type={field.type}
                  className={`${inputClass} h-11`}
                />
              )}
            </div>
            {field.name === "payment_method" &&
              visible &&
              definition.payment?.options
                .filter((option) => option.value === values.payment_method)
                .map((option) => (
                  <div
                    key={option.value}
                    className="border border-[#40b830] bg-[#E8F8E5]/40 px-5 py-5"
                  >
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">
                      {option.note}
                    </p>
                    <a
                      href={option.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 w-full h-11 px-6 bg-[#40b830] hover:bg-[#329e24] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-md"
                    >
                      {option.label} ↗
                    </a>
                    <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                      Opens in a new tab. Please still send your details below
                      so we can thank you properly and keep you posted on what
                      your support funded.
                    </p>
                  </div>
                ))}
          </Fragment>
        );
      })}
      <div
        role="status"
        aria-live="polite"
        hidden={!status}
        className={`text-sm px-4 py-3 border ${status?.error ? "bg-red-50 text-red-800 border-red-300" : "bg-[#E8F8E5] text-[#046e00] border-[#40b830]"}`}
      >
        {status?.message}
      </div>
      <button
        type="submit"
        disabled={sending}
        className={`w-full h-11 px-6 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#40b830] disabled:opacity-60 ${submitClassName}`}
      >
        {sending ? "Sending…" : definition.submitLabel}
        <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}

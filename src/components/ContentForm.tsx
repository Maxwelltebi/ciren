import { Fragment, useRef, useState, type FormEvent } from "react";
import { countWords, fieldError, isFieldVisible } from "../lib/forms";
import type { FormDefinition } from "../types/content";
import FormSuccess, { type DoneAction } from "./FormSuccess";

const DEFAULT_SUCCESS = {
  title: "Thank you!",
  message: "We have received your details.",
};

export default function ContentForm({
  definition,
  id,
  done,
  submitClassName = "bg-[#046e00] hover:bg-[#035800]",
}: {
  definition: FormDefinition;
  id: string;
  /** The button on the confirmation shown after a successful send. */
  done: DoneAction;
  submitClassName?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<Record<string, string> | null>(null);
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
        setSent(values);
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
      // URL-encoded rather than multipart: Google Apps Script only parses
      // this format into fields, and it needs no CORS preflight.
      const response = await fetch(definition.action, {
        method: "POST",
        body: new URLSearchParams(
          [...new FormData(form)] as [string, string][],
        ),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(String(response.status));
      // A receiver can answer 200 and still report failure in its JSON.
      const result = await response.json().catch(() => null);
      if (result && result.ok === false) throw new Error(result.error);
      setSent(values);
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
  if (sent) {
    const success = definition.success ?? DEFAULT_SUCCESS;
    const fill = (text: string) =>
      text
        .replace("{name}", (sent.full_name ?? "").trim().split(/\s+/)[0] || "there")
        .replace("{email}", sent.email ?? "your email");
    return (
      <FormSuccess
        id={id}
        title={fill(success.title)}
        message={fill(success.message)}
        done={done}
      />
    );
  }
  return (
    <form
      id={`${id}-form`}
      action={definition.action || undefined}
      method="post"
      onSubmit={submit}
      className="px-6 py-7 sm:px-8 space-y-5"
    >
      {/* Honeypot: bots fill every field in the markup; people never see it.
          It must be display:none, not just moved off-screen, or browser
          autofill fills it and real people get flagged as bots. */}
      <div hidden>
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
      </div>
      {definition.fields.map((field) => {
        const visible = isFieldVisible(field, definition.fields, values);
        const value = values[field.name] ?? "";
        const error = visible ? fieldError(field, values) : "";
        const words = field.minWords || field.maxWords ? countWords(value) : 0;
        const hint =
          field.pattern?.hint &&
          (!field.pattern.when ||
            field.pattern.when.equals.includes(
              values[field.pattern.when.field] ?? "",
            ))
            ? field.pattern.hint
            : "";
        const inputClass =
          "w-full px-4 rounded-none bg-slate-50 text-slate-800 placeholder-slate-400 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#40b830] focus:border-transparent text-sm";
        const common = {
          id: `${id}-${field.name}`,
          name: field.name,
          required: field.required,
          disabled: !visible,
          value,
          // Native validation shows this message and blocks the submit.
          ref: (element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null) =>
            element?.setCustomValidity(error),
          "aria-describedby":
            hint || words || field.minWords ? `${id}-${field.name}-note` : undefined,
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
              {hint && (
                <p
                  id={common["aria-describedby"]}
                  className="text-xs text-slate-500 mt-2 leading-relaxed"
                >
                  {hint}
                </p>
              )}
              {(field.minWords || field.maxWords) && (
                <p
                  id={common["aria-describedby"]}
                  className={`text-xs mt-2 ${value && error ? "text-red-700" : "text-slate-500"}`}
                >
                  {words} {words === 1 ? "word" : "words"}
                  {field.minWords && field.maxWords
                    ? ` · ${field.minWords}–${field.maxWords} words`
                    : field.minWords
                      ? ` · at least ${field.minWords} words`
                      : ` · up to ${field.maxWords} words`}
                </p>
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
                      {option.label}
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
      </button>
    </form>
  );
}

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export type DoneAction =
  | { label: string; onClick: () => void }
  | { label: string; to: string };

// Replaces a form once it has been sent: a light panel with a tick badge and
// the message, over a dark green band holding the next step.
export default function FormSuccess({
  id,
  title,
  message,
  done,
}: {
  id: string;
  title: string;
  message: string;
  done: DoneAction;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  // Move focus here so keyboard and screen reader users land on the result.
  useEffect(() => heading.current?.focus(), []);
  return (
    <div className="form-success" role="status" aria-live="polite">
      <div className="form-success-top">
        <span className="form-success-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 id={`${id}-success-title`} ref={heading} tabIndex={-1}>
          {title}
        </h3>
        <p>{message}</p>
      </div>
      <div className="form-success-band">
        {"to" in done ? (
          <Link to={done.to} className="form-success-button">
            {done.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={done.onClick}
            className="form-success-button"
          >
            {done.label}
          </button>
        )}
      </div>
    </div>
  );
}

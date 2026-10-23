import { useEffect, useState } from "react";
import checkin from "../data/checkin.json";
import site from "../data/site.json";
import { formatEventDate, openEvents } from "../lib/checkin";

const EyeIcon = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {!open && <path d="M4 4l16 16" />}
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="9" y="9" width="12" height="12" rx="1" />
    <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  </svg>
);

// Masked until asked for, so it isn't read off a shoulder or a screenshot.
function CheckInCode({ code }: { code: string }) {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      /* Clipboard blocked: the code stays on screen to type in by hand. */
    }
  };
  return (
    <div className="checkin-code">
      <p className="checkin-code-hint">
        Click Check in above and enter this code.
      </p>
      {shown ? (
        <span className="checkin-code-value">{code}</span>
      ) : (
        <span className="checkin-code-value is-hidden" aria-label="Code hidden">
          {"•".repeat(code.length)}
        </span>
      )}
      <div className="checkin-code-actions">
        <button
          type="button"
          className="checkin-code-button is-primary"
          onClick={() => setShown(!shown)}
          aria-pressed={shown}
        >
          <EyeIcon open={!shown} />
          {shown ? "Hide code" : "Show code"}
        </button>
        <button type="button" className="checkin-code-button" onClick={copy}>
          <CopyIcon />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

// Unlisted page behind the reusable banner QR code: nothing links here.
export default function CheckInPage({ now }: { now?: Date }) {
  const events = openEvents(checkin.events, now);
  return (
    <section className="checkin-page">
      <div className="checkin-card">
        <img className="checkin-logo" src={site.logo} alt="CIReN Logo" />
        <p className="eyebrow">Campus Innovation &amp; Research Network</p>
        <h1>{checkin.heading}</h1>
        <p className="checkin-intro">{checkin.intro}</p>
        {events.length === 0 ? (
          <div className="checkin-empty">
            <h2>No check-ins are open right now.</h2>
            <p>
              Check-in opens on the day of each event. If you are at an event
              now, please ask a CIReN organiser for help.
            </p>
          </div>
        ) : (
          <ul className="checkin-list">
            {events.map((event) => (
              <li
                key={event.id}
                className={`checkin-event${event.live ? " is-live" : ""}`}
              >
                <span className="checkin-event-status">
                  {event.live ? "Happening now" : "Upcoming"}
                </span>
                <span className="checkin-event-name">{event.name}</span>
                <span className="checkin-event-meta">
                  {formatEventDate(event.date)}
                  {event.endDate && ` – ${formatEventDate(event.endDate)}`}
                  {event.location && ` · ${event.location}`}
                </span>
                <a
                  className="checkin-event-action"
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Check in to ${event.name}`}
                >
                  <span className="checkin-event-tick" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  <span className="checkin-event-label">Check in</span>
                </a>
                {event.code && <CheckInCode code={event.code} />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

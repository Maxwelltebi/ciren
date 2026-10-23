import checkin from "../data/checkin.json";
import site from "../data/site.json";
import { formatEventDate, openEvents } from "../lib/checkin";

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
              <li key={event.id}>
                <a
                  className={`checkin-event${event.live ? " is-live" : ""}`}
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
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
                  <span className="checkin-event-action">
                    Check in <span aria-hidden="true">→</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

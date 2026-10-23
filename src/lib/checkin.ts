export interface CheckInEvent {
  id: string;
  name: string;
  date: string;
  endDate?: string;
  location?: string;
  url: string;
  code?: string;
  hidden?: boolean;
}

// Local calendar date, so an event stays open until midnight where it happens.
function localDate(now: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function formatEventDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Events still to come or running today, soonest first; past ones drop off. */
export function openEvents(events: CheckInEvent[], now = new Date()) {
  const today = localDate(now);
  return events
    .filter((event) => !event.hidden && (event.endDate || event.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((event) => ({ ...event, live: event.date <= today }));
}

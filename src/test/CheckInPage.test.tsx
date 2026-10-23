import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import CheckInPage from "../pages/CheckInPage";
import { openEvents, type CheckInEvent } from "../lib/checkin";

const event = (overrides: Partial<CheckInEvent>): CheckInEvent => ({
  id: "event",
  name: "Event",
  date: "2026-10-23",
  url: "https://example.com/check-in",
  ...overrides,
});

describe("check-in page", () => {
  it("lists today's and upcoming events, soonest first, and drops past or hidden ones", () => {
    const now = new Date(2026, 9, 23, 18, 0);
    const events = openEvents(
      [
        event({ id: "later", date: "2026-11-02" }),
        event({ id: "past", date: "2026-10-22" }),
        event({ id: "hidden", hidden: true }),
        event({ id: "today" }),
        event({ id: "multi-day", date: "2026-10-21", endDate: "2026-10-23" }),
      ],
      now,
    );
    expect(events.map(({ id, live }) => [id, live])).toEqual([
      ["multi-day", true],
      ["today", true],
      ["later", false],
    ]);
  });

  it("hides the check-in code until shown, and copies it either way", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    render(<CheckInPage now={new Date(2026, 9, 28, 9, 0)} />);
    expect(screen.queryByText("43VT62")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Show code" }));
    expect(screen.getByText("43VT62")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Hide code" }));
    expect(screen.queryByText("43VT62")).toBeNull();
    expect(
      screen.getByRole("link", {
        name: "Check in to Hacktoberfest Hack Day 2026",
      }),
    ).toHaveAttribute("href", "https://www.mlh.com/check_in");
    await userEvent.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledWith("43VT62");
    expect(
      await screen.findByRole("button", { name: "Copied!" }),
    ).toBeInTheDocument();
  });

  it("renders without the site chrome and is marked noindex", () => {
    render(
      <MemoryRouter initialEntries={["/check-in/"]}>
        <App />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Event Check-In" }),
    ).toBeInTheDocument();
    expect(screen.getAllByAltText("CIReN Logo")).toHaveLength(1);
    expect(screen.queryByLabelText("Email Address (Required)")).toBeNull();
    expect(document.title).toBe("Event Check-In — CIReN");
    expect(
      document.querySelector('meta[name="robots"]')?.getAttribute("content"),
    ).toBe("noindex, nofollow");
  });
});

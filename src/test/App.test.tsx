import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import testimonials from "../data/testimonials.json";
import programs from "../data/programs.json";
import papers from "../data/papers.json";
import site from "../data/site.json";

function renderPage(path = "/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe("pages and navigation", () => {
  it.each([
    ["/", /Bridging African Universities/],
    ["/programs/", /What We Do at CIReN/],
    ["/papers/", new RegExp(papers.heading)],
    ["/support/", /^Support Us$/],
  ])("renders %s with shared branding and footer", (path, heading) => {
    renderPage(path as string);
    expect(
      screen.getByRole("heading", { level: 1, name: heading }),
    ).toBeInTheDocument();
    expect(screen.getAllByAltText("CIReN Logo")).toHaveLength(2);
    expect(screen.getAllByAltText("CIReN Logo")[0]).toHaveAttribute(
      "src",
      site.logo,
    );
    expect(
      screen.getByLabelText("Email Address (Required)"),
    ).toBeInTheDocument();
  });

  it("navigates through the router and updates the page title", async () => {
    renderPage();
    await userEvent.click(screen.getAllByRole("link", { name: "Programs" })[0]);
    expect(
      screen.getByRole("heading", { level: 1, name: programs.heading }),
    ).toBeInTheDocument();
    expect(document.title).toBe("Programs — CIReN");
  });

  it("shows Coming Soon instead of dummy publications", () => {
    renderPage("/papers/");
    expect(screen.getByText("Coming Soon...")).toBeInTheDocument();
    expect(screen.queryByText("Published Work")).not.toBeInTheDocument();
    expect(screen.queryByText("Paper title goes here")).not.toBeInTheDocument();
  });

  it("renders a not-found page for unknown routes", () => {
    renderPage("/missing/");
    expect(
      screen.getByRole("heading", { name: "Page not found" }),
    ).toBeInTheDocument();
  });

  it("closes the mobile menu on Escape, outside clicks, and navigation", async () => {
    renderPage();
    const toggle = screen.getByLabelText("Open menu");
    const menu = toggle.closest("details")!;
    await userEvent.click(toggle);
    expect(menu).toHaveAttribute("open");
    await userEvent.keyboard("{Escape}");
    expect(menu).not.toHaveAttribute("open");
    await userEvent.click(toggle);
    await userEvent.click(screen.getByRole("heading", { level: 1 }));
    expect(menu).not.toHaveAttribute("open");
    await userEvent.click(toggle);
    await userEvent.click(
      within(menu).getByRole("link", { name: "Our Papers" }),
    );
    expect(menu).not.toHaveAttribute("open");
    expect(
      screen.getByRole("heading", { level: 1, name: papers.heading }),
    ).toBeInTheDocument();
  });
});

describe("dialogs and interactive cards", () => {
  it("opens every full testimonial, traps focus, closes, and restores focus", async () => {
    const { container } = renderPage();
    const cards = container.querySelectorAll<HTMLElement>(".carousel-card");
    expect(cards).toHaveLength(testimonials.length);
    for (const [index, card] of Array.from(cards).entries()) {
      card.focus();
      await userEvent.keyboard("{Enter}");
      const dialog = screen.getByRole("dialog", {
        name: testimonials[index].name,
      });
      expect(within(dialog).getByText(testimonials[index].quote)).toBeVisible();
      const close = within(dialog).getByRole("button", {
        name: "Close testimonial",
      });
      expect(close).toHaveFocus();
      await userEvent.tab();
      expect(close).toHaveFocus();
      expect(document.body.style.overflow).toBe("hidden");
      await userEvent.keyboard("{Escape}");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(card).toHaveFocus();
      expect(document.body.style.overflow).not.toBe("hidden");
    }
  });

  it("closes an application with the backdrop and supports a focus cycle", async () => {
    renderPage();
    const trigger = screen.getAllByRole("link", { name: "Apply" })[0];
    await userEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Join CIReN" });
    const close = within(dialog).getByRole("button", {
      name: "Close application form",
    });
    await userEvent.tab({ shift: true });
    expect(
      within(dialog).getByRole("button", { name: /Submit Application/ }),
    ).toHaveFocus();
    await userEvent.tab();
    expect(close).toHaveFocus();
    await userEvent.click(screen.getByTestId("modal-backdrop"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("toggles program cards and replaces the inspiration section with the gallery", async () => {
    renderPage("/programs/");
    for (const program of [...programs.societies, ...programs.events]) {
      const card = screen.getByRole("button", {
        name: new RegExp(program.name),
      });
      expect(card).toHaveAttribute("aria-expanded", "false");
      await userEvent.click(card);
      expect(card).toHaveAttribute("aria-expanded", "true");
      expect(card).toHaveClass("is-flipped");
      await userEvent.keyboard("{Enter}");
      expect(card).toHaveAttribute("aria-expanded", "false");
    }
    expect(
      screen.queryByText("What inspired our work?"),
    ).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", {
        name: "View photos from CIReN Mini Hackathon x MLH",
      }),
    );
    expect(
      screen.getByRole("dialog", { name: "CIReN Mini Hackathon x MLH" }),
    ).toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Close event gallery" }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("moves the carousel locally and synchronizes pagination on scroll", async () => {
    const { container } = renderPage();
    const deck = container.querySelector<HTMLElement>("#carousel-deck")!;
    Object.defineProperties(deck, {
      scrollWidth: { value: 1600 },
      clientWidth: { value: 600 },
      scrollLeft: { value: 1000, writable: true },
    });
    const scrollBy = vi.spyOn(deck, "scrollBy");
    const scrollTo = vi.spyOn(deck, "scrollTo");
    await userEvent.click(
      screen.getByRole("button", { name: "Next testimony" }),
    );
    expect(scrollBy).toHaveBeenCalled();
    await userEvent.click(
      screen.getByRole("button", { name: "Previous testimony" }),
    );
    expect(scrollBy).toHaveBeenCalledTimes(2);
    await userEvent.click(
      screen.getByRole("button", { name: "Show testimony 4" }),
    );
    expect(scrollTo).toHaveBeenCalled();
    fireEvent.scroll(deck);
    expect(
      screen.getByRole("button", { name: "Show testimony 6" }),
    ).toHaveAttribute("aria-current", "true");
  });
});

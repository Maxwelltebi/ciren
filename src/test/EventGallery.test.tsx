import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EventGallery from "../components/EventGallery";
import EventPhotoStack from "../components/EventPhotoStack";
import gallery from "../data/gallery.json";
import type { GalleryEvent } from "../types/gallery";

const event: GalleryEvent = gallery.events[0];

// jsdom has no native PointerEvent or pointer capture; model their event data.
class TestPointerEvent extends MouseEvent {
  pointerId: number;
  isPrimary: boolean;
  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 1;
    this.isPrimary = init.isPrimary ?? true;
  }
}

function topCard() {
  const card = screen.getByRole("img").parentElement!;
  card.setPointerCapture = vi.fn();
  card.hasPointerCapture = vi.fn(() => true);
  card.releasePointerCapture = vi.fn();
  return card;
}

describe("event gallery", () => {
  beforeEach(() => {
    vi.stubGlobal("PointerEvent", TestPointerEvent);
  });

  it("opens the event, restores focus when closed, and starts fresh when reopened", async () => {
    render(<EventGallery />);
    const trigger = screen.getByRole("button", {
      name: `View photos from ${event.name}`,
    });
    await userEvent.click(trigger);
    expect(
      screen.getByRole("dialog", { name: event.name }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      `Photo 1 of ${event.photos.length}`,
    );
    await userEvent.click(screen.getByRole("button", { name: /Next photo/ }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Photo 2 of"),
    );
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    await userEvent.click(trigger);
    expect(screen.getByRole("status")).toHaveTextContent("Photo 1 of");
  });

  it("exhausts the stack without looping and can replay from the first photo", async () => {
    render(<EventPhotoStack event={event} onClose={vi.fn()} />);
    for (const [index, photo] of event.photos.entries()) {
      expect(screen.getByRole("img", { name: photo.alt })).toHaveAttribute(
        "src",
        photo.src,
      );
      expect(screen.getAllByRole("img")).toHaveLength(1);
      expect(screen.getByRole("status")).toHaveTextContent(
        `Photo ${index + 1} of ${event.photos.length}`,
      );
      await userEvent.click(
        screen.getByRole("button", {
          name:
            index === event.photos.length - 1 ? /Finish viewing/ : /Next photo/,
        }),
      );
      await waitFor(() =>
        expect(
          screen.queryByRole("img", { name: photo.alt }),
        ).not.toBeInTheDocument(),
      );
    }
    expect(screen.getByRole("status")).toHaveTextContent(
      `You’ve seen all ${event.photos.length} photos.`,
    );
    expect(
      screen.queryByRole("button", { name: /Next photo/ }),
    ).not.toBeInTheDocument();
    const replay = screen.getByRole("button", { name: "View again" });
    expect(replay).toHaveFocus();
    await userEvent.click(replay);
    expect(
      screen.getByRole("img", { name: event.photos[0].alt }),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(
        screen.getByRole("group", { name: "Event photo stack" }),
      ).toHaveFocus(),
    );
  });

  it.each([-150, 150])(
    "swipes in either direction (%s px) to reveal the next card",
    async (distance) => {
      render(<EventPhotoStack event={event} onClose={vi.fn()} />);
      const card = topCard();
      fireEvent.pointerDown(card, {
        pointerId: 1,
        clientX: 200,
        clientY: 100,
        button: 0,
      });
      fireEvent.pointerMove(card, {
        pointerId: 1,
        clientX: 200 + distance,
        clientY: 100,
      });
      fireEvent.pointerUp(card, {
        pointerId: 1,
        clientX: 200 + distance,
        clientY: 100,
      });
      await waitFor(() =>
        expect(screen.getByRole("status")).toHaveTextContent("Photo 2 of"),
      );
      expect(card.setPointerCapture).toHaveBeenCalledWith(1);
    },
  );

  it("does not dismiss on a tap, short drag, vertical gesture, or cancelled swipe", () => {
    render(<EventPhotoStack event={event} onClose={vi.fn()} />);
    const card = topCard();
    for (const [x, y] of [
      [200, 100],
      [215, 100],
      [300, 300],
    ]) {
      fireEvent.pointerDown(card, { clientX: 200, clientY: 100, button: 0 });
      fireEvent.pointerMove(card, { clientX: x, clientY: y });
      fireEvent.pointerUp(card, { clientX: x, clientY: y });
      expect(card.style.transform).toBe("translateX(0px) rotate(0deg)");
    }
    fireEvent.pointerDown(card, { clientX: 200, clientY: 100, button: 0 });
    fireEvent.pointerMove(card, { clientX: 400, clientY: 100 });
    fireEvent.pointerCancel(card);
    expect(card.style.transform).toBe("translateX(0px) rotate(0deg)");
    expect(screen.getByRole("status")).toHaveTextContent("Photo 1 of");
  });

  it("supports arrow keys and prevents repeated actions from skipping photos", async () => {
    render(<EventPhotoStack event={event} onClose={vi.fn()} />);
    const stack = screen.getByRole("group", { name: "Event photo stack" });
    fireEvent.keyDown(stack, { key: "ArrowLeft" });
    fireEvent.keyDown(stack, { key: "ArrowRight" });
    fireEvent.click(screen.getByRole("button", { name: /Next photo/ }));
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Photo 2 of"),
    );
    fireEvent.keyDown(stack, { key: "ArrowRight" });
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("Photo 3 of"),
    );
  });

  it("handles an event without photos and a single-photo event", async () => {
    const { unmount } = render(
      <EventPhotoStack event={{ ...event, photos: [] }} onClose={vi.fn()} />,
    );
    expect(screen.getByText("Photos coming soon")).toBeInTheDocument();
    expect(
      screen.queryByRole("group", { name: "Event photo stack" }),
    ).not.toBeInTheDocument();
    unmount();
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
    } as MediaQueryList);
    render(
      <EventPhotoStack
        event={{ ...event, photos: [event.photos[0]] }}
        onClose={vi.fn()}
      />,
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Finish viewing/ }),
    );
    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "You’ve seen all 1 photo.",
      ),
    );
  });
});

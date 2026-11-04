import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from "react";

// Beyond this a card is off-stage, so it stops tilting and growing.
const MAX_OFFSET = 1.2;
const DRAG_THRESHOLD = 6;

export const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth";

// Tells each card how far it sits from the middle of the stage (--n, -1 at the
// left edge to 1 at the right). The stylesheet turns that into the room's shape.
export function useShowroom() {
  const stage = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const dragged = useRef(false);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const half = element.clientWidth / 2;
      if (!half) return;
      const centre = element.scrollLeft + half;
      for (const slot of Array.from(element.children) as HTMLElement[]) {
        const offset = (slot.offsetLeft + slot.offsetWidth / 2 - centre) / half;
        slot.style.setProperty(
          "--n",
          Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, offset)).toFixed(3),
        );
      }
      setAtStart(element.scrollLeft <= 1);
      setAtEnd(
        element.scrollLeft + element.clientWidth >= element.scrollWidth - 1,
      );
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(measure);
    };
    measure();
    element.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const move = (direction: 1 | -1) => {
    const element = stage.current;
    element?.scrollBy({
      left: direction * element.clientWidth * 0.6,
      behavior: scrollBehavior(),
    });
  };
  const centre = useCallback((index: number, behavior: ScrollBehavior) => {
    const element = stage.current;
    const slot = element?.children[index] as HTMLElement | undefined;
    if (element && slot)
      // Only move the stage; scrollIntoView would also jump the whole page.
      element.scrollTo({
        left: slot.offsetLeft + (slot.offsetWidth - element.clientWidth) / 2,
        behavior,
      });
  }, []);

  // Touch already scrolls natively; this gives mouse users the same gesture.
  // Capture waits until the drag is real, or the card would never get its click.
  const dragHandlers = {
    onPointerDown: (e: PointerEvent<HTMLUListElement>) => {
      dragged.current = false;
      if (e.pointerType === "mouse" && e.button === 0)
        drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft };
    },
    onPointerMove: (e: PointerEvent<HTMLUListElement>) => {
      if (!drag.current) return;
      const dx = e.clientX - drag.current.x;
      if (!dragged.current) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        dragged.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      }
      e.currentTarget.scrollLeft = drag.current.left - dx;
    },
    onPointerUp: () => {
      drag.current = null;
    },
    onPointerCancel: () => {
      drag.current = null;
    },
    // Letting go after a drag must not also open the card under the pointer.
    onClickCapture: (e: MouseEvent<HTMLUListElement>) => {
      if (!dragged.current) return;
      dragged.current = false;
      e.preventDefault();
      e.stopPropagation();
    },
  };

  return { stage, atStart, atEnd, move, centre, dragHandlers };
}

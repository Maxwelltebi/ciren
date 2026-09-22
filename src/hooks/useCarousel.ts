import { useEffect, useRef, useState } from "react";

export function useCarousel(count: number) {
  const deck = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const sync = () => {
    const element = deck.current;
    if (!element) return;
    const total = element.scrollWidth - element.clientWidth;
    setActive(
      total > 0
        ? Math.min(
            count - 1,
            Math.max(0, Math.round((element.scrollLeft / total) * (count - 1))),
          )
        : 0,
    );
  };
  useEffect(() => {
    const element = deck.current;
    const middle = element?.children[Math.min(2, count - 1)] as
      HTMLElement | undefined;
    if (element && middle) {
      // Only move the deck; scrollIntoView would also jump the whole page.
      element.scrollLeft +=
        middle.getBoundingClientRect().left -
        element.getBoundingClientRect().left -
        (element.clientWidth - middle.offsetWidth) / 2;
    }
  }, [count]);
  const behavior = (): ScrollBehavior =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
  const move = (direction: number) => {
    const element = deck.current;
    const first = element?.firstElementChild;
    element?.scrollBy({
      left:
        direction * (first ? first.getBoundingClientRect().width * 0.75 : 260),
      behavior: behavior(),
    });
  };
  const select = (index: number) => {
    const element = deck.current;
    const card = element?.children[index] as HTMLElement | undefined;
    if (element && card)
      element.scrollTo({
        left:
          element.scrollLeft +
          card.getBoundingClientRect().left -
          element.getBoundingClientRect().left -
          (element.clientWidth - card.offsetWidth) / 2,
        behavior: behavior(),
      });
  };
  return { deck, active, sync, move, select };
}

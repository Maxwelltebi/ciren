import { useEffect, useRef, useState, type PointerEvent } from "react";
import type { GalleryEvent } from "../types/gallery";
import Modal from "./Modal";

export default function EventPhotoStack({
  event,
  onClose,
}: {
  event: GalleryEvent;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [leaving, setLeaving] = useState<1 | -1 | null>(null);
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advancing = useRef(false);
  const replay = useRef<HTMLButtonElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const complete = event.photos.length > 0 && index >= event.photos.length;
  const photo = event.photos[index];

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  useEffect(() => {
    if (complete) replay.current?.focus();
  }, [complete]);

  const advance = (direction: 1 | -1 = 1) => {
    if (advancing.current || !photo) return;
    advancing.current = true;
    pointer.current = null;
    setDragging(false);
    setLeaving(direction);
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    timer.current = setTimeout(
      () => {
        setIndex((previous) => previous + 1);
        setDrag(0);
        setLeaving(null);
        advancing.current = false;
      },
      reducedMotion ? 0 : 240,
    );
  };

  const startDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary || e.button !== 0 || advancing.current) return;
    pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const start = pointer.current;
    if (!start || start.id !== e.pointerId) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    pointer.current = null;
    setDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
    const threshold = Math.min(
      90,
      Math.max(40, e.currentTarget.clientWidth * 0.18),
    );
    if (Math.abs(dx) >= threshold && Math.abs(dx) > Math.abs(dy))
      advance(dx > 0 ? 1 : -1);
    else setDrag(0);
  };
  const cancelDrag = () => {
    pointer.current = null;
    setDragging(false);
    setDrag(0);
  };

  return (
    <Modal
      open
      onClose={onClose}
      labelledBy="event-gallery-title"
      closeLabel="Close event gallery"
      className="max-w-3xl bg-[#0B0F19] text-white"
    >
      <div className="px-6 pt-8 sm:px-10 pb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#68e053] mb-3">
          Event Gallery
        </p>
        <h3
          id="event-gallery-title"
          className="font-display text-2xl sm:text-3xl font-bold leading-tight pr-8"
        >
          {event.name}
        </h3>
        {event.photos.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-display text-2xl mb-3">Photos coming soon</p>
            <p className="text-slate-300 text-sm">
              Check back for moments from this event.
            </p>
          </div>
        ) : complete ? (
          <div className="py-16 text-center">
            <p role="status" className="font-display text-2xl mb-3">
              You’ve seen all {event.photos.length}{" "}
              {event.photos.length === 1 ? "photo" : "photos"}.
            </p>
            <p className="text-slate-300 mb-8">
              Thanks for looking back with us.
            </p>
            <button
              ref={replay}
              type="button"
              onClick={() => {
                setIndex(0);
                requestAnimationFrame(() => stage.current?.focus());
              }}
              className="px-6 py-3 bg-[#40b830] hover:bg-[#329e24] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              View again
            </button>
          </div>
        ) : (
          <>
            <p
              id="event-gallery-help"
              className="text-sm text-slate-300 mt-3 mb-6"
            >
              Swipe left or right to reveal the next photo. You can also use the
              arrow keys or the button below.
            </p>
            <div
              ref={stage}
              role="group"
              tabIndex={0}
              aria-label="Event photo stack"
              aria-describedby="event-gallery-help"
              aria-keyshortcuts="ArrowLeft ArrowRight"
              className="photo-stack-stage relative aspect-[4/3] max-h-[52vh] mx-2 mb-7 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#68e053]"
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  e.preventDefault();
                  advance(e.key === "ArrowRight" ? 1 : -1);
                }
              }}
            >
              {event.photos.slice(index, index + 3).map((item, offset) => (
                <div
                  key={`${event.id}-${index + offset}`}
                  aria-hidden={offset !== 0 ? true : undefined}
                  className={`photo-stack-image absolute inset-0 rounded-xl bg-white p-2 sm:p-3 shadow-xl ${offset === 0 ? "photo-stack-top" : "pointer-events-none"}`}
                  style={{
                    zIndex: 3 - offset,
                    transform:
                      offset === 0
                        ? `translateX(${leaving ? `${leaving * 130}%` : `${drag}px`}) rotate(${leaving ? leaving * 20 : drag / 22}deg)`
                        : `translateY(${offset * 7}px) rotate(${offset % 2 ? -3 : 4}deg) scale(${1 - offset * 0.035})`,
                    opacity: offset === 0 && leaving ? 0 : 1,
                    transition: offset === 0 && dragging ? "none" : undefined,
                  }}
                  onPointerDown={offset === 0 ? startDrag : undefined}
                  onPointerMove={
                    offset === 0
                      ? (e) => {
                          if (pointer.current?.id === e.pointerId)
                            setDrag(e.clientX - pointer.current.x);
                        }
                      : undefined
                  }
                  onPointerUp={offset === 0 ? endDrag : undefined}
                  onPointerCancel={offset === 0 ? cancelDrag : undefined}
                  onLostPointerCapture={offset === 0 ? cancelDrag : undefined}
                >
                  <img
                    src={item.src}
                    alt={offset === 0 ? item.alt : ""}
                    draggable={false}
                    className="w-full h-full object-contain rounded-md bg-slate-100 pointer-events-none select-none"
                  />
                </div>
              ))}
            </div>
            <div className="min-h-6 text-sm text-slate-300 mb-5">
              {photo.caption}
            </div>
            <div className="flex items-center justify-between gap-4">
              <p
                role="status"
                aria-live="polite"
                className="text-sm text-slate-300"
              >
                Photo {index + 1} of {event.photos.length}
              </p>
              <button
                type="button"
                aria-disabled={!!leaving}
                onClick={() => advance()}
                className="px-5 py-3 bg-[#40b830] hover:bg-[#329e24] text-white font-semibold text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {index === event.photos.length - 1
                  ? "Finish viewing"
                  : "Next photo"}{" "}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}

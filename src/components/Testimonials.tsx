import { useCallback, useState } from "react";
import home from "../data/home.json";
import testimonials from "../data/testimonials.json";
import type { Testimonial } from "../types/content";
import { useCarousel } from "../hooks/useCarousel";
import RichText from "./RichText";
import TestimonialCard from "./TestimonialCard";
import TestimonialModal from "./TestimonialModal";

export default function Testimonials() {
  const [selected, setSelected] = useState<Testimonial | null>(null);
  const close = useCallback(() => setSelected(null), []);
  const { deck, active, sync, move, select } = useCarousel(testimonials.length);
  const arrowClass =
    "w-11 h-11 border border-slate-300 hover:border-[#40b830] bg-white hover:bg-slate-50 text-slate-700 hover:text-[#046e00] shadow-sm flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#40b830]/40 rounded-none";
  return (
    <>
      <section
        className="editorial-section bg-white overflow-hidden relative"
        id="testimonies"
      >
        <div className="site-container mb-8">
          <h2 className="text-3xl sm:text-4xl tracking-tight mb-4 text-slate-800 font-bold font-display">
            <RichText html={home.testimonies.heading} />
          </h2>
          <p className="text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
            <RichText html={home.testimonies.intro} />
          </p>
        </div>
        <div className="site-container">
          <div
            ref={deck}
            onScroll={sync}
            id="carousel-deck"
            className="hide-scrollbar flex items-stretch overflow-x-auto py-3 gap-5 scroll-smooth snap-x snap-mandatory select-none"
          >
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} t={t} onOpen={setSelected} />
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              aria-label="Previous testimony"
              className={arrowClass}
              onClick={() => move(-1)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 19l-7-7 7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="flex items-center gap-2" id="carousel-dots">
              {testimonials.map((t, index) => (
                <button
                  key={t.name}
                  aria-label={`Show testimony ${index + 1}`}
                  aria-current={active === index ? "true" : undefined}
                  onClick={() => select(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#40b830] ${active === index ? "bg-[#0B0F19] ring-2 ring-[#40b830]/40" : "bg-slate-300 hover:bg-slate-400"}`}
                />
              ))}
            </div>
            <button
              aria-label="Next testimony"
              className={arrowClass}
              onClick={() => move(1)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
      <TestimonialModal testimonial={selected} onClose={close} />
    </>
  );
}

import { useState } from "react";
import type { Program } from "../types/content";
import ResponsiveImage from "./ResponsiveImage";

export default function FlipCard({ c }: { c: Program }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-expanded={flipped}
        onClick={() => setFlipped(!flipped)}
        className={`${flipped ? "is-flipped " : ""}flip-card group w-full h-80 text-left focus:outline-none focus:ring-4 focus:ring-[#40b830]/60`}
      >
        <span className="flip-card-inner block relative w-full h-full">
          <span className="flip-face flip-front frame absolute inset-0 bg-[#0B0F19]">
            <span className="absolute inset-0 overflow-hidden">
              <ResponsiveImage
                sizes="(max-width: 768px) 100vw, 400px"
                src={`${c.image}`}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              <span className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/90 to-[#0B0F19]/70"></span>
            </span>

            <span className="relative z-10 flex flex-col justify-end gap-6 h-full p-7">
              <span className="block">
                <span
                  className="block text-xl sm:text-2xl font-bold text-white leading-tight"
                  style={{ fontFamily: '"Nichrome", "Inter Tight", "Inter", Arial, sans-serif' }}
                >
                  {c.name}
                </span>
                <span className="block text-sm text-slate-300 leading-relaxed mt-3">
                  {c.teaser}
                </span>
              </span>
              <span className="block text-[11px] font-bold uppercase tracking-widest text-[#40b830]">
                Read more
              </span>
            </span>
          </span>

          <span className="flip-face flip-back frame absolute inset-0 flex flex-col justify-between bg-white p-7">
            <span className="block">
              <span className="block text-[11px] font-bold uppercase tracking-widest text-[#046e00]">
                {c.name}
              </span>
              <span className="block text-sm text-slate-600 leading-relaxed mt-4">
                {c.description}
              </span>
            </span>
            <span className="block text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Back
            </span>
          </span>
        </span>
      </button>
    </>
  );
}

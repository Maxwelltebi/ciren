import { Fragment } from "react";
import { useState } from "react";
import type { Program } from "../types/content";

export default function FlipCard({ c }: { c: Program }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-expanded={flipped}
        onClick={() => setFlipped(!flipped)}
        className={`${flipped ? "is-flipped " : ""}flip-card group w-full h-80 text-left rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-[#40b830]/60`}
      >
        <span className="flip-card-inner block relative w-full h-full">
          <span className="flip-face flip-front absolute inset-0 rounded-[2rem] bg-[#0B0F19] border border-white/10 shadow-2xl">
            <span className="absolute inset-0 overflow-hidden rounded-[2rem]">
              <img
                src={`${c.image}`}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center"
              />

              <span className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/90 to-[#0B0F19]/70"></span>
            </span>

            <span className="relative z-10 flex flex-col justify-between h-full p-7">
              <span className="block text-[#40b830]">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {c.iconPaths.map((d, index) => (
                    <Fragment key={index}>
                      <path
                        d={`${d}`}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </Fragment>
                  ))}
                </svg>
              </span>
              <span className="block">
                <span
                  className="block text-xl sm:text-2xl font-bold text-white leading-tight"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  {c.name}
                </span>
                <span className="block h-1 w-12 bg-[#40b830] rounded-full mt-3"></span>
                <span className="block text-sm text-slate-300 leading-relaxed mt-3">
                  {c.teaser}
                </span>
              </span>
              <span className="block text-[11px] font-bold uppercase tracking-widest text-[#40b830]">
                Read more →
              </span>
            </span>
          </span>

          <span className="flip-face flip-back absolute inset-0 flex flex-col justify-between rounded-[2rem] bg-white border-2 border-[#40b830]/40 shadow-2xl p-7">
            <span className="block">
              <span className="block text-[11px] font-bold uppercase tracking-widest text-[#046e00]">
                {c.name}
              </span>
              <span className="block h-1 w-12 bg-[#40b830] rounded-full mt-2 mb-4"></span>
              <span className="block text-sm text-slate-600 leading-relaxed">
                {c.description}
              </span>
            </span>
            <span className="block text-[11px] font-bold uppercase tracking-widest text-slate-400">
              ← Back
            </span>
          </span>
        </span>
      </button>
    </>
  );
}

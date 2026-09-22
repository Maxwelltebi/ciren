import programs from "../data/programs.json";
import { Fragment } from "react";
import { useCallback, useState } from "react";
import FlipCard from "../components/FlipCard";
import CaseStudyModal from "../components/CaseStudyModal";

export default function ProgramsPage() {
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);
  const closeCaseStudy = useCallback(() => setCaseStudyOpen(false), []);
  return (
    <>
      <section className="relative w-full overflow-hidden bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-white/20"></div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#40b830]">
              Programs
            </p>
            <div className="h-px w-12 bg-white/20"></div>
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold uppercase text-white tracking-tight leading-[1.15] mb-6"
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: "800",
              letterSpacing: "-0.01em",
            }}
          >
            {programs.heading}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            {programs.intro}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none overflow-hidden leading-none">
          <svg
            className="relative block w-full h-8 sm:h-12 text-white"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1440 60"
          >
            <path
              d="M0,60 C480,0 960,0 1440,60 L1440,60 L0,60 Z"
              fill="#ffffff"
            ></path>
          </svg>
        </div>
      </section>

      <section
        className="pt-20 lg:pt-24 pb-14 lg:pb-16 bg-white"
        id="societies"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <span
              className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#0B0F19]"
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                letterSpacing: "0.12em",
              }}
            >
              {programs.societiesHeading}
            </span>
            <div className="h-1 w-12 bg-[#40b830] rounded-full mt-1.5"></div>
            <p className="text-sm sm:text-base text-slate-600 mt-4 max-w-2xl">
              {programs.societiesIntro}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {programs.societies.map((c, index) => (
              <Fragment key={index}>
                <FlipCard c={c} />
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <section
        className="pt-14 lg:pt-16 pb-20 lg:pb-24 bg-gradient-to-b from-white via-[#f8f9ff] to-white"
        id="events"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <span
              className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#0B0F19]"
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                letterSpacing: "0.12em",
              }}
            >
              {programs.eventsHeading}
            </span>
            <div className="h-1 w-12 bg-[#40b830] rounded-full mt-1.5"></div>
            <p className="text-sm sm:text-base text-slate-600 mt-4 max-w-2xl">
              {programs.eventsIntro}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {programs.events.map((c, index) => (
              <Fragment key={index}>
                <FlipCard c={c} />
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-white" id="inspiration">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight mb-4 text-slate-800 font-bold"
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: "700",
              letterSpacing: "-0.01em",
            }}
          >
            {programs.inspiration.heading}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10">
            {programs.inspiration.blurb}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setCaseStudyOpen(true)}
              data-open-case-study
              aria-haspopup="dialog"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-5 bg-[#40b830] hover:bg-[#329e24] text-white text-sm sm:text-base font-bold uppercase tracking-widest rounded-none shadow-lg shadow-[#046e00]/25 transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#046e00]/40"
            >
              {programs.inspiration.caseStudyButton}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>

            {programs.inspiration.paperUrl ? (
              <>
                <a
                  href={`${programs.inspiration.paperUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-5 border-2 border-[#046e00] text-[#046e00] hover:bg-[#046e00] hover:text-white text-sm sm:text-base font-bold uppercase tracking-widest rounded-none transition-all focus:outline-none focus:ring-4 focus:ring-[#40b830]/40"
                >
                  {programs.inspiration.paperButton}
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M14 5h5v5M19 5l-8 8M19 13v6H5V5h6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </a>
              </>
            ) : (
              <>
                <span
                  aria-disabled="true"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-5 border-2 border-slate-300 text-slate-400 text-sm sm:text-base font-bold uppercase tracking-widest rounded-none cursor-not-allowed select-none"
                >
                  {programs.inspiration.paperButton}
                </span>
              </>
            )}
          </div>

          {!programs.inspiration.paperUrl ? (
            <>
              <p className="text-xs text-slate-500 mt-4">
                The paper link has not been added yet.
              </p>
            </>
          ) : null}
        </div>
      </section>

      <CaseStudyModal open={caseStudyOpen} onClose={closeCaseStudy} />
    </>
  );
}

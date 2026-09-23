import programs from "../data/programs.json";
import { Fragment } from "react";
import FlipCard from "../components/FlipCard";
import EventGallery from "../components/EventGallery";

export default function ProgramsPage() {
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

      <EventGallery />
    </>
  );
}

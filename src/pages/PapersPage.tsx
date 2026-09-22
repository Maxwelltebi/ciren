import papers from "../data/papers.json";
import { Fragment } from "react";

export default function PapersPage() {
  return (
    <>
      <section className="relative w-full overflow-hidden bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-white/20"></div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#40b830]">
              Publications
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
            {papers.heading}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            {papers.intro}
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

      <section className="pt-20 lg:pt-24 pb-20 lg:pb-24 bg-white" id="papers">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {papers.papers.length ? (
            <>
              <div className="flex items-baseline justify-between mb-8">
                <span
                  className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#0B0F19]"
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    letterSpacing: "0.12em",
                  }}
                >
                  Published Work
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {papers.papers.length} paper
                  {papers.papers.length !== 1 ? <>s</> : null}
                </span>
              </div>

              <ul className="border-t border-slate-200">
                {papers.papers.map((p, index) => (
                  <Fragment key={index}>
                    <li className="border-b border-slate-200 py-7 sm:py-8">
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8">
                        <span className="shrink-0 sm:w-16 text-sm font-bold text-[#046e00] tracking-wider">
                          {p.year}
                        </span>
                        <div className="flex-1">
                          <h2
                            className="text-lg sm:text-xl font-bold text-[#0B0F19] leading-snug"
                            style={{
                              fontFamily: '"Playfair Display", Georgia, serif',
                            }}
                          >
                            {p.url ? (
                              <>
                                <a
                                  href={`${p.url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-baseline gap-2 hover:text-[#046e00] transition-colors focus:outline-none focus:ring-2 focus:ring-[#40b830] focus:ring-offset-2"
                                >
                                  {p.title}
                                  <svg
                                    className="w-3.5 h-3.5 shrink-0 self-center text-slate-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
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
                              <>{p.title}</>
                            )}
                          </h2>
                          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                            {p.authors}
                          </p>
                        </div>
                      </div>
                    </li>
                  </Fragment>
                ))}
              </ul>
            </>
          ) : (
            <>
              <div className="border border-dashed border-slate-300 rounded-[2rem] py-16 px-6 text-center">
                <div className="h-1 w-12 bg-[#40b830] rounded-full mx-auto mb-5"></div>
                <p
                  className="text-base font-bold text-[#0B0F19] mb-2"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  No papers listed yet
                </p>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Work from the network is being prepared for publication. This
                  page will list it as it goes out.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

import { Link } from "react-router-dom";
import { Fragment } from "react";
import RichText from "./RichText";
import home from "../data/home.json";

export default function About() {
  return (
    <>
      <section
        className="py-20 lg:py-28 bg-white relative overflow-hidden"
        id="about-us"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 relative">
              <div className="relative overflow-hidden shadow-2xl bg-slate-100 aspect-[4/3] sm:aspect-[16/11] rounded-[2rem]">
                <img
                  alt={`${home.whatWeDo.imageAlt}`}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  src={`${home.whatWeDo.image}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>

                <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-xl border border-white/60 z-10 max-w-[90%] rounded-none">
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-600 leading-tight">
                    <span className="font-bold text-[#046e00]">Source:</span>{" "}
                    <RichText html={home.whatWeDo.imageCredit} />
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col items-start justify-center">
              <div className="mb-6 inline-block">
                <span
                  className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#0B0F19]"
                  style={{
                    fontFamily: '"Playfair Display", Georgia, serif',
                    letterSpacing: "0.12em",
                  }}
                >
                  <RichText html={home.whatWeDo.eyebrow} />
                </span>
                <div className="h-1 w-12 bg-[#40b830] rounded-full mt-1.5"></div>
              </div>

              <div className="space-y-4 text-slate-600 font-normal leading-relaxed text-sm sm:text-base mb-8">
                {home.whatWeDo.paragraphs.map((p, index) => (
                  <Fragment key={index}>
                    <p className="">
                      <RichText html={p} />
                    </p>
                  </Fragment>
                ))}
              </div>

              <Link
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#40b830] hover:bg-[#329e24] text-white font-semibold text-sm rounded-none shadow-lg shadow-[#046e00]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                to="/programs/"
              >
                <span className="">
                  <RichText html={home.whatWeDo.ctaLabel} />
                </span>
                <svg
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

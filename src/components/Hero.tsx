import { Link } from "react-router-dom";
import RichText from "./RichText";
import home from "../data/home.json";
import PartnersMarquee from "./PartnersMarquee";

export default function Hero() {
  return (
    <>
      <section className="relative w-full overflow-hidden bg-[#0B0F19]">
        <div className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full z-0">
            <img
              alt={`${home.hero.imageAlt}`}
              className="w-full h-full object-cover object-center"
              src={`${home.hero.image}`}
              style={{ filter: "brightness(0.85) contrast(1.05)" }}
            />
            <div
              className="absolute inset-0 bg-black/75 bg-gradient-to-t from-black/90 via-black/70 to-black/65"
              style={{
                background:
                  "linear-gradient(to top, rgba(11, 15, 25, 0.88) 0%, rgba(11, 15, 25, 0.68) 45%, rgba(11, 15, 25, 0.72) 100%)",
              }}
            ></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-20 text-center flex flex-col items-center justify-center">
            <h1
              className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold uppercase text-white tracking-tight leading-[1.15] mb-6"
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontWeight: "800",
                letterSpacing: "-0.01em",
                textShadow:
                  "rgba(0, 0, 0, 0.8) 2px 3px 0px, rgba(0, 0, 0, 0.9) 0px 4px 20px",
              }}
            >
              <RichText html={home.hero.headline} />
            </h1>
            <p
              className="text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed max-w-3xl mb-8 font-normal"
              style={{
                textShadow:
                  "rgba(0, 0, 0, 0.8) 0px 1px 8px, rgba(0, 0, 0, 0.85) 0px 1px 2px",
              }}
            >
              <RichText html={home.hero.intro} />
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#40b830] hover:bg-[#329e24] text-white text-xs sm:text-sm font-bold uppercase tracking-widest rounded-none shadow-lg shadow-[#046e00]/25 transition-all transform hover:-translate-y-0.5"
                to="/programs/"
              >
                <RichText html={home.hero.ctaLabel} />
              </Link>
            </div>
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
        </div>
        <PartnersMarquee />
      </section>
    </>
  );
}

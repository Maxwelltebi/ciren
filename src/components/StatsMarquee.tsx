import { Fragment } from "react";
import RichText from "./RichText";
import home from "../data/home.json";
import stats from "../data/stats.json";
import StatItem from "./StatItem";

export default function StatsMarquee() {
  return (
    <>
      <div className="bg-white pt-8 pb-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-slate-200"></div>
            <p className="text-center text-[11px] font-bold uppercase tracking-widest text-slate-500">
              <RichText html={home.statsEyebrow} />
            </p>
            <div className="h-px w-12 bg-slate-200"></div>
          </div>
          <div className="relative w-full overflow-hidden py-3">
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-r from-white via-white/90 to-transparent z-10"></div>
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-36 bg-gradient-to-l from-white via-white/90 to-transparent z-10"></div>
            <div
              className="animate-marquee items-center"
              style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              <div className="flex items-center gap-8 lg:gap-14 px-4 sm:px-8 shrink-0">
                {stats.map((s, index) => (
                  <Fragment key={index}>
                    <StatItem s={s} />
                  </Fragment>
                ))}
              </div>
              <div
                aria-hidden="true"
                className="flex items-center gap-8 lg:gap-14 px-4 sm:px-8 shrink-0"
              >
                {stats.map((s, index) => (
                  <Fragment key={index}>
                    <StatItem s={s} />
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import RichText from "./RichText";
import type { Testimonial } from "../types/content";

export default function TestimonialCard({
  t,
  onOpen,
}: {
  t: Testimonial;
  onOpen: (value: Testimonial) => void;
}) {
  return (
    <>
      <div
        tabIndex={0}
        onClick={() => onOpen(t)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen(t);
          }
        }}
        role="button"
        aria-haspopup="dialog"
        className={`focus:outline-none focus:ring-4 focus:ring-[#40b830]/60 carousel-card flex-shrink-0 w-[270px] sm:w-[310px] md:w-[330px] ${t.featured ? `h-[500px] sm:h-[550px]` : `h-[480px] sm:h-[530px]`} rounded-[2rem] overflow-hidden relative shadow-2xl transition-all duration-500 transform ${t.rotate}${t.rotate !== "rotate-0" ? ` hover:rotate-0` : ``} hover:-translate-y-6 hover:scale-105 hover:z-30 cursor-pointer snap-center group ${t.featured ? `border-2 border-white/40 ` : `border border-white/20 `}`}
      >
        <img
          alt={`${t.alt}`}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
          src={`${t.image}`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black ${t.featured ? `via-black/65 to-black/15` : `via-black/60 to-black/20`}`}
        ></div>
        <div className="relative z-10 h-full p-6 sm:p-7 flex flex-col justify-between text-white">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 text-[11px] font-bold tracking-wider uppercase bg-[#40b830] text-white shadow-sm rounded-none">
              <RichText html={t.badge} />
            </span>
          </div>
          <div>
            <p className="text-sm sm:text-base font-normal leading-relaxed text-slate-100 mb-5 line-clamp-4">
              <RichText html={t.quote} />
            </p>
            <div className="border-t border-white/20 pt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xs text-white border border-white/30">
                <RichText html={t.initials} />
              </div>
              <div>
                <h4
                  className="text-sm sm:text-base font-bold text-white leading-tight"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  <RichText html={t.name} />
                </h4>
                <p className="text-xs text-emerald-300 font-medium">
                  <RichText html={t.university} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

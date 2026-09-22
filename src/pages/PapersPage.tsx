import papers from "../data/papers.json";

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
          <div className="border border-dashed border-slate-300 rounded-[2rem] py-16 px-6 text-center">
            <div className="h-1 w-12 bg-[#40b830] rounded-full mx-auto mb-5"></div>
            <p className="text-2xl font-bold text-[#0B0F19] font-display">
              {papers.comingSoonMessage}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

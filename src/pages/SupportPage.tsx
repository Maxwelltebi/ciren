import { Fragment } from "react";
import supportForm from "../data/supportForm.json";
import ContentForm from "../components/ContentForm";
export default function SupportPage() {
  return (
    <>
      <section className="relative w-full overflow-hidden bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-24 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-white/20"></div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#40b830]">
              Get Involved
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
            {supportForm.heading}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            {supportForm.intro}
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
        id="what-you-support"
      >
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <span
              className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#0B0F19]"
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                letterSpacing: "0.12em",
              }}
            >
              What Your Support Pays For
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {supportForm.whatYouAreSupporting.map((item, index) => (
              <Fragment key={index}>
                <div className="py-1">
                  <h2
                    className="text-base sm:text-lg font-bold text-[#0B0F19] leading-snug mb-2"
                    style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                  >
                    {item.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <section
        className="pt-8 pb-20 lg:pb-24 bg-gradient-to-b from-white via-[#f8f9ff] to-white"
        id="support-form-section"
      >
        <div className="max-w-2xl mx-auto px-6 lg:px-8">
          <div className="bg-white border border-slate-200 shadow-xl rounded-[2rem] overflow-hidden">
            <div className="bg-[#0B0F19] px-6 py-7 sm:px-8">
              <h2
                className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight"
                style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
              >
                Tell Us How You Can Help
              </h2>
              <p className="text-sm text-slate-300 font-normal mt-2 max-w-md">
                Choose the kind of support you have in mind. We read every
                message and reply by email.
              </p>
            </div>

            <ContentForm
              id="support"
              definition={supportForm}
              successMessage="Thank you. We have your details and will be in touch shortly."
            />
          </div>
        </div>
      </section>
    </>
  );
}

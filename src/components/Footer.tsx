import { Fragment } from "react";
import site from "../data/site.json";
import footer from "../data/footer.json";
import SocialIcon from "./SocialIcon";
import FooterColumn from "./FooterColumn";

export default function Footer() {
  return (
    <>
      <div className="pt-16 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 flex items-center justify-center overflow-hidden flex-shrink-0 rounded-lg p-1 bg-white border border-slate-200/60 shadow-sm">
              <img
                src={`${site.logo}`}
                alt="CIReN Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold tracking-wider uppercase text-white leading-tight">
                Campus Innovation &amp; Research
              </span>
              <span className="text-[11px] font-semibold text-[#40b830] tracking-wide uppercase">
                Network (CIReN)
              </span>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed max-w-md">
            Empowering university students, faculty advisors, and campus labs
            across Africa to build breakthrough tech solutions and advance
            global academic research for Africa's most pressing challenges.
          </p>

          <div className="flex items-center gap-4 pt-2 text-slate-400">
            {footer.social.map((i, index) => (
              <Fragment key={index}>
                <SocialIcon i={i} />
              </Fragment>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {footer.columns.map((c, index) => (
            <Fragment key={index}>
              <FooterColumn c={c} />
            </Fragment>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p className="text-center sm:text-left">
          © 2025 Campus Innovation &amp; Research Network (CIReN). All rights
          reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Ethics &amp; Governance
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Campus Charter
          </a>
        </div>
      </div>
    </>
  );
}

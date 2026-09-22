import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import site from "../data/site.json";

export default function Header({ onApply }: { onApply: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const click = (event: MouseEvent) => {
      if (!menu.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menu.current?.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("click", click);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("click", click);
      document.removeEventListener("keydown", key);
    };
  }, [menuOpen]);
  return (
    <>
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link className="flex items-center gap-3.5 group min-w-0" to="/">
              <div className="w-11 h-11 flex items-center justify-center overflow-hidden flex-shrink-0 rounded-lg p-1 bg-slate-50 border border-slate-200/60">
                <img
                  alt="CIReN Logo"
                  className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-200"
                  src={`${site.logo}`}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-bold tracking-wider uppercase text-[#0B0F19] leading-tight truncate">
                  Campus Innovation &amp; Research
                </span>
                <span className="text-[11px] font-semibold text-[#046e00] tracking-wide uppercase truncate">
                  Network (CIReN)
                </span>
              </div>
            </Link>
            <nav className="hidden md:flex items-center gap-8 ml-auto mr-8">
              <Link
                className="text-xs font-semibold tracking-wider uppercase text-slate-700 hover:text-[#046e00] transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#046e00] hover:after:w-full after:transition-all"
                to="/#about-us"
              >
                About Us
              </Link>
              <Link
                className="text-xs font-semibold tracking-wider uppercase text-slate-700 hover:text-[#046e00] transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#046e00] hover:after:w-full after:transition-all"
                to="/programs/"
              >
                Programs
              </Link>
              <Link
                className="text-xs font-semibold tracking-wider uppercase text-slate-700 hover:text-[#046e00] transition-colors py-2 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#046e00] hover:after:w-full after:transition-all"
                to="/papers/"
              >
                Our Papers
              </Link>
            </nav>
            <div className="hidden md:flex items-center gap-3">
              <a
                className="inline-flex items-center justify-center px-4 py-2 bg-[#046e00] hover:bg-[#035800] text-white text-xs font-semibold uppercase tracking-wider rounded-none transition-all shadow-sm ring-1 ring-black/5"
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  setMenuOpen(false);
                  onApply();
                }}
                data-open-apply
                aria-haspopup="dialog"
              >
                Apply
              </a>
              <Link
                className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 hover:border-[#046e00] text-slate-800 hover:text-[#046e00] hover:bg-[#E8F8E5]/50 text-xs font-semibold uppercase tracking-wider rounded-none transition-all shadow-sm"
                to="/support/"
              >
                Support Us
              </Link>
              <button
                aria-label="Search"
                className="p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                type="button"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
            </div>
            <details
              ref={menu}
              open={menuOpen}
              onClick={(event) => {
                if ((event.target as HTMLElement).closest("a,button"))
                  setMenuOpen(false);
              }}
              className="md:hidden relative"
              data-mobile-menu
            >
              <summary
                onClick={(event) => {
                  event.preventDefault();
                  setMenuOpen(!menuOpen);
                }}
                aria-expanded={menuOpen}
                aria-label="Open menu"
                className="list-none cursor-pointer p-2 -mr-2 text-slate-700 hover:text-[#046e00] focus:outline-none focus:ring-2 focus:ring-[#40b830]"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M4 7h16M4 12h16M4 17h16"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </summary>
              <div className="absolute right-0 top-full mt-3 w-64 bg-white border border-slate-200 shadow-xl py-2">
                <Link
                  to="/#about-us"
                  className="block px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-700 hover:bg-slate-50 hover:text-[#046e00] transition-colors"
                >
                  About Us
                </Link>
                <Link
                  to="/programs/"
                  className="block px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-700 hover:bg-slate-50 hover:text-[#046e00] transition-colors"
                >
                  Programs
                </Link>
                <Link
                  to="/papers/"
                  className="block px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-700 hover:bg-slate-50 hover:text-[#046e00] transition-colors"
                >
                  Our Papers
                </Link>
                <div className="border-t border-slate-200 mt-2 pt-3 px-4 pb-1 flex flex-col gap-2">
                  <a
                    className="inline-flex items-center justify-center px-4 py-2.5 bg-[#046e00] hover:bg-[#035800] text-white text-xs font-semibold uppercase tracking-wider rounded-none transition-all shadow-sm"
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      setMenuOpen(false);
                      onApply();
                    }}
                    data-open-apply
                    aria-haspopup="dialog"
                  >
                    Apply
                  </a>
                  <Link
                    className="inline-flex items-center justify-center px-4 py-2.5 border border-slate-300 hover:border-[#046e00] text-slate-800 hover:text-[#046e00] hover:bg-[#E8F8E5]/50 text-xs font-semibold uppercase tracking-wider rounded-none transition-all shadow-sm"
                    to="/support/"
                  >
                    Support Us
                  </Link>
                </div>
              </div>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}

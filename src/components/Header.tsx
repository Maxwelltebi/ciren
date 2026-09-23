import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
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
  const apply = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMenuOpen(false);
    onApply();
  };
  const navigation = [
    { to: "/#about-us", label: "About Us" },
    { to: "/programs/", label: "Programs" },
    { to: "/papers/", label: "Our Papers" },
  ];
  return (
    <header className="site-header sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="site-container flex h-20 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <img
            src={site.logo}
            alt="CIReN Logo"
            className="w-11 h-11 object-contain shrink-0"
          />
          <span className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-[#0b2416]">
              CIReN
            </span>
            <span className="text-[11px] leading-snug text-slate-600 max-w-[190px]">
              Campus Innovation &amp; Research Network
            </span>
          </span>
        </Link>
        <nav
          aria-label="Main navigation"
          className="hidden lg:flex items-center gap-7 ml-auto"
        >
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="text-sm font-semibold text-slate-700 hover:text-[#046e00] py-3 aria-[current=page]:text-[#046e00]"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/support/"
            className="text-sm font-semibold text-[#0b2416] px-4 py-3"
          >
            Support Us
          </Link>
          <a
            href="#"
            onClick={apply}
            aria-haspopup="dialog"
            className="site-button"
          >
            Apply
          </a>
        </div>
        <details
          ref={menu}
          open={menuOpen}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("a,button"))
              setMenuOpen(false);
          }}
          className="lg:hidden relative"
          data-mobile-menu
        >
          <summary
            onClick={(event) => {
              event.preventDefault();
              setMenuOpen(!menuOpen);
            }}
            aria-expanded={menuOpen}
            aria-label="Open menu"
            className="cursor-pointer px-3 py-2 border border-slate-300 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Menu
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute right-0 top-full mt-4 w-64 bg-white border border-slate-200 shadow-lg p-3"
          >
            {navigation.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block p-3 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/support/"
              className="block p-3 text-sm font-semibold text-slate-800"
            >
              Support Us
            </Link>
            <a
              href="#"
              onClick={apply}
              aria-haspopup="dialog"
              className="site-button w-full mt-2"
            >
              Apply
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}

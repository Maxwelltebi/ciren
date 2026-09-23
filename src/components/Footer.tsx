import { Link } from "react-router-dom";
import site from "../data/site.json";

const columns = [
  {
    heading: "Explore CIReN",
    links: [
      { label: "Our story", to: "/#about-us" },
      { label: "Programs", to: "/programs/" },
      { label: "Our Papers", to: "/papers/" },
      { label: "Support Us", to: "/support/" },
    ],
  },
  {
    heading: "Our communities",
    links: [
      { label: "Researchers Society", to: "/programs/#researchers" },
      { label: "Innovators Society", to: "/programs/#innovators" },
      { label: "Events", to: "/programs/#events" },
      { label: "Event gallery", to: "/programs/#gallery" },
    ],
  },
  {
    heading: "Get involved",
    links: [
      { label: "Joining CIReN", to: "/programs/#getting-involved" },
      { label: "Host a campus club", to: "/programs/#questions" },
      { label: "Become a supporter", to: "/support/#support-form-section" },
    ],
  },
];
export default function Footer() {
  return (
    <footer className="pt-12 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 pb-12">
        <div>
          <Link to="/" className="flex items-center gap-3 mb-5">
            <img
              src={site.logo}
              alt="CIReN Logo"
              className="w-11 h-11 bg-white object-contain p-1"
            />
            <span className="text-2xl font-bold tracking-tight text-white">
              CIReN
            </span>
          </Link>
          <p className="text-sm text-slate-300 leading-relaxed max-w-xs">
            Campus Innovation &amp; Research Network
          </p>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs mt-3">
            Connecting African campus communities through research, engineering,
            and a shared drive to make a difference.
          </p>
        </div>
        {columns.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h2 className="text-sm font-bold text-white mb-5">
              {column.heading}
            </h2>
            <ul className="space-y-3 text-sm text-slate-300">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="hover:text-white hover:underline underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/15 pt-6 flex flex-wrap justify-between gap-4 text-xs text-slate-400">
        <p>
          © {new Date().getFullYear()} Campus Innovation &amp; Research Network.
        </p>
        <p>Ideas, people, and possibilities. Across African campuses.</p>
      </div>
    </footer>
  );
}

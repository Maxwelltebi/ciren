import { useCallback, useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Connect from "./components/Connect";
import ApplyModal from "./components/ApplyModal";
import HomePage from "./pages/HomePage";
import ProgramsPage from "./pages/ProgramsPage";
import PapersPage from "./pages/PapersPage";
import SupportPage from "./pages/SupportPage";

function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "CIReN — Campus Innovation & Research Network",
      "/programs": "Programs — CIReN",
      "/papers": "Our Papers — CIReN",
      "/support": "Support Us — CIReN",
    };
    document.title =
      titles[pathname.replace(/\/$/, "") || "/"] ?? "Page not found — CIReN";
    if (hash && hash !== "#") {
      const frame = requestAnimationFrame(() => {
        try {
          document
            .getElementById(decodeURIComponent(hash.slice(1)))
            ?.scrollIntoView();
        } catch {
          /* Ignore malformed external hashes. */
        }
      });
      return () => cancelAnimationFrame(frame);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const [applyOpen, setApplyOpen] = useState(false);
  const closeApply = useCallback(() => setApplyOpen(false), []);
  return (
    <>
      <RouteEffects />
      <Header onApply={() => setApplyOpen(true)} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/papers" element={<PapersPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route
            path="*"
            element={
              <section className="max-w-4xl mx-auto px-6 py-24">
                <h1 className="text-4xl font-display mb-6">Page not found</h1>
                <Link className="text-[#046e00] underline" to="/">
                  Return to the home page
                </Link>
              </section>
            }
          />
        </Routes>
      </main>
      <Connect />
      <ApplyModal open={applyOpen} onClose={closeApply} />
    </>
  );
}

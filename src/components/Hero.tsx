import { Link } from "react-router-dom";
import home from "../data/home.json";

const Arrow = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path
      d="M5 12h13M13 6l6 6-6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// The homepage hero: full width, a pale left side with the headline and a deep
// green panel running to the right edge of the page.
export default function Hero({ onApply }: { onApply: () => void }) {
  const { hero } = home;
  return (
    <section className="home-hero">
      <div className="home-hero-copy">
        <p className="eyebrow">Campus Innovation &amp; Research Network</p>
        <h1>{hero.headline}</h1>
        <p className="intro-description">{hero.intro}</p>
        <div className="action-row">
          <button
            type="button"
            onClick={onApply}
            aria-haspopup="dialog"
            className="icon-button"
          >
            <span>Find your place at CIReN</span>
            <span className="icon-button-cap">
              <Arrow />
            </span>
          </button>
        </div>
      </div>

      <div className="home-hero-panel-ground" aria-hidden="true" />
      <div className="home-hero-panel">
        <div className="home-hero-event">
          <p className="eyebrow">{hero.latestEvent.label}</p>
          <p className="home-hero-panel-title">{hero.latestEvent.title}</p>
          <Link to={hero.latestEvent.href} className="text-link">
            {hero.latestEvent.linkLabel}
          </Link>
        </div>
        <div className="home-hero-programs">
          <p className="eyebrow">{hero.ctaEyebrow}</p>
          <Link to="/programs/" className="home-hero-programs-link">
            <span className="home-hero-panel-title">{hero.ctaLabel}</span>
            <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

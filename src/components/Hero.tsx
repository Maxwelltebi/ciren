import { Link } from "react-router-dom";
import home from "../data/home.json";
import PageIntro from "./PageIntro";

export default function Hero({ onApply }: { onApply: () => void }) {
  return (
    <PageIntro
      eyebrow="Campus Innovation & Research Network"
      title={home.hero.headline}
      intro={home.hero.intro}
      image={home.hero.image}
      imageAlt={home.hero.imageAlt}
      caption="CIReN Mini Hackathon x MLH"
    >
      <button
        type="button"
        onClick={onApply}
        aria-haspopup="dialog"
        className="site-button"
      >
        Find your place at CIReN
      </button>
      <Link to="/programs/" className="site-button site-button-outline">
        Explore our programs
      </Link>
    </PageIntro>
  );
}

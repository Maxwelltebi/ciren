import { Link } from "react-router-dom";

export default function JoinBanner({ onApply }: { onApply: () => void }) {
  return (
    <section className="join-banner">
      <div className="site-container join-banner-inner">
        <div>
          <p className="eyebrow">Your next chapter</p>
          <h2>There’s a place for your ideas here.</h2>
          <p>
            Join the network, help build a campus community, or support the
            people doing the work.
          </p>
        </div>
        <div className="action-row">
          <button
            type="button"
            onClick={onApply}
            aria-haspopup="dialog"
            className="site-button"
          >
            Join CIReN
          </button>
          <Link to="/support/" className="site-button site-button-outline">
            Support the network
          </Link>
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import ResponsiveImage from "./ResponsiveImage";
import { HALF_WIDTH } from "../lib/imageSizes";

export default function About() {
  return (
    <section className="editorial-section" id="about-us">
      <div className="site-container editorial-split">
        <figure className="editorial-photo">
          <ResponsiveImage
            src="/assets/images/events/ciren-mini-hackathon-mlh/mlh-hack3.webp"
            alt="Participants collaborating around a laptop at CIReN Mini Hackathon x MLH"
            sizes={HALF_WIDTH}
            className="frame"
          />
          <figcaption>
            Ideas take shape when people work on them together.
          </figcaption>
        </figure>
        <div className="editorial-copy">
          <SectionHeading
            eyebrow="Why we exist"
            title="Talent is everywhere. A community makes the difference."
          />
          <p>
            Campus Innovation &amp; Research Network brings African university
            students, researchers, faculty advisors, and campus labs together
            around a shared ambition: to build and investigate things that
            matter.
          </p>
          <p>
            We connect the curiosity of a research lab with the energy of a
            build event. Through campus societies, hackathons, and research
            activities, we create space for students to learn from one another
            and move their ideas forward.
          </p>
          <p>
            Our story starts on campus, with people willing to ask better
            questions and work on the answers together.
          </p>
          <Link to="/programs/" className="text-link">
            Get to know our programs
          </Link>
        </div>
      </div>
    </section>
  );
}

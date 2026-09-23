import { Link } from "react-router-dom";
import papers from "../data/papers.json";
import PageIntro from "../components/PageIntro";
import SectionNav from "../components/SectionNav";
import SectionHeading from "../components/SectionHeading";

export default function PapersPage() {
  return (
    <>
      <PageIntro
        eyebrow="Research at CIReN"
        title={papers.heading}
        intro="Good research begins with a question worth pursuing. We are building a community where students can develop their methods, discuss their findings, and prepare their work for a wider audience."
        image="/assets/images/events/ciren-mini-hackathon-mlh/mlh-hack6.jpg"
        imageAlt="A hackathon participant discussing an idea"
        caption="A conversation today can become a research question tomorrow."
      >
        <Link to="/programs/#researchers" className="site-button">
          Meet the Researchers Society
        </Link>
        <a href="/papers/#papers" className="site-button site-button-outline">
          Publication updates
        </a>
      </PageIntro>
      <SectionNav
        label="Research sections"
        items={[
          { label: "Publications", href: "/papers/#papers" },
          { label: "Our approach", href: "/papers/#research-approach" },
          { label: "Get involved", href: "/programs/#researchers" },
        ]}
      />
      <section className="editorial-section" id="papers">
        <div className="site-container editorial-split">
          <SectionHeading
            eyebrow="The publication collection"
            title="A home for work from the network."
            intro="This page will bring together research from CIReN, with the people behind each paper and links to read the work."
          />
          <div className="publication-status">
            <p className="eyebrow">Publication updates</p>
            <h2>{papers.comingSoonMessage}</h2>
            <p>
              There are no papers listed yet. We will share publications here as
              they become available.
            </p>
            <Link className="text-link" to="/programs/#researchers">
              Explore our research community
            </Link>
          </div>
        </div>
      </section>
      <section
        className="editorial-section editorial-soft"
        id="research-approach"
      >
        <div className="site-container">
          <SectionHeading
            eyebrow="Our approach"
            title="From a good question to work you can share."
            intro="The Researchers Society creates a space to develop the habits behind thoughtful, rigorous research."
          />
          <div className="editorial-grid-three">
            <article className="editorial-step">
              <span className="step-number">01</span>
              <h3>Frame the question</h3>
              <p className="step-copy">
                Identify a problem, explore what is already known, and consider
                what your work could contribute.
              </p>
            </article>
            <article className="editorial-step">
              <span className="step-number">02</span>
              <h3>Develop the method</h3>
              <p className="step-copy">
                Learn research methodologies, discuss your approach with peers,
                and build a clear connection between your question and the
                evidence.
              </p>
            </article>
            <article className="editorial-step">
              <span className="step-number">03</span>
              <h3>Share the findings</h3>
              <p className="step-copy">
                Prepare to communicate what you found, invite feedback, and take
                your work towards presentation and publication.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="editorial-section">
        <div className="site-container editorial-split">
          <figure className="editorial-photo">
            <img
              src="/assets/images/events/ciren-mini-hackathon-mlh/mlh-hack5.jpg"
              alt="Participants reviewing their work together"
              loading="lazy"
            />
            <figcaption>
              Thoughtful work benefits from another perspective.
            </figcaption>
          </figure>
          <div className="editorial-copy">
            <SectionHeading
              eyebrow="Research is a shared effort"
              title="Bring a question. Find a community."
            />
            <p>
              Whether you are a student exploring an interest, a researcher
              developing a project, or a faculty advisor supporting others,
              there is a place to begin a conversation in CIReN.
            </p>
            <p>
              Get to know the Researchers Society and the network of campus
              activities around it.
            </p>
            <Link className="site-button mt-6" to="/programs/#researchers">
              Explore the Researchers Society
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

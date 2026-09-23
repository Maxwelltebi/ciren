import { Link } from "react-router-dom";
import programs from "../data/programs.json";
import editorial from "../data/editorial.json";
import FlipCard from "../components/FlipCard";
import EventGallery from "../components/EventGallery";
import PageIntro from "../components/PageIntro";
import SectionNav from "../components/SectionNav";
import SectionHeading from "../components/SectionHeading";
import Questions from "../components/Questions";
import JoinBanner from "../components/JoinBanner";

export default function ProgramsPage({ onApply }: { onApply: () => void }) {
  return (
    <>
      <PageIntro
        eyebrow="Learn together. Build with purpose."
        title={programs.heading}
        intro={programs.intro}
        image="/assets/images/events/ciren-mini-hackathon-mlh/mlh-hack4.jpg"
        imageAlt="Hackathon participants discussing their project at a laptop"
        caption="Learning alongside one another at CIReN Mini Hackathon x MLH"
      >
        <button
          type="button"
          className="site-button"
          onClick={onApply}
          aria-haspopup="dialog"
        >
          Join a campus community
        </button>
        <Link
          to="/programs/#societies"
          className="site-button site-button-outline"
        >
          Find your society
        </Link>
      </PageIntro>
      <SectionNav
        label="Programs sections"
        items={[
          { label: "Societies", href: "/programs/#societies" },
          { label: "Getting involved", href: "/programs/#getting-involved" },
          { label: "Events", href: "/programs/#events" },
          { label: "Gallery", href: "/programs/#gallery" },
          { label: "Questions", href: "/programs/#questions" },
        ]}
      />
      <section className="editorial-section" id="societies">
        <div className="site-container">
          <SectionHeading
            eyebrow="Our campus societies"
            title="Two ways into the same community."
            intro="Follow your interests in research or engineering. Both societies are built around people learning from one another and putting their ideas into practice."
          />
          {programs.societies.map((society, index) => (
            <article
              className="society-detail"
              id={index === 0 ? "researchers" : "innovators"}
              key={society.name}
            >
              <FlipCard c={society} />
              <div>
                <p className="eyebrow">
                  {index === 0
                    ? "Ask better questions"
                    : "Make something useful"}
                </p>
                <h3>{society.name}</h3>
                <p>{society.description}</p>
                <ul className="topic-list">
                  {(index === 0
                    ? editorial.programs.researchActivities
                    : editorial.programs.innovationActivities
                  ).map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="text-link"
                  onClick={onApply}
                  aria-haspopup="dialog"
                >
                  Apply to join the network
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section
        className="editorial-section editorial-dark"
        id="getting-involved"
      >
        <div className="site-container">
          <SectionHeading
            eyebrow="Getting involved"
            title="Start with your interests. Grow from there."
            intro="Tell us where you are and what you want to work on. You can apply to join the network or explore hosting a club on your campus."
          />
          <div className="editorial-grid-three">
            {editorial.programs.pathway.map((step, index) => (
              <article className="editorial-step" key={step.title}>
                <span className="step-number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p className="step-copy">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="editorial-section editorial-soft" id="events">
        <div className="site-container">
          <SectionHeading
            eyebrow="Our events"
            title="A reason to come together. A place to share the work."
            intro="Events bring people out of their individual projects and into a wider conversation. These are the formats at the heart of our work."
          />
          <div className="editorial-grid-two">
            {programs.events.map((event) => (
              <div key={event.name}>
                <FlipCard c={event} />
              </div>
            ))}
          </div>
          <p className="section-description max-w-3xl mt-8">
            Our CIReN Mini Hackathon x MLH brought students together to work on
            ideas, exchange perspectives, and build. Take a look at the event in
            the gallery below.
          </p>
        </div>
      </section>
      <EventGallery />
      <Questions items={editorial.programs.questions} />
      <JoinBanner onApply={onApply} />
    </>
  );
}

import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import About from "../components/About";
import PartnersMarquee from "../components/PartnersMarquee";
import Testimonials from "../components/Testimonials";
import SectionNav from "../components/SectionNav";
import SectionHeading from "../components/SectionHeading";
import JoinBanner from "../components/JoinBanner";
import editorial from "../data/editorial.json";

export default function HomePage({ onApply }: { onApply: () => void }) {
  return (
    <>
      <Hero onApply={onApply} />
      <SectionNav
        label="Homepage sections"
        items={[
          { label: "The CIReN experience", href: "/#experience" },
          { label: "Our story", href: "/#about-us" },
          { label: "Our communities", href: "/#communities" },
          { label: "Campus in action", href: "/#campus-in-action" },
        ]}
      />
      <PartnersMarquee />
      <section className="editorial-section" id="experience">
        <div className="site-container">
          <SectionHeading
            eyebrow="The CIReN experience"
            title="Find your people. Put your ideas to work."
            intro="A community for the questions you want to investigate and the things you want to build. Here is where it begins."
          />
          <div className="editorial-grid-three">
            {editorial.home.overview.map((item, index) => (
              <article className="editorial-step" key={item.title}>
                <span className="step-number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p className="step-copy">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <About />
      <section className="editorial-section editorial-soft" id="communities">
        <div className="site-container">
          <SectionHeading
            eyebrow="Two communities. One network."
            title="Follow the question. Or build the answer."
            intro="Research and innovation belong together. Find a starting point that matches your interests, then learn from the people around you."
          />
          <div className="editorial-grid-two">
            <article className="program-feature">
              <img
                src="/assets/images/events/ciren-mini-hackathon-mlh/mlh-hack6.jpg"
                alt="A participant discussing an idea beside a laptop"
                loading="lazy"
              />
              <div className="program-feature-copy">
                <p className="eyebrow">Investigate</p>
                <h3>Researchers Society</h3>
                <p>
                  Develop research methods, explore questions with your peers,
                  and prepare to communicate work beyond your campus.
                </p>
                <Link className="text-link" to="/programs/#researchers">
                  Explore the Researchers Society
                </Link>
              </div>
            </article>
            <article className="program-feature">
              <img
                src="/assets/images/events/ciren-mini-hackathon-mlh/mlh-hack2.jpg"
                alt="A Central University participant working on code"
                loading="lazy"
              />
              <div className="program-feature-copy">
                <p className="eyebrow">Create</p>
                <h3>Innovators Society</h3>
                <p>
                  Build alongside other engineers. Explore software, AI, and
                  applied machine learning through practical projects and shared
                  problem solving.
                </p>
                <Link className="text-link" to="/programs/#innovators">
                  Explore the Innovators Society
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
      <section className="editorial-section">
        <div className="site-container editorial-split">
          <SectionHeading
            eyebrow="More than a campus activity"
            title="Good work grows through connection."
            intro="CIReN is built around the idea that students can go further when they have people to learn with, problems to work on, and a reason to share what they find."
          />
          <div className="benefit-grid">
            {editorial.home.benefits.map((item) => (
              <article className="benefit-item" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        className="editorial-section editorial-soft"
        id="campus-in-action"
      >
        <div className="site-container">
          <SectionHeading
            eyebrow="Campus in action"
            title="This is what coming together looks like."
          />
          <div className="event-recap">
            <img
              src="/assets/images/events/ciren-mini-hackathon-mlh/mlh-hack1.jpg"
              alt="The CIReN Mini Hackathon x MLH participants together"
              loading="lazy"
            />
            <div>
              <p className="eyebrow">From our event gallery</p>
              <h3>CIReN Mini Hackathon x MLH</h3>
              <p>
                Students at their laptops. Teams working through ideas.
                Conversations that carry a project forward. Our Mini Hackathon
                brought the CIReN community together to build and learn.
              </p>
              <p className="mt-4">
                Explore the moments captured during the event, from team
                discussions to the group photo.
              </p>
              <Link className="text-link" to="/programs/#gallery">
                See the event photos
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Testimonials />
      <JoinBanner onApply={onApply} />
    </>
  );
}

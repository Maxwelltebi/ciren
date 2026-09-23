import supportForm from "../data/supportForm.json";
import editorial from "../data/editorial.json";
import ContentForm from "../components/ContentForm";
import PageIntro from "../components/PageIntro";
import SectionNav from "../components/SectionNav";
import SectionHeading from "../components/SectionHeading";
import PartnersMarquee from "../components/PartnersMarquee";
import Questions from "../components/Questions";

export default function SupportPage() {
  return (
    <>
      <PageIntro
        eyebrow="Help the next idea take shape"
        title={supportForm.heading}
        intro="A place to meet. A connection to a mentor. The equipment to try an idea. Your support helps make the practical parts of campus innovation and research possible."
        image="/assets/images/events/ciren-mini-hackathon-mlh/mlh-hack1.jpg"
        imageAlt="Students gathered for CIReN Mini Hackathon x MLH"
        caption="The people at the heart of CIReN Mini Hackathon x MLH"
      >
        <a className="site-button" href="/support/#support-form-section">
          Tell us how you can help
        </a>
        <a
          className="site-button site-button-outline"
          href="/support/#what-you-support"
        >
          Explore our priorities
        </a>
      </PageIntro>
      <SectionNav
        label="Support sections"
        items={[
          { label: "What you support", href: "/support/#what-you-support" },
          { label: "Ways to help", href: "/support/#ways-to-help" },
          { label: "Get in touch", href: "/support/#support-form-section" },
          { label: "Questions", href: "/support/#questions" },
        ]}
      />
      <section className="editorial-section" id="what-you-support">
        <div className="site-container editorial-split">
          <div>
            <SectionHeading
              eyebrow="What your support makes possible"
              title="Small practical things. Meaningful possibilities."
              intro="Campus communities need more than good ideas. These are the areas where support can help students develop, build, and share their work."
            />
            <figure className="editorial-photo">
              <img
                src="/assets/images/events/ciren-mini-hackathon-mlh/mlh-hack7.jpg"
                alt="A participant concentrating on their project at the hackathon"
                loading="lazy"
              />
            </figure>
          </div>
          <div className="benefit-grid">
            {supportForm.whatYouAreSupporting.map((item) => (
              <article className="benefit-item" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="editorial-section editorial-soft" id="ways-to-help">
        <div className="site-container">
          <SectionHeading
            eyebrow="Ways to help"
            title="Bring what you can. Help move the work forward."
            intro="Financial contributions are one route. Time, experience, equipment, and connections can make a difference too."
          />
          <div className="editorial-grid-three">
            {editorial.support.ways.map((item, index) => (
              <article className="editorial-step" key={item.title}>
                <span className="step-number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p className="step-copy">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <PartnersMarquee />
      <section
        className="editorial-section editorial-soft"
        id="support-form-section"
      >
        <div className="site-container support-form-layout">
          <div className="editorial-copy">
            <SectionHeading
              eyebrow="Start a conversation"
              title="Let’s find the right way to work together."
              intro="Tell us who you are and what you have in mind. You can share an idea for an event, offer a resource, or explore supporting a campus community."
            />
            <p>
              Use the form to choose a financial contribution or another kind of
              support. If you are contacting us on behalf of an organisation,
              include its name so we have the context.
            </p>
            <p>
              Interested in mentorship, equipment, or a venue? Choose “Another
              kind of support” and describe what you could offer.
            </p>
          </div>
          <div className="support-form-card">
            <div className="support-form-heading">
              <h3>Tell us how you can help</h3>
              <p>Choose the type of support and leave your contact details.</p>
            </div>
            <ContentForm
              id="support"
              definition={supportForm}
              successMessage="Thank you. We have your details and will be in touch shortly."
            />
          </div>
        </div>
      </section>
      <Questions items={editorial.support.questions} />
    </>
  );
}

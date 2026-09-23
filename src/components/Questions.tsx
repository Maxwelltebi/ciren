import SectionHeading from "./SectionHeading";

export default function Questions({
  items,
  id = "questions",
}: {
  items: { question: string; answer: string }[];
  id?: string;
}) {
  return (
    <section className="editorial-section" id={id}>
      <div className="site-container questions-layout">
        <SectionHeading
          eyebrow="Before you get started"
          title="A few things to know."
          intro="Find the route into CIReN that fits you, your work, or your campus."
        />
        <div className="question-list">
          {items.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

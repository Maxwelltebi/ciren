// Only repository-authored content may use this component. Never pass form input
// or untrusted API content here. Some existing copy contains <strong>/<br>/SVG.
export default function RichText({ html }: { html: string }) {
  return (
    <span
      style={{ display: "contents" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

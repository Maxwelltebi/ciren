export default function SectionNav({
  items,
  label,
}: {
  items: { label: string; href: string }[];
  label: string;
}) {
  return (
    <nav className="section-navigation" aria-label={label}>
      <div className="site-container">
        <span className="section-navigation-label">On this page</span>
        <div className="section-navigation-links">
          {items.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

import RichText from "./RichText";

export default function StatItem({
  s,
}: {
  s: { colourClass: string; value: string; label: string };
}) {
  return (
    <>
      <div className="flex items-baseline gap-3">
        <span
          className={`text-3xl lg:text-4xl font-extrabold ${s.colourClass}`}
        >
          <RichText html={s.value} />
        </span>
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider whitespace-nowrap">
          <RichText html={s.label} />
        </span>
      </div>
      <div className="h-8 w-px bg-slate-200/90 shrink-0"></div>
    </>
  );
}

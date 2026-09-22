import RichText from "./RichText";

export default function SocialIcon({
  i,
}: {
  i: { label: string; svg: string };
}) {
  return (
    <>
      <a
        href="#"
        aria-label={`${i.label}`}
        className="w-9 h-9 flex items-center justify-center rounded-none bg-white/5 hover:bg-[#40b830] hover:text-white transition-all text-slate-300"
      >
        <RichText html={i.svg} />
      </a>
    </>
  );
}

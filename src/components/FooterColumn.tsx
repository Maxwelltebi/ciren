import { Fragment } from "react";
import RichText from "./RichText";

export default function FooterColumn({
  c,
}: {
  c: { wrapperClass?: string; heading: string; links: { label: string }[] };
}) {
  return (
    <>
      <div className={c.wrapperClass}>
        <h4
          className="text-sm font-bold uppercase tracking-wider text-white mb-4"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            letterSpacing: "0.08em",
          }}
        >
          <RichText html={c.heading} />
        </h4>
        <ul className="space-y-2.5 text-sm text-slate-300 font-normal">
          {c.links.map((l, index) => (
            <Fragment key={index}>
              <li className="">
                <a href="#" className="hover:text-[#40b830] transition-colors">
                  <RichText html={l.label} />
                </a>
              </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </>
  );
}

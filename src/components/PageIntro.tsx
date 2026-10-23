import type { ReactNode } from "react";
import ResponsiveImage from "./ResponsiveImage";
import { PAGE_INTRO } from "../lib/imageSizes";

interface Props {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  caption: string;
  children?: ReactNode;
}

export default function PageIntro({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  caption,
  children,
}: Props) {
  return (
    <section className="page-intro">
      <div className="site-container page-intro-grid">
        <div className="page-intro-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="intro-description">{intro}</p>
          {children && <div className="action-row">{children}</div>}
        </div>
        <figure className="page-intro-photo frame frame-on-dark">
          <ResponsiveImage
            src={image}
            alt={imageAlt}
            sizes={PAGE_INTRO}
            priority
          />
          <figcaption>{caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}

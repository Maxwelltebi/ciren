import { useEffect, useRef } from "react";
import type { BlogPost } from "../types/content";
import { scrollBehavior, useShowroom } from "../hooks/useShowroom";
import ResponsiveImage from "./ResponsiveImage";

export default function BlogShowroom({
  posts,
  selected,
  onSelect,
}: {
  posts: BlogPost[];
  selected: string;
  onSelect: (slug: string) => void;
}) {
  const { stage, atStart, atEnd, move, centre, dragHandlers } = useShowroom();
  const index = posts.findIndex((post) => post.slug === selected);
  const firstRender = useRef(true);

  useEffect(() => {
    centre(index, firstRender.current ? "auto" : scrollBehavior());
    firstRender.current = false;
  }, [centre, index]);

  return (
    <div className="blog-showroom">
      <ul ref={stage} className="blog-stage" {...dragHandlers}>
        {posts.map((post) => {
          const current = post.slug === selected;
          return (
            <li className="blog-slot" key={post.slug}>
              <div className="blog-tilt">
                <button
                  type="button"
                  aria-current={current ? "true" : undefined}
                  onClick={() => onSelect(post.slug)}
                  className="blog-card frame frame-on-dark frame-lift"
                >
                  <ResponsiveImage
                    src={post.image}
                    alt=""
                    sizes="(max-width: 640px) 70vw, 420px"
                    draggable={false}
                  />
                  {current && <span className="blog-card-badge">Reading</span>}
                  <span className="blog-card-title">{post.title}</span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {!(atStart && atEnd) && (
        <div className="blog-showroom-controls">
          <button
            type="button"
            aria-label="Show earlier cards"
            disabled={atStart}
            onClick={() => move(-1)}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Show more cards"
            disabled={atEnd}
            onClick={() => move(1)}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

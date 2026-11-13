import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import blog from "../data/blog.json";
import type { BlogPost } from "../types/content";
import BlogShowroom from "../components/BlogShowroom";
import ResponsiveImage from "../components/ResponsiveImage";
import { scrollBehavior } from "../hooks/useShowroom";

// ISO dates sort as plain text, so the newest post comes first. The cast
// keeps the type when the JSON list is empty (TypeScript reads [] as never[]).
const posts: BlogPost[] = [...(blog.posts as BlogPost[])].sort((a, b) =>
  b.date.localeCompare(a.date),
);
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export default function BlogPage() {
  const [params, setParams] = useSearchParams();
  const article = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const showroom = useRef<HTMLElement>(null);
  const post =
    posts.find((item) => item.slug === params.get("post")) ?? posts[0];

  const select = (slug: string) => {
    setParams({ post: slug });
    article.current?.scrollIntoView({ behavior: scrollBehavior() });
    heading.current?.focus({ preventScroll: true });
  };
  const backToCards = () => {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
    showroom.current
      ?.querySelector<HTMLElement>("[aria-current]")
      ?.focus({ preventScroll: true });
  };

  return (
    <>
      <section ref={showroom} className="page-intro blog-intro">
        <div className="site-container">
          <h1>{blog.heading}</h1>
          <p className="intro-description">{blog.intro}</p>
        </div>
        {post && (
          <BlogShowroom posts={posts} selected={post.slug} onSelect={select} />
        )}
      </section>
      {post ? (
        <section ref={article} className="editorial-section blog-reader">
          <article className="blog-article">
            <header className="section-heading">
              <p className="eyebrow">
                {post === posts[0] ? "Latest post" : "From the blog"}
              </p>
              <h2 ref={heading} tabIndex={-1}>
                {post.title}
              </h2>
              <p className="blog-meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {" · "}
                {post.author}
              </p>
            </header>
            <div className="blog-article-body" key={post.slug}>
              <figure className="blog-article-photo">
                <ResponsiveImage
                  src={post.image}
                  alt={post.imageAlt}
                  sizes="(max-width: 800px) 100vw, 736px"
                  className="frame"
                />
              </figure>
              {post.body.map((section, index) => (
                <div key={index}>
                  {section.heading && <h3>{section.heading}</h3>}
                  {section.paragraphs.map((paragraph, line) => (
                    <p key={line}>{paragraph}</p>
                  ))}
                </div>
              ))}
            </div>
            <button type="button" className="text-link" onClick={backToCards}>
              Browse more posts
            </button>
          </article>
        </section>
      ) : (
        <section className="editorial-section">
          <div className="site-container blog-empty">
            <h2>{blog.comingSoonMessage}</h2>
            <p>There are no posts yet. We will share them here soon.</p>
          </div>
        </section>
      )}
    </>
  );
}

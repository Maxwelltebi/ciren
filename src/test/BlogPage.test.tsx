import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import BlogPage from "../pages/BlogPage";
import blog from "../data/blog.json";
import images from "../data/images.json";
import type { BlogPost } from "../types/content";

// The real blog fills from Gmail drafts and may be empty, so these tests run
// on fixed sample posts. The real posts are checked in the last test.
vi.mock("../data/blog.json", async (importOriginal) => {
  const real = (await importOriginal<{ default: typeof import("../data/blog.json") }>()).default;
  const post = (slug: string, title: string, date: string, text: string) => ({
    slug,
    title,
    date,
    author: "CIReN Team",
    image: `/assets/images/blog/${slug}.webp`,
    imageAlt: `Illustration for ${title}`,
    body: [{ paragraphs: [text] }],
  });
  return {
    default: {
      ...real,
      posts: [
        post("middle-post", "Middle Post", "2026-10-14", "Middle text."),
        post("newest-post", "Newest Post", "2026-10-28", "Newest text."),
        post("oldest-post", "Oldest Post", "2026-09-30", "Oldest text."),
      ],
      realPosts: real.posts,
    },
  };
});
const realPosts = (blog as unknown as { realPosts: BlogPost[] }).realPosts;

const newestFirst = [...(blog.posts as BlogPost[])].sort((a, b) =>
  b.date.localeCompare(a.date),
);
const latest = newestFirst[0];
const older = newestFirst[newestFirst.length - 1];

function renderBlog(path = "/blog/") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <BlogPage />
    </MemoryRouter>,
  );
}
const card = (title: string) =>
  screen.getByRole("button", { name: new RegExp(title) });
const reader = () => screen.getByRole("article");

describe("blog showroom", () => {
  it("shows one card per post, newest first, with the latest post open", () => {
    renderBlog();
    const titles = screen
      .getAllByRole("listitem")
      .map((item) => within(item).getByRole("button").textContent);
    expect(titles).toHaveLength(blog.posts.length);
    expect(titles[0]).toContain(latest.title);
    expect(
      within(reader()).getByRole("heading", { level: 2, name: latest.title }),
    ).toBeInTheDocument();
    expect(within(reader()).getByText("Latest post")).toBeInTheDocument();
    expect(card(latest.title)).toHaveAttribute("aria-current", "true");
  });

  it("opens the chosen post underneath the cards", async () => {
    renderBlog();
    await userEvent.click(card(older.title));
    const heading = within(reader()).getByRole("heading", {
      level: 2,
      name: older.title,
    });
    expect(heading).toHaveFocus();
    expect(
      within(reader()).getByText(older.body[0].paragraphs[0]),
    ).toBeInTheDocument();
    expect(
      within(reader()).queryByText(latest.body[0].paragraphs[0]),
    ).not.toBeInTheDocument();
    expect(card(older.title)).toHaveAttribute("aria-current", "true");
    expect(card(latest.title)).not.toHaveAttribute("aria-current");
  });

  it("opens a post from its link and falls back to the latest for an unknown one", () => {
    const { unmount } = renderBlog(`/blog/?post=${older.slug}`);
    expect(
      within(reader()).getByRole("heading", { level: 2, name: older.title }),
    ).toBeInTheDocument();
    unmount();
    renderBlog("/blog/?post=missing");
    expect(
      within(reader()).getByRole("heading", { level: 2, name: latest.title }),
    ).toBeInTheDocument();
  });

  it("gives every real post a unique slug, a date, an image and an image description", () => {
    expect(new Set(realPosts.map((post) => post.slug)).size).toBe(
      realPosts.length,
    );
    for (const post of realPosts) {
      expect(post.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.image).toMatch(/^\/assets\/images\/blog\/.+\.webp$/);
      // Present in the manifest only once `npm run images` has built the file.
      expect(images).toHaveProperty([post.image]);
      expect(post.imageAlt).not.toBe("");
      expect(post.body.length).toBeGreaterThan(0);
    }
  });

  it("returns to the current card from the end of a post", async () => {
    renderBlog();
    await userEvent.click(
      screen.getByRole("button", { name: "Browse more posts" }),
    );
    expect(window.scrollTo).toHaveBeenCalled();
    expect(card(latest.title)).toHaveFocus();
  });
});

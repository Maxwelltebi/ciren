import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import BlogPage from "../pages/BlogPage";
import blog from "../data/blog.json";

const newestFirst = [...blog.posts].sort((a, b) =>
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

  it("gives every post a unique slug and an image description", () => {
    expect(new Set(blog.posts.map((post) => post.slug)).size).toBe(
      blog.posts.length,
    );
    for (const post of blog.posts) expect(post.imageAlt).not.toBe("");
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

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, it, vi } from "vitest";
import BlogPage from "../pages/BlogPage";

vi.mock("../data/blog.json", () => ({
  default: {
    heading: "Community Blog",
    intro: "Intro",
    comingSoonMessage: "Coming Soon...",
    posts: [],
  },
}));

it("shows a coming soon message when there are no posts", () => {
  render(
    <MemoryRouter>
      <BlogPage />
    </MemoryRouter>,
  );
  expect(
    screen.getByRole("heading", { level: 1, name: "Community Blog" }),
  ).toBeInTheDocument();
  expect(screen.getByText("Coming Soon...")).toBeInTheDocument();
  expect(screen.queryByRole("article")).not.toBeInTheDocument();
});

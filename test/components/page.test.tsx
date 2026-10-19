import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import Page from "@/app/page";
import * as api from "@/lib/api";

describe("Page component", () => {
  it("renders with posts and matches snapshot", async () => {
    vi.spyOn(api, "getAllPosts").mockResolvedValueOnce([
      {
        title: "Main Featured Post",
        coverImage: { url: "https://images.ctfassets.net/main.jpg" },
        date: "2026-03-01T00:00:00.000Z",
        excerpt: "Main post excerpt",
        author: {
          name: "Alice",
          picture: { url: "https://images.ctfassets.net/alice.jpg" },
        },
        slug: "main-featured-post",
      },
      {
        title: "Secondary Post",
        coverImage: { url: "https://images.ctfassets.net/secondary.jpg" },
        date: "2026-02-15T00:00:00.000Z",
        excerpt: "Secondary post excerpt",
        author: {
          name: "Bob",
          picture: { url: "https://images.ctfassets.net/bob.jpg" },
        },
        slug: "secondary-post",
      },
    ]);

    const pageElement = await Page();
    const { container } = render(pageElement);
    expect(container).toMatchSnapshot();
  });

  it("renders empty state when no posts found and matches snapshot", async () => {
    vi.spyOn(api, "getAllPosts").mockResolvedValueOnce([]);

    const pageElement = await Page();
    const { container } = render(pageElement);
    expect(container).toMatchSnapshot();
  });
});

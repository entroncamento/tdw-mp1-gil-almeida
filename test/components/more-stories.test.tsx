import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import MoreStories from "@/app/more-stories";

describe("MoreStories component", () => {
  const mockPosts = [
    {
      title: "Story 1",
      coverImage: { url: "https://images.ctfassets.net/story1.jpg" },
      date: "2026-01-10T00:00:00.000Z",
      excerpt: "Excerpt for story 1",
      author: {
        name: "Jane Doe",
        picture: { url: "https://images.ctfassets.net/jane.jpg" },
      },
      slug: "story-1",
    },
    {
      title: "Story 2",
      coverImage: { url: "https://images.ctfassets.net/story2.jpg" },
      date: "2026-02-20T00:00:00.000Z",
      excerpt: "Excerpt for story 2",
      author: null,
      slug: "story-2",
    },
  ];

  it("renders multiple stories and matches snapshot", () => {
    const { container } = render(<MoreStories morePosts={mockPosts} />);
    expect(container).toMatchSnapshot();
  });
});

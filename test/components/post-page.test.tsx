import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import PostPage from "@/app/posts/[slug]/page";
import * as api from "@/lib/api";

describe("PostPage component", () => {
  it("renders post details and matches snapshot", async () => {
    vi.spyOn(api, "getPostAndMorePosts").mockResolvedValueOnce({
      post: {
        title: "Test Post Title",
        coverImage: { url: "https://images.ctfassets.net/post.jpg" },
        date: "2026-03-10T00:00:00.000Z",
        author: {
          name: "Author Name",
          picture: { url: "https://images.ctfassets.net/author.jpg" },
        },
        content: {
          json: {
            nodeType: "document",
            data: {},
            content: [
              {
                nodeType: "paragraph",
                data: {},
                content: [
                  {
                    nodeType: "text",
                    value: "Content of the post.",
                    marks: [],
                    data: {},
                  },
                ],
              },
            ],
          },
          links: {
            assets: {
              block: [],
            },
          },
        },
      },
      morePosts: [],
    });

    const pageElement = await PostPage({
      params: Promise.resolve({ slug: "test-post-title" }),
    });
    const { container } = render(pageElement);
    expect(container).toMatchSnapshot();
  });

  it("renders not found state when post does not exist and matches snapshot", async () => {
    vi.spyOn(api, "getPostAndMorePosts").mockResolvedValueOnce({
      post: null,
      morePosts: [],
    });

    const pageElement = await PostPage({
      params: Promise.resolve({ slug: "non-existent" }),
    });
    const { container } = render(pageElement);
    expect(container).toMatchSnapshot();
  });

  it("generates static params with posts and fallback", async () => {
    const { generateStaticParams } = await import("@/app/posts/[slug]/page");
    vi.spyOn(api, "getAllPosts").mockResolvedValueOnce([
      { slug: "post-1" },
      { slug: "post-2" },
    ]);
    const params = await generateStaticParams();
    expect(params).toEqual([{ slug: "post-1" }, { slug: "post-2" }]);

    vi.spyOn(api, "getAllPosts").mockResolvedValueOnce([]);
    const fallbackParams = await generateStaticParams();
    expect(fallbackParams).toEqual([{ slug: "placeholder" }]);
  });
});

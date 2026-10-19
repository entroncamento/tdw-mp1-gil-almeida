import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getAllPosts,
  getPostAndMorePosts,
  getPreviewPostBySlug,
} from "@/lib/api";

describe("api library", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("getAllPosts fetches and extracts posts correctly", async () => {
    const mockPosts = [
      {
        slug: "post-1",
        title: "Post 1",
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          data: {
            postCollection: {
              items: mockPosts,
            },
          },
        }),
    } as any);

    const posts = await getAllPosts(false);
    expect(posts).toEqual(mockPosts);
  });

  it("getAllPosts handles missing items gracefully", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ errors: [{ message: "error" }] }),
    } as any);

    const posts = await getAllPosts(false);
    expect(posts).toEqual([]);
  });

  it("getPostAndMorePosts fetches post and additional posts", async () => {
    const mockPost = { slug: "slug-1", title: "Slug 1" };
    const mockMore = [{ slug: "slug-2", title: "Slug 2" }];

    let callCount = 0;
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              data: { postCollection: { items: [mockPost] } },
            }),
        });
      }
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            data: { postCollection: { items: mockMore } },
          }),
      });
    });

    const result = await getPostAndMorePosts("slug-1", false);
    expect(result.post).toEqual(mockPost);
    expect(result.morePosts).toEqual(mockMore);
  });

  it("getPreviewPostBySlug fetches preview post", async () => {
    const mockPost = { slug: "preview-1", title: "Preview 1" };
    global.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({
          data: { postCollection: { items: [mockPost] } },
        }),
    } as any);

    const post = await getPreviewPostBySlug("preview-1");
    expect(post).toEqual(mockPost);
  });
});

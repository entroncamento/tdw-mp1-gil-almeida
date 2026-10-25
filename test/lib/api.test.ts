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

  it("handles missing CONTENTFUL_SPACE_ID gracefully", async () => {
    const originalSpaceId = process.env.CONTENTFUL_SPACE_ID;
    try {
      delete process.env.CONTENTFUL_SPACE_ID;
      const posts = await getAllPosts(false);
      expect(posts).toEqual([]);
    } finally {
      process.env.CONTENTFUL_SPACE_ID = originalSpaceId;
    }
  });

  it("handles missing access token gracefully", async () => {
    const originalToken = process.env.CONTENTFUL_ACCESS_TOKEN;
    const originalPreviewToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;
    try {
      delete process.env.CONTENTFUL_ACCESS_TOKEN;
      delete process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;
      const posts = await getAllPosts(false);
      expect(posts).toEqual([]);
    } finally {
      process.env.CONTENTFUL_ACCESS_TOKEN = originalToken;
      process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN = originalPreviewToken;
    }
  });

  it("handles unexpected non-JSON HTML response gracefully without crashing", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 404,
      statusText: "Not Found",
      headers: {
        get: (h: string) =>
          h.toLowerCase() === "content-type" ? "text/html" : null,
      },
      text: () =>
        Promise.resolve(
          "<html><head><title>404 Not Found</title></head></html>",
        ),
    } as any);

    const posts = await getAllPosts(false);
    expect(posts).toEqual([]);
  });

  it("handles HTTP error status safely", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      headers: {
        get: (h: string) =>
          h.toLowerCase() === "content-type" ? "application/json" : null,
      },
      json: () =>
        Promise.resolve({
          errors: [{ message: "Authentication failed" }],
        }),
    } as any);

    const posts = await getAllPosts(false);
    expect(posts).toEqual([]);
  });
});

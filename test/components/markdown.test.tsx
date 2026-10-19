import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Markdown } from "@/lib/markdown";

describe("Markdown component", () => {
  it("renders rich text markdown and matches snapshot", () => {
    const mockContent = {
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
                value: "Hello, this is a test rich text paragraph.",
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
    };

    const { container } = render(<Markdown content={mockContent} />);
    expect(container).toMatchSnapshot();
  });

  it("renders embedded asset and matches snapshot", () => {
    const mockContent = {
      json: {
        nodeType: "document",
        data: {},
        content: [
          {
            nodeType: "embedded-asset-block",
            data: {
              target: {
                sys: { id: "asset-1" },
              },
            },
            content: [],
          },
        ],
      },
      links: {
        assets: {
          block: [
            {
              sys: { id: "asset-1" },
              url: "https://images.ctfassets.net/photo.png",
              description: "A beautiful scenery",
            },
          ],
        },
      },
    };

    const { container } = render(<Markdown content={mockContent} />);
    expect(container).toMatchSnapshot();
  });
});

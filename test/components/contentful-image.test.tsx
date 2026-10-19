import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ContentfulImage from "@/lib/contentful-image";

describe("ContentfulImage component", () => {
  it("renders image with custom loader and matches snapshot", () => {
    const { container } = render(
      <ContentfulImage
        src="https://images.ctfassets.net/image.png"
        alt="Test Image"
        width={400}
        height={300}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});

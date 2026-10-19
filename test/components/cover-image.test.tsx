import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import CoverImage from "@/app/cover-image";

describe("CoverImage component", () => {
  it("renders with slug and matches snapshot", () => {
    const { container } = render(
      <CoverImage
        title="Sample Article"
        url="https://images.ctfassets.net/sample.jpg"
        slug="sample-article"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it("renders without slug and matches snapshot", () => {
    const { container } = render(
      <CoverImage
        title="Sample Article Without Link"
        url="https://images.ctfassets.net/sample2.jpg"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});

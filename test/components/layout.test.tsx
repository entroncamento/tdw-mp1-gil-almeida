import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import RootLayout from "@/app/layout";

describe("RootLayout component", () => {
  it("renders layout with children and matches snapshot", () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="test-child">Child Content</div>
      </RootLayout>,
    );
    expect(container).toMatchSnapshot();
  });
});

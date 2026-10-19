import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Avatar from "@/app/avatar";

describe("Avatar component", () => {
  it("renders correctly and matches snapshot", () => {
    const { container } = render(
      <Avatar
        name="John Doe"
        picture={{ url: "https://images.ctfassets.net/avatar.jpg" }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});

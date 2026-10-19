import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import DateComponent from "@/app/date";

describe("DateComponent component", () => {
  it("renders formatted date and matches snapshot", () => {
    const { container } = render(
      <DateComponent dateString="2026-03-15T12:00:00.000Z" />,
    );
    expect(container).toMatchSnapshot();
  });
});

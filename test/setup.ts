import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("next/font/google", () => ({
  Inter: () => ({
    variable: "--font-inter",
    className: "font-inter",
  }),
}));

vi.mock("next/headers", () => ({
  draftMode: vi.fn(async () => ({ isEnabled: false })),
}));

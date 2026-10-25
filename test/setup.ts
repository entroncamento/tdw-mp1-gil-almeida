import "@testing-library/jest-dom";
import { vi } from "vitest";

process.env.CONTENTFUL_SPACE_ID =
  process.env.CONTENTFUL_SPACE_ID || "mock-space-id";
process.env.CONTENTFUL_ACCESS_TOKEN =
  process.env.CONTENTFUL_ACCESS_TOKEN || "mock-access-token";

vi.mock("next/font/google", () => ({
  Inter: () => ({
    variable: "--font-inter",
    className: "font-inter",
  }),
}));

vi.mock("next/headers", () => ({
  draftMode: vi.fn(async () => ({ isEnabled: false })),
}));

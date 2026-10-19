import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    loader: "custom",
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

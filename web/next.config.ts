import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ['free-human-design', 'swisseph'],
};

export default nextConfig;

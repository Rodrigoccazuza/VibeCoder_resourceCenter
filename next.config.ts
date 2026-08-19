import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  ...(isGitHubPages
    ? {
        output: "export",
        basePath: "/VibeCoder_resourceCenter",
        assetPrefix: "/VibeCoder_resourceCenter",
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;

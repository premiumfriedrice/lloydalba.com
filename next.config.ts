import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      { source: "/thoughts", destination: "/writings", permanent: true },
      { source: "/thoughts/:slug", destination: "/writings/:slug", permanent: true },
    ];
  },
};

export default nextConfig;

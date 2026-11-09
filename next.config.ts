import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      // the inference post's old addresses go straight to its new one
      { source: "/writings/2026-11-05-on-prem-inference-what-we-built", destination: "/writings/building-high-performance-on-prem-inference-server", permanent: true },
      { source: "/thoughts/2026-11-05-on-prem-inference-what-we-built", destination: "/writings/building-high-performance-on-prem-inference-server", permanent: true },
      { source: "/thoughts", destination: "/writings", permanent: true },
      { source: "/thoughts/:slug", destination: "/writings/:slug", permanent: true },
    ];
  },
};

export default nextConfig;

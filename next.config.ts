import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://47.238.151.174:8080/api/:path*",
      },
    ];
  },
};

export default nextConfig;

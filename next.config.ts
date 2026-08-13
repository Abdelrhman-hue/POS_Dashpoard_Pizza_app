import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "dinnerthendessert.com",
      },
      {
        protocol: "https",
        hostname: "d3s8tbcesxr4jm.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "californiaavocado.com",
      },
      {
        protocol: "https",
        hostname: "kristineskitchenblog.com",
      },
      {
        protocol: "https",
        hostname: "www.thecookierookie.com",
      },
      {
        protocol: "https",
        hostname: "kitchenatics.com",
      },
      {
        protocol: "https",
        hostname: "www.slimmingeats.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
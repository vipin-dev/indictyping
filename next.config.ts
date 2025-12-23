import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  output: 'export',
  images: { unoptimized: true }, // required for next/image on static export
};

export default nextConfig;

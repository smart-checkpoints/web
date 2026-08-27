import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this directory. Without it Turbopack walks up
  // looking for a lockfile and can settle on one outside the repository.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  eslint: { ignoreDuringBuilds: true },
  images: {
    domains: ["metacore.mobula.io", "assets.coingecko.com"],
  },
  typescript: { ignoreBuildErrors: true },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

export default config;

import type { NextConfig } from "next";
import webpack from "webpack";
import type { Configuration } from "webpack";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          net: false,
          tls: false,
          fs: false,
          http: false,
          https: false,
          crypto: false,
          "process/browser": require.resolve("process/browser"),
        },
      };

      config.plugins = [
        ...(config.plugins || []),
        new webpack.ProvidePlugin({
          process: "process/browser",
        }),
      ];
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
};

module.exports = nextConfig;

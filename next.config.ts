import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    // Standard AWS environment variables
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

    // JPC-prefixed environment variables (used in Amplify)
    JPC_AWS_ACCESS_KEY_ID: process.env.JPC_AWS_ACCESS_KEY_ID,
    JPC_AWS_SECRET_ACCESS_KEY: process.env.JPC_AWS_SECRET_ACCESS_KEY,
    CLAUDE_MODEL_ID: process.env.CLAUDE_MODEL_ID,

    // Bedrock-specific region
    BEDROCK_REGION: process.env.BEDROCK_REGION,
  },

  // External packages that should not be bundled
  serverExternalPackages: ["@aws-sdk/client-bedrock-runtime"],

  // Output configuration for better Amplify compatibility
  output: "standalone",

  // Disable static optimization for API routes to ensure they run server-side
  trailingSlash: false,

  // Headers for better streaming support
  async headers() {
    return [
      {
        source: "/api/chat",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "X-Accel-Buffering",
            value: "no",
          },
          {
            key: "Connection",
            value: "keep-alive",
          },
        ],
      },
    ];
  },

  // Ensure proper handling of environment variables in different environments
  publicRuntimeConfig: {
    // These will be available on both client and server
    // Don't put sensitive data here
  },

  serverRuntimeConfig: {
    // These will only be available on the server-side
    // This is where sensitive data should go, but we're handling it via process.env directly
  },
};

export default nextConfig;

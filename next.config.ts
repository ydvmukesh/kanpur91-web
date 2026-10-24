import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/withdraw-history", destination: "/wallet/withdrawhistory", permanent: false },
      { source: "/withdraw", destination: "/wallet/withdraw", permanent: false },
      { source: "/withdraw/bankcard", destination: "/wallet/withdraw/bankcard", permanent: false },
      { source: "/withdraw/addbankcard", destination: "/wallet/withdraw/addbankcard", permanent: false },
      { source: "/withdraw/choosebank", destination: "/wallet/withdraw/choosebank", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;

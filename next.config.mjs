/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["10.10.10.27", "00.00.00.00"],
  redirects: async () => [
    {
      source: "/",
      destination: "/admin/dashboard",
      permanent: false,
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

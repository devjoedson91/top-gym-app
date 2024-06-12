/** @type {import('next').NextConfig} */
/** @type {import('next-pwa').WithPWA} */

export const withPWA = {
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
};

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "tecnofit-site.s3.sa-east-1.amazonaws.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;

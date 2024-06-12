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
  images: {
    domains: ["img.freepik.com", "tecnofit-site.s3.sa-east-1.amazonaws.com"],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: 'pub-91d41fc69e574b6b8e7b0ca20fdb95b7.r2.dev',
        protocol: 'https',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;

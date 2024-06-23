/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  images: {
    unoptimized: true,
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        hostname: 'pub-91d41fc69e574b6b8e7b0ca20fdb95b7.r2.dev',
        protocol: 'https',
      },
    ],
    formats: ['image/avif'],
  },
};

export default nextConfig;

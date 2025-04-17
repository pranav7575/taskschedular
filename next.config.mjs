/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'mytaskbucket7575.s3.ap-south-1.amazonaws.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mytaskbucket7575.s3.ap-south-1.amazonaws.com',
        pathname: '**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Cross-Origin-Opener-Policy',
              value: 'unsafe-none', // Less restrictive, allows communication
            },
            {
              key: 'Cross-Origin-Embedder-Policy',
              value: 'unsafe-none', // Warning: removes all protections
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  
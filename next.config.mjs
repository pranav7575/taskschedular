/** @type {import('next').NextConfig} */
const nextConfig = {


    images: {
      domains: ['lh3.googleusercontent.com'],
      domains: ['mytaskbucket7575.s3.ap-south-1.amazonaws.com'],
      domains:['lh3.googleusercontent.com'],
    },

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
  
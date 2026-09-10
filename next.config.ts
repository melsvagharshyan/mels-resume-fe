import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/frontend',
        destination: '/job-apply',
        permanent: true,
      },
      {
        source: '/backend',
        destination: '/job-apply',
        permanent: true,
      },
      {
        source: '/fullstack',
        destination: '/job-apply',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

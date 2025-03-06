/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'your-supabase-project-id.supabase.co'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/achats',
        permanent: true,
      },
    ];
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;

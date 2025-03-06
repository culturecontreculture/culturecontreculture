/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'cciypmugbemibaeuppco.supabase.co', 'www.culturecontreculture.fr'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'www.culturecontreculture.fr'],
  },
  experimental: {
    serverActions: true,
  }
};

module.exports = nextConfig;
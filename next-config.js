/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'localhost', 'www.culturecontreculture.fr'],
  },
  experimental: {
    serverActions: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://cciypmugbemibaeuppco.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjaXlwbXVnYmVtaWJhZXVwcGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY1NzE3NjEsImV4cCI6MjA0MjE0Nzc2MX0.Jz6v2Akm17_xtPw14w6RaaPV4oQ-dEGpqJhJxEd2BCo',
  },
};

module.exports = nextConfig;
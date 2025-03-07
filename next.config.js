/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'www.culturecontreculture.fr'],
  },
  experimental: {
    serverActions: true,
  },
  // Optimisations pour le développement
  onDemandEntries: {
    // période (en ms) où la page restera en mémoire
    maxInactiveAge: 10 * 1000,
    // nombre de pages à garder en mémoire
    pagesBufferLength: 1,
  },
  // Désactiver le cache statique dans l'environnement de développement
  staticPageGenerationTimeout: 1000,
  // Headers personnalisés pour éviter le cache du navigateur
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0, must-revalidate'
          },
          {
            key: 'Pragma',
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig;
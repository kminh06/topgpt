/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/shutdown',
        permanent: true,
      },
      {
        source: '/chat',
        destination: '/shutdown',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/shutdown',
        permanent: true,
      },
    ];
  },

}

module.exports = nextConfig

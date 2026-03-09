/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  async redirects() {
    return [
      {
        source: '/pricing',
        destination: '/plans',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

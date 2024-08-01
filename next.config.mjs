/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: [
        'https://nextjs-14-0-2-bug-report-4ea064a57303.herokuapp.com',
        'https://mdl-production-035f.up.railway.app',
        'localhost:3000'
      ]
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/w500/**'
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/original/**'
      }
    ]
  }
};

export default nextConfig;

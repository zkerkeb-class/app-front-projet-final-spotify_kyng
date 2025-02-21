// const withPWA = require("next-pwa")({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development", // Désactiver en dev
//   // Ne pas mettre `swcMinify` ici !
// });

// module.exports = withPWA({
//   reactStrictMode: true,
//   async redirects() {
//     return [
//       {
//         source: "/api/images/:filename", // Exemple d'API pour les images
//         destination: "https://back-end-projet-final-spotify-kyng.onrender.com/api/images/image/:filename", // Ton backend
//         permanent: false,
//       },
//     ];
//   },
// });

import withBundleAnalyzer from '@next/bundle-analyzer';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'sternbergclinic.com.au',
      },
      {
        protocol: 'https',
        hostname: 'back-end-projet-final-spotify-kyng.onrender.com',
        pathname: '/api/images/image/**',
      },
      {
        protocol: 'https',
        hostname: 'dclpocen9bkxu.cloudfront.net',
      },
    ],
  },
  ...(process.env.ANALYZE === 'true' ? withBundleAnalyzer({ enabled: true }) : {}),
};

console.log('ANALYZE is set to: ', process.env.ANALYZE);

export default nextConfig;
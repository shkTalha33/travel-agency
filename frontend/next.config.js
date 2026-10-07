/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    domains: [
      'storage.googleapis.com',
      'firebasestorage.googleapis.com',
      'images.unsplash.com',
      'plus.unsplash.com',
      'localhost',
    ],
  },
  async redirects() {
    return [
      { source: '/ofertas', destination: '/offers', permanent: true },
      { source: '/ofertas/:slug', destination: '/offers/:slug', permanent: true },
      { source: '/membresia', destination: '/membership', permanent: true },
      { source: '/nosotros', destination: '/about', permanent: true },
      { source: '/iniciar-sesion', destination: '/login', permanent: true },
      { source: '/registro', destination: '/register', permanent: true },
      { source: '/olvide-contrasena', destination: '/forgot-password', permanent: true },
      { source: '/restablecer-contrasena', destination: '/reset-password', permanent: true },
      { source: '/verificar-email', destination: '/verify-email', permanent: true },
      { source: '/terminos', destination: '/terms', permanent: true },
      { source: '/privacidad', destination: '/privacy', permanent: true },
      { source: '/panel', destination: '/dashboard', permanent: true },
      { source: '/panel/mi-red', destination: '/dashboard/network', permanent: true },
      { source: '/panel/mis-puntos', destination: '/dashboard/points', permanent: true },
      { source: '/panel/redimir', destination: '/dashboard/redeem', permanent: true },
      { source: '/panel/perfil', destination: '/dashboard/profile', permanent: true },
    ];
  },
};

module.exports = nextConfig;

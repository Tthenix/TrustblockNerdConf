module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'es.vecteezy.com',
        pathname: '/**/*.{jpg,jpeg,png,gif,webp,svg,avif}',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**/*.{jpg,jpeg,png,gif,webp,svg,avif}',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        pathname: '/**/*.{jpg,jpeg,png,gif,webp,svg,avif}',
      },
      // Puedes agregar más dominios seguros aquí
    ],
  },
}; 
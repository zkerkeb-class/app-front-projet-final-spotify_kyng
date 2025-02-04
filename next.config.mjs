import nextPWA from 'next-pwa'

const withPWA = nextPWA({
  dest: 'public'
})

const nextConfig = {
    images: {
        domains: ['localhost', 'placehold.co'],
    },
    pwa: {
      dest: 'public',
      register: true,
      skipWaiting: true,
    },
};

export default withPWA(nextConfig);

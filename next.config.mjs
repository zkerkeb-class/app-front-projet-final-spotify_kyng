import nextPWA from 'next-pwa'

const withPWA = nextPWA({
  dest: 'public'
})

const nextConfig = {
    images: {
        domains: ['localhost', 'placehold.co'],
    },
};

export default withPWA(nextConfig);

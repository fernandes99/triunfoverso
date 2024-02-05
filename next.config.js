/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    async redirects() {
        return [
            {
                source: '/',
                destination: '/welcome',
                permanent: true
            }
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.datocms-assets.com'
            }
        ]
    },
    async rewrites() {
        return {
            beforeFiles: [
                {
                    source: '/',
                    destination: '/home'
                }
            ]
        };
    }
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: `/api/:path*`,
                destination: `https://main.d3r31it7qf5i7h.amplifyapp.com/api/:path*`,
            },
        ]
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    }
};

export default nextConfig;

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    //    Increasing payload size to 100MB , default in next js 4MB paylaod size
    //    Appwrite default is 50 for free payload size
    experimental: {
        serverActions: {
            bodySizeLimit: '100MB'
        }
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.pixabay.com'
            },
            {
                protocol: 'https',
                hostname: 'cloud.appwrite.io'
            }
        ]
    }
};

export default nextConfig;

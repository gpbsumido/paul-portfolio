/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            "img.icons8.com",
            "vercel-paul.s3.ca-central-1.amazonaws.com",
        ],
    },
};

module.exports = nextConfig;

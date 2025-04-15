/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["img.icons8.com"], // Keep existing external domains
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048], // Responsive image sizes
        imageSizes: [16, 32, 48, 64, 96, 128, 256], // Image sizes for smaller images
        formats: ['image/webp', 'image/avif'], // Modern image formats
        minimumCacheTTL: 60, // Cache images for at least 60 seconds
        dangerouslyAllowSVG: true, // Allow SVG images
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    // Enable image compression
    webpack: (config, { dev, isServer }) => {
        // Optimize images in production
        if (!dev && !isServer) {
            config.optimization.minimize = true;
        }
        return config;
    },
    // Enable experimental features for better performance
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['@mui/icons-material'],
    },
    // Configure headers for caching
    async headers() {
        return [
            {
                source: '/images/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;

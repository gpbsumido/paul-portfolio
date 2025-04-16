/**
 * Utility function to determine the base URL based on the environment
 * @returns The base URL for the current environment
 */
export const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        // Client-side, use the current origin
        return window.location.origin;
    }

    // Server-side (e.g. getServerSideProps, API routes)
    // Use environment variables set by Vercel
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }

    // Default to localhost
    return "http://localhost:3000";
};
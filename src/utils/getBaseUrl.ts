/**
 * Utility function to determine the base URL based on the environment
 * @returns The base URL for the current environment
 */
export const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        return window.location.origin;
    }

    // Running on server (SSR or API), use env
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
        return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }

    // Fallback (e.g. localhost dev)
    return "http://localhost:3009";
};

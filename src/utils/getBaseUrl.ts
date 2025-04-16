/**
 * Utility function to determine the base URL based on the environment
 * @param req - Optional request object containing headers
 * @returns The base URL for the current environment
 */
export const getBaseUrl = (req?: { headers: { host: string } }): string => {
    // Client-side
    if (typeof window !== "undefined") {
        return "";
    }

    // Server-side with request object (getServerSideProps, API routes)
    if (req) {
        const protocol = req.headers.host.includes("localhost") ? "http" : "https";
        return `${protocol}://${req.headers.host}`;
    }

    // Server-side without request object (getStaticProps, API routes)
    return process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000";
}; 
import { unstable_cache } from "next/cache";

export const getCachedData = unstable_cache(
    async (key: string, fetchFn: () => Promise<any>) => {
        return await fetchFn();
    },
    ["nba-data"],
    {
        revalidate: 3600, // Cache for 1 hour
        tags: ["nba-data"],
    }
);

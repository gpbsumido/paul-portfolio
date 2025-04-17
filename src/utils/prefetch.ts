import { NBA_API } from "@/constants/nba";
import { TeamResponse } from "@/types/nba";

const BASE_URL = NBA_API.BASE_URL;
const HEADERS = NBA_API.HEADERS;
const PREFETCH_INTERVAL = 3600 * 1000; // 1 hour in milliseconds

let lastPrefetchTime = 0;
let cachedTeams: TeamResponse | null = null;

export const prefetchTeams = async (force = false): Promise<TeamResponse> => {
    const now = Date.now();

    // Return cached data if it's still fresh and not forced
    if (!force && cachedTeams && now - lastPrefetchTime < PREFETCH_INTERVAL) {
        return cachedTeams;
    }

    try {
        const url = new URL(`${BASE_URL}/leaguestandingsv3`);
        url.searchParams.append("LeagueID", "00");
        url.searchParams.append("Season", "2024-25");
        url.searchParams.append("SeasonType", "Regular Season");

        const response = await fetch(url.toString(), {
            headers: HEADERS,
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            throw new Error(
                `Failed to fetch teams: ${response.status} ${response.statusText}`
            );
        }

        const data = await response.json();

        if (!data.resultSets?.[0]?.rowSet) {
            throw new Error("Invalid response format from NBA API [Teams]");
        }

        // Transform the NBA API response into our TeamResponse format
        const teams = data.resultSets[0].rowSet.map((row: string[]) => ({
            id: parseInt(row[2]),
            name: row[4],
            full_name: `${row[3]} ${row[4]}`,
            abbreviation: row[5],
            city: row[3],
            conference: row[6],
            division: row[10],
        }));

        const teamsData: TeamResponse = {
            data: teams,
            meta: {
                total_pages: 1,
                current_page: 1,
                next_page: null,
                per_page: teams.length,
                total_count: teams.length,
            },
        };

        // Update cache
        cachedTeams = teamsData;
        lastPrefetchTime = now;

        return teamsData;
    } catch (error) {
        console.error("Error prefetching teams:", error);
        // Return cached data if available, even if stale
        if (cachedTeams) {
            return cachedTeams;
        }
        throw error;
    }
};

// Start prefetching on module load
prefetchTeams().catch(console.error);

// Set up periodic prefetching
setInterval(() => {
    prefetchTeams().catch(console.error);
}, PREFETCH_INTERVAL);

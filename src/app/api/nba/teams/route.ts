import { NextResponse } from "next/server";
import { NBA_API } from "@/constants/nba";
import { TeamResponse } from "@/types/nba";
import { getCachedData } from "@/utils/cache";

const BASE_URL = NBA_API.BASE_URL;
const HEADERS = NBA_API.HEADERS;

/**
 * Fetches all NBA teams from the NBA API
 * @route GET /api/nba/teams
 * @returns {Promise<NextResponse>} Response containing team data or error message
 * @throws {Error} If the API request fails or response format is invalid
 */
export async function GET() {
    try {
        const fetchTeams = async () => {
            const url = new URL(`${BASE_URL}/leaguestandingsv3`);
            url.searchParams.append("LeagueID", "00");
            url.searchParams.append("Season", "2024-25");
            url.searchParams.append("SeasonType", "Regular Season");

            const response = await fetch(url.toString(), { headers: HEADERS });

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch teams: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();

            if (
                !data.resultSets ||
                !data.resultSets[0] ||
                !data.resultSets[0].rowSet
            ) {
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

            const responseData: TeamResponse = {
                data: teams,
                meta: {
                    total_pages: 1,
                    current_page: 1,
                    next_page: null,
                    per_page: teams.length,
                    total_count: teams.length,
                },
            };

            return responseData;
        };

        const data = await getCachedData("nba-teams", fetchTeams);

        // Add CORS headers to the response
        const headers = new Headers();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
        headers.set(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );

        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error("Error fetching teams:", error);

        // Add CORS headers to the error response
        const headers = new Headers();
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
        headers.set(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );

        return new NextResponse(
            JSON.stringify({
                error: "Failed to fetch teams",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            }),
            {
                status: 500,
                headers,
            }
        );
    }
}

/**
 * Handles CORS preflight requests for the teams endpoint
 * @route OPTIONS /api/nba/teams
 * @returns {Promise<NextResponse>} Response with CORS headers
 */
export async function OPTIONS() {
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    return new NextResponse(null, {
        status: 204,
        headers,
    });
}

import { NextResponse } from "next/server";
import { NBA_API } from "@/constants/nba";
import { PlayerStatsResponse } from "@/types/nba";
import { rateLimit } from "@/utils/rateLimiter";
import { getCachedData } from "@/utils/cache";

const BASE_URL = NBA_API.BASE_URL;
const HEADERS = NBA_API.HEADERS;

/**
 * Fetches statistics for a specific NBA player
 * @route GET /api/nba/stats/{playerId}
 * @param {Request} request - The incoming request
 * @param {Object} params - Route parameters
 * @param {string} params.playerId - The ID of the player to fetch stats for
 * @returns {Promise<NextResponse>} Response containing player stats or error message
 * @throws {Error} If the API request fails or response format is invalid
 */
export async function GET(
    request: Request,
    { params }: { params: { playerId: string } }
) {
    try {
        const { playerId } = await Promise.resolve(params);

        const fetchStats = async () => {
            await rateLimit();

            const url = new URL(`${BASE_URL}/playerdashboardbygeneralsplits`);
            // Add all required query parameters
            const queryParams = {
                DateFrom: "",
                DateTo: "",
                GameSegment: "",
                LastNGames: "0",
                LeagueID: "00",
                Location: "",
                MeasureType: "Base",
                Month: "0",
                OpponentTeamID: "0",
                Outcome: "",
                PORound: "0",
                PaceAdjust: "N",
                PerMode: "PerGame",
                Period: "0",
                PlayerID: playerId,
                PlusMinus: "N",
                Rank: "N",
                Season: "2024-25",
                SeasonSegment: "",
                SeasonType: "Regular Season",
                ShotClockRange: "",
                Split: "general",
                VsConference: "",
                VsDivision: "",
            };

            Object.entries(queryParams).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });

            const response = await fetch(url.toString(), { headers: HEADERS });

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch player stats: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();

            if (!data.resultSets?.[0]?.rowSet?.[0]) {
                throw new Error("Invalid response format from NBA API [Stats]");
            }

            // The first row contains the season totals
            const seasonStats = data.resultSets[0].rowSet[0];

            // Calculate fantasy points
            const pts = parseFloat(seasonStats[26]) || 0;
            const reb = parseFloat(seasonStats[18]) || 0;
            const ast = parseFloat(seasonStats[19]) || 0;
            const stl = parseFloat(seasonStats[20]) || 0;
            const blk = parseFloat(seasonStats[21]) || 0;
            const fantasyPoints =
                pts * 1 + reb * 1.2 + ast * 1.5 + stl * 3 + blk * 3;

            const stats = [
                {
                    games_played: parseInt(seasonStats[2]) || 0,
                    player_id: parseInt(playerId),
                    season: 2024,
                    min: seasonStats[6] || "0:00",
                    fgm: parseFloat(seasonStats[7]) || 0,
                    fga: parseFloat(seasonStats[8]) || 0,
                    fg_pct: parseFloat(seasonStats[9]) || 0,
                    fg3m: parseFloat(seasonStats[10]) || 0,
                    fg3a: parseFloat(seasonStats[11]) || 0,
                    fg3_pct: parseFloat(seasonStats[12]) || 0,
                    ftm: parseFloat(seasonStats[13]) || 0,
                    fta: parseFloat(seasonStats[14]) || 0,
                    ft_pct: parseFloat(seasonStats[15]) || 0,
                    oreb: parseFloat(seasonStats[16]) || 0,
                    dreb: parseFloat(seasonStats[17]) || 0,
                    reb,
                    ast,
                    turnover: parseFloat(seasonStats[20]) || 0,
                    stl: parseFloat(seasonStats[21]) || 0,
                    blk: parseFloat(seasonStats[22]) || 0,
                    pf: parseFloat(seasonStats[24]) || 0,
                    pts,
                    fantasy_points: fantasyPoints,
                },
            ];

            const responseData: PlayerStatsResponse = {
                data: stats,
                meta: {
                    total_pages: 1,
                    current_page: 1,
                    next_page: null,
                    per_page: 1,
                    total_count: 1,
                },
            };

            return responseData;
        };

        const data = await getCachedData(
            `player-stats-${playerId}`,
            fetchStats
        );

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
        console.error("Error fetching player stats:", error);

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
                error: "Failed to fetch player stats",
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
 * Handles CORS preflight requests for the player stats endpoint
 * @route OPTIONS /api/nba/stats/{playerId}
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

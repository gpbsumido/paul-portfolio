import { NextResponse } from "next/server";
import { NBA_API } from "@/constants/nba";
import { PlayerResponse } from "@/types/nba";
import { getCachedData } from "@/utils/cache";

const BASE_URL = NBA_API.BASE_URL;
const HEADERS = NBA_API.HEADERS;

/**
 * Fetches all players for a specific NBA team
 * @route GET /api/nba/players/{teamId}
 * @param {Request} request - The incoming request
 * @param {Object} params - Route parameters
 * @param {string} params.teamId - The ID of the team to fetch players for
 * @returns {Promise<NextResponse>} Response containing team players or error message
 * @throws {Error} If the API request fails or response format is invalid
 */
export async function GET(
    request: Request,
    { params }: { params: { teamId: string } }
) {
    try {
        const teamId = parseInt(params.teamId);
        if (isNaN(teamId)) {
            return new NextResponse(
                JSON.stringify({ error: "Invalid team ID" }),
                { status: 400 }
            );
        }

        const fetchPlayers = async () => {
            const url = new URL(`${BASE_URL}/commonteamroster`);
            url.searchParams.append("LeagueID", "00");
            url.searchParams.append("Season", "2024-25");
            url.searchParams.append("TeamID", teamId.toString());

            const response = await fetch(url.toString(), { headers: HEADERS });

            if (!response.ok) {
                throw new Error(
                    `Failed to fetch team players: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();

            if (
                !data.resultSets ||
                !data.resultSets[0] ||
                !data.resultSets[0].rowSet ||
                !data.resultSets[0].headers
            ) {
                throw new Error(
                    "Invalid response format from NBA API [Players]"
                );
            }

            // Get the headers to map column names to indices
            const headers = data.resultSets[0].headers;

            const getColumnIndex = (name: string): number => {
                const index = headers.indexOf(name);
                if (index === -1) {
                    throw new Error(
                        `Column '${name}' not found in API response`
                    );
                }
                return index;
            };

            interface PlayerData {
                id: number;
                first_name: string;
                last_name: string;
                position: string;
                height_feet: number | null;
                height_inches: number | null;
                team: {
                    id: number;
                    name: string;
                    full_name: string;
                    abbreviation: string;
                    city: string;
                    conference: string;
                    division: string;
                };
            }

            // Transform the NBA API response into our PlayerResponse format
            const players = data.resultSets[0].rowSet
                .map((row: string[]) => {
                    try {
                        const playerId = row[getColumnIndex("PLAYER_ID")];
                        const playerName = row[getColumnIndex("PLAYER")];
                        const position = row[getColumnIndex("POSITION")];
                        const height = row[getColumnIndex("HEIGHT")];
                        const teamId = row[getColumnIndex("TeamID")];

                        if (!playerName) {
                            throw new Error("Player name is missing");
                        }

                        return {
                            id: playerId,
                            first_name: playerName.split(" ")[0],
                            last_name: playerName.split(" ").slice(1).join(" "),
                            position: position || "N/A",
                            height_feet: height
                                ? parseInt(height.split("-")[0])
                                : null,
                            height_inches: height
                                ? parseInt(height.split("-")[1])
                                : null,
                            team: {
                                id: teamId,
                                name: "Unknown",
                                full_name: "Unknown",
                                abbreviation: "Unknown",
                                city: "Unknown",
                                conference: "Unknown",
                                division: "Unknown",
                            },
                        };
                    } catch (error) {
                        console.error("Error processing player row:", error);
                        return null;
                    }
                })
                .filter(
                    (player: PlayerData | null): player is PlayerData =>
                        player !== null
                );

            const responseData: PlayerResponse = {
                data: players,
                meta: {
                    total_pages: 1,
                    current_page: 1,
                    next_page: null,
                    per_page: players.length,
                    total_count: players.length,
                },
            };

            return responseData;
        };

        const data = await getCachedData(
            `team-players-${teamId}`,
            fetchPlayers
        );

        // Add CORS headers to the response
        const headersResponse = new Headers();
        headersResponse.set("Access-Control-Allow-Origin", "*");
        headersResponse.set("Access-Control-Allow-Methods", "GET, OPTIONS");
        headersResponse.set(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );

        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: headersResponse,
        });
    } catch (error) {
        console.error("Error fetching team players:", error);

        // Add CORS headers to the error response
        const headersResponse = new Headers();
        headersResponse.set("Access-Control-Allow-Origin", "*");
        headersResponse.set("Access-Control-Allow-Methods", "GET, OPTIONS");
        headersResponse.set(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );

        return new NextResponse(
            JSON.stringify({
                error: "Failed to fetch team players",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            }),
            { status: 500, headers: headersResponse }
        );
    }
}

/**
 * Handles CORS preflight requests for the team players endpoint
 * @route OPTIONS /api/nba/players/{teamId}
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

import { NextApiRequest, NextApiResponse } from "next";
import { NBA_API } from "@/constants/nba";
import { PlayerResponse } from "@/types/nba";
import { getCachedData } from "@/utils/cache";

const BASE_URL = NBA_API.BASE_URL;
const HEADERS = NBA_API.HEADERS;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        try {
            const { teamId } = req.query;
            const parsedTeamId = parseInt(teamId as string);
            
            if (isNaN(parsedTeamId)) {
                return res.status(400).json({ error: "Invalid team ID" });
            }

            const fetchPlayers = async () => {
                const url = new URL(`${BASE_URL}/commonteamroster`);
                url.searchParams.append("LeagueID", "00");
                url.searchParams.append("Season", "2024-25");
                url.searchParams.append("TeamID", parsedTeamId.toString());

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
                    throw new Error("Invalid response format from NBA API [Players]");
                }

                // Get the headers to map column names to indices
                const headers = data.resultSets[0].headers;

                const getColumnIndex = (name: string): number => {
                    const index = headers.indexOf(name);
                    if (index === -1) {
                        throw new Error(`Column '${name}' not found in API response`);
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
                                height_feet: height ? parseInt(height.split("-")[0]) : null,
                                height_inches: height ? parseInt(height.split("-")[1]) : null,
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
                    .filter((player: PlayerData | null): player is PlayerData => player !== null);

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

            const data = await getCachedData(`team-players-${parsedTeamId}`, fetchPlayers);
            res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching team players:", error);
            res.status(500).json({
                error: "Failed to fetch team players",
                details: error instanceof Error ? error.message : "Unknown error",
            });
        }
    } else if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.status(204).end();
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
} 
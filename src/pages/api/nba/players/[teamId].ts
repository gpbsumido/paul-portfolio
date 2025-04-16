import { NextApiRequest, NextApiResponse } from "next";
import { NBA_API } from "@/constants/nba";
import { Player, PlayerResponse } from "@/types/nba";
import { getCachedData } from "@/utils/cache";

const BASE_URL = NBA_API.BASE_URL;
const HEADERS = NBA_API.HEADERS;
const CACHE_TTL = 3600; // 1 hour in seconds

const fetchPlayers = async (teamId: number) => {
    const url = new URL(`${BASE_URL}/commonteamroster`);
    url.searchParams.append("LeagueID", "00");
    url.searchParams.append("Season", "2024-25");
    url.searchParams.append("TeamID", teamId.toString());

    const response = await fetch(url.toString(), {
        headers: HEADERS,
        next: { revalidate: CACHE_TTL },
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch team players: ${response.status} ${response.statusText}`
        );
    }

    const data = await response.json();

    if (!data.resultSets?.[0]?.rowSet || !data.resultSets[0].headers) {
        throw new Error("Invalid response format from NBA API [Players]");
    }

    const headers = data.resultSets[0].headers;
    const getColumnIndex = (name: string): number => {
        const index = headers.indexOf(name);
        if (index === -1) {
            throw new Error(`Column '${name}' not found in API response`);
        }
        return index;
    };

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
        .filter((player: Player | null): player is Player => player !== null);

    return {
        data: players,
        meta: {
            total_pages: 1,
            current_page: 1,
            next_page: null,
            per_page: players.length,
            total_count: players.length,
        },
    } as PlayerResponse;
};

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

            const data = await getCachedData(
                `team-players-${parsedTeamId}`,
                () => fetchPlayers(parsedTeamId)
            );
            res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching team players:", error);
            res.status(500).json({
                error: "Failed to fetch team players",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    } else if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );
        res.status(204).end();
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

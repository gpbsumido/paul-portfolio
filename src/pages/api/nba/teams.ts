import { NextApiRequest, NextApiResponse } from "next";
import { NBA_API } from "@/constants/nba";
import { TeamResponse } from "@/types/nba";
import { getCachedData } from "@/utils/cache";

const BASE_URL = NBA_API.BASE_URL;
const HEADERS = NBA_API.HEADERS;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
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
            res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching teams:", error);
            res.status(500).json({
                error: "Failed to fetch teams",
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

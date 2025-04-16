import { NextApiRequest, NextApiResponse } from "next";
import { NBA_API } from "@/constants/nba";
import { PlayerStatsResponse } from "@/types/nba";
import { rateLimit } from "@/utils/rateLimiter";
import { getCachedData } from "@/utils/cache";

const BASE_URL = NBA_API.BASE_URL;
const HEADERS = NBA_API.HEADERS;
const CACHE_TTL = 300; // 5 minutes in seconds (stats update more frequently)

const fetchStats = async (playerId: number) => {
    await rateLimit();

    const url = new URL(`${BASE_URL}/playerdashboardbygeneralsplits`);
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
        PlayerID: playerId.toString(),
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

    const response = await fetch(url.toString(), {
        headers: HEADERS,
        next: { revalidate: CACHE_TTL },
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch player stats: ${response.status} ${response.statusText}`
        );
    }

    const data = await response.json();

    if (!data.resultSets?.[0]?.rowSet?.[0]) {
        throw new Error("Invalid response format from NBA API [Stats]");
    }

    const seasonStats = data.resultSets[0].rowSet[0];
    const pts = parseFloat(seasonStats[26]) || 0;
    const reb = parseFloat(seasonStats[18]) || 0;
    const ast = parseFloat(seasonStats[19]) || 0;
    const stl = parseFloat(seasonStats[20]) || 0;
    const blk = parseFloat(seasonStats[21]) || 0;
    const fantasyPoints = pts * 1 + reb * 1.2 + ast * 1.5 + stl * 3 + blk * 3;

    return {
        data: [
            {
                games_played: parseInt(seasonStats[2]) || 0,
                player_id: playerId,
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
        ],
        meta: {
            total_pages: 1,
            current_page: 1,
            next_page: null,
            per_page: 1,
            total_count: 1,
        },
    } as PlayerStatsResponse;
};

/**
 * Fetches statistics for a specific NBA player
 * @route GET /api/nba/stats/{playerId}
 * @param {NextApiRequest} req - The incoming request
 * @param {NextApiResponse} res - The response object
 * @returns {Promise<void>} Response containing player stats or error message
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    if (req.method === "GET") {
        try {
            const { playerId } = req.query;
            if (!playerId || Array.isArray(playerId)) {
                return res.status(400).json({ error: "Invalid player ID" });
            }

            const data = await getCachedData(
                `player-stats-${playerId}`,
                () => fetchStats(parseInt(playerId)),
                CACHE_TTL
            );
            res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching player stats:", error);
            res.status(500).json({
                error: "Failed to fetch player stats",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    } else if (req.method === "OPTIONS") {
        res.status(204).end();
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

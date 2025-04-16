import { NextApiRequest, NextApiResponse } from "next";
import { prefetchTeams } from "@/utils/prefetch";

export const maxDuration = 280; // 2 minutes in seconds

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        try {
            const data = await prefetchTeams();
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

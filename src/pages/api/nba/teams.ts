import { NextApiRequest, NextApiResponse } from "next";
import { NBA_API } from "@/constants/nba";
import { TeamResponse } from "@/types/nba";

const BASE_URL = NBA_API.BASE_URL;
const HEADERS = NBA_API.HEADERS;
const FETCH_TIMEOUT = 280000; // 10 seconds timeout for fetch
const MAX_RETRIES = 2; // Will try up to 3 times total (initial + 2 retries)

interface LogData {
    [key: string]: string | number | boolean | null | undefined;
}

const logRequest = (message: string, data?: LogData) => {
    const timestamp = new Date().toISOString();
    const logData = {
        timestamp,
        message,
        ...(data && { data }),
    };
    console.log(JSON.stringify(logData, null, 2));
};

const fetchWithTimeout = async (
    url: string,
    options: RequestInit,
    timeout: number
) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        logRequest("Starting NBA API request", { url, timeout });
        const startTime = Date.now();

        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });

        const endTime = Date.now();
        const duration = endTime - startTime;

        clearTimeout(timeoutId);
        logRequest("NBA API request completed", {
            status: response.status,
            duration: `${duration}ms`,
            url,
        });

        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        logRequest("NBA API request failed", {
            error: error instanceof Error ? error.message : "Unknown error",
            url,
        });
        throw error;
    }
};

const safeFetchWithRetry = async (
    url: string,
    options: RequestInit,
    timeout: number,
    retries = MAX_RETRIES
) => {
    try {
        return await fetchWithTimeout(url, options, timeout);
    } catch (err) {
        if (retries > 0) {
            logRequest("Retrying fetch due to failure", {
                reason: err instanceof Error ? err.message : "unknown",
                retriesLeft: retries,
            });
            return await safeFetchWithRetry(url, options, timeout, retries - 1);
        }
        throw err;
    }
};

const fetchTeams = async (): Promise<TeamResponse> => {
    const startTime = Date.now();
    logRequest("Starting teams fetch process");

    try {
        const url = new URL(`${BASE_URL}/leaguestandingsv3`);
        url.searchParams.append("LeagueID", "00");
        url.searchParams.append("Season", "2024-25");
        url.searchParams.append("SeasonType", "Regular Season");

        const response = await safeFetchWithRetry(
            url.toString(),
            {
                headers: HEADERS,
                next: { revalidate: 3600 },
            },
            FETCH_TIMEOUT
        );

        if (!response.ok) {
            throw new Error(
                `Failed to fetch teams: ${response.status} ${response.statusText}`
            );
        }

        logRequest("Parsing NBA API response");
        const parseStartTime = Date.now();
        const data = await response.json();
        const parseDuration = Date.now() - parseStartTime;
        logRequest("Response parsed", { duration: `${parseDuration}ms` });

        if (!data.resultSets?.[0]?.rowSet) {
            throw new Error("Invalid response format from NBA API [Teams]");
        }

        logRequest("Transforming team data");
        const transformStartTime = Date.now();
        const teams = data.resultSets[0].rowSet.map((row: string[]) => ({
            id: parseInt(row[2]),
            name: row[4],
            full_name: `${row[3]} ${row[4]}`,
            abbreviation: row[5],
            city: row[3],
            conference: row[6],
            division: row[10],
        }));
        const transformDuration = Date.now() - transformStartTime;
        logRequest("Team data transformed", {
            teamCount: teams.length,
            duration: `${transformDuration}ms`,
        });

        const totalDuration = Date.now() - startTime;
        logRequest("Teams fetch process completed", {
            totalDuration: `${totalDuration}ms`,
            teamCount: teams.length,
        });

        return {
            data: teams,
            meta: {
                total_pages: 1,
                current_page: 1,
                next_page: null,
                per_page: teams.length,
                total_count: teams.length,
            },
        };
    } catch (error) {
        const totalDuration = Date.now() - startTime;
        logRequest("Teams fetch process failed", {
            error: error instanceof Error ? error.message : "Unknown error",
            duration: `${totalDuration}ms`,
        });
        throw error;
    }
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const requestId = Math.random().toString(36).substring(7);
    logRequest("Request received", {
        method: req.method,
        requestId,
    });

    if (req.method === "GET") {
        try {
            const data = await fetchTeams();
            logRequest("Sending successful response", {
                requestId,
                teamCount: data.data.length,
            });
            res.status(200).json(data);
        } catch (error) {
            logRequest("Sending error response", {
                requestId,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            res.status(500).json({
                error: "Failed to fetch teams",
                details:
                    error instanceof Error ? error.message : "Unknown error",
            });
        }
    } else if (req.method === "OPTIONS") {
        logRequest("Handling OPTIONS request", { requestId });
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type, Authorization"
        );
        res.status(204).end();
    } else {
        logRequest("Method not allowed", {
            requestId,
            method: req.method,
        });
        res.status(405).json({ error: "Method not allowed" });
    }
}

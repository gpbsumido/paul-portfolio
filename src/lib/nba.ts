import {
    PlayerStats,
    PlayerResponse,
    TeamResponse,
    SeasonAverages,
} from "../types/nba";

/**
 * Rate limit in milliseconds between API requests
 * @constant {number}
 */
const RATE_LIMIT_MS = 300;

/**
 * Utility class for rate limiting API requests
 * @class RateLimiter
 */
class RateLimiter {
    private lastCallTime: number = 0;
    private queue: (() => Promise<void>)[] = [];
    private isProcessing: boolean = false;
    private rateLimitMs: number;

    /**
     * Creates a new RateLimiter instance
     * @param {number} [rateLimitMs=RATE_LIMIT_MS] - Time in milliseconds between requests
     */
    constructor(rateLimitMs: number = RATE_LIMIT_MS) {
        this.rateLimitMs = rateLimitMs;
    }

    /**
     * Executes a function with rate limiting
     * @template T
     * @param {() => Promise<T>} fn - Function to execute
     * @returns {Promise<T>} Result of the function execution
     */
    async execute<T>(fn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    const result = await fn();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
            this.processQueue();
        });
    }

    /**
     * Processes the queue of functions with rate limiting
     * @private
     */
    private async processQueue() {
        if (this.isProcessing || this.queue.length === 0) return;

        this.isProcessing = true;
        const now = Date.now();
        const timeSinceLastCall = now - this.lastCallTime;

        if (timeSinceLastCall < this.rateLimitMs) {
            await new Promise((resolve) =>
                setTimeout(resolve, this.rateLimitMs - timeSinceLastCall)
            );
        }

        const nextCall = this.queue.shift();
        if (nextCall) {
            this.lastCallTime = Date.now();
            await nextCall();
        }

        this.isProcessing = false;
        this.processQueue();
    }
}

const rateLimiter = new RateLimiter();

/**
 * Fetches all NBA teams
 * @returns {Promise<TeamResponse>} Promise containing team data and metadata
 * @throws {Error} If the API request fails
 */
export async function getTeams(): Promise<TeamResponse> {
    try {
        const response = await fetch("/api/nba/teams");
        if (!response.ok) {
            throw new Error(`Failed to fetch teams: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching teams:", error);
        throw new Error("Failed to fetch teams");
    }
}

/**
 * Fetches players for a specific team
 * @param {number} teamId - ID of the team to fetch players for
 * @returns {Promise<PlayerResponse>} Promise containing player data and metadata
 * @throws {Error} If the API request fails
 */
export async function getTeamPlayers(teamId: number): Promise<PlayerResponse> {
    try {
        const response = await fetch(`/api/nba/players/${teamId}`);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch team players: ${response.statusText}`
            );
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching team players:", error);
        throw new Error("Failed to fetch team players");
    }
}

/**
 * Fetches statistics for a specific player
 * @param {number} playerId - ID of the player to fetch stats for
 * @returns {Promise<{ data: PlayerStats[] }>} Promise containing player statistics
 * @throws {Error} If the API request fails
 */
export async function getPlayerStats(
    playerId: number
): Promise<{ data: PlayerStats[] }> {
    try {
        const response = await fetch(`/api/nba/stats/${playerId}`);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch player stats: ${response.statusText}`
            );
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching player stats:", error);
        throw new Error("Failed to fetch player stats");
    }
}

/**
 * Fetches season averages for specified players
 * @param {number[]} playerIds - Array of player IDs to fetch averages for
 * @returns {Promise<SeasonAverages[]>} Promise containing season averages data
 * @throws {Error} If the API request fails
 */
export async function getSeasonAverages(
    playerIds: number[]
): Promise<SeasonAverages[]> {
    return rateLimiter.execute(async () => {
        const url = new URL(
            "/api/nba/season-averages",
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3009"
        );
        url.searchParams.append("PlayerID", playerIds[0].toString());
        url.searchParams.append("Season", "2024-25");
        url.searchParams.append("SeasonType", "Regular Season");
        url.searchParams.append("MeasureType", "Base");

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error("Failed to fetch season averages");
        }
        return response.json();
    });
}

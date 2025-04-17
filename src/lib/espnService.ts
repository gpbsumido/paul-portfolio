const ESPN_FANTASY_API = {
    BASE_URL: "https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba",
    LEAGUE_ID: "449389534",
    SEASON: "2025",
    SEGMENT: "0",
} as const;

export const ESPN_CONFIG = {
    LEAGUE_ID: "449389534",
    SEASON: new Date().getFullYear().toString(),
    ESPN_S2: process.env.ESPN_S2,
    SWID: process.env.SWID,
};

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
        logRequest("Starting ESPN Fantasy API request", { url, timeout });
        const startTime = Date.now();

        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });

        const endTime = Date.now();
        const duration = endTime - startTime;

        clearTimeout(timeoutId);
        logRequest("ESPN Fantasy API request completed", {
            status: response.status,
            duration: `${duration}ms`,
            url,
        });

        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        logRequest("ESPN Fantasy API request failed", {
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
    retries = 2
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

export const getLeagueInfo = async () => {
    const url = new URL(
        `${ESPN_FANTASY_API.BASE_URL}/seasons/${ESPN_FANTASY_API.SEASON}/segments/${ESPN_FANTASY_API.SEGMENT}/leagues/${ESPN_FANTASY_API.LEAGUE_ID}`
    );
    url.searchParams.append("view", "mTeam");
    url.searchParams.append("view", "mRoster");
    url.searchParams.append("view", "mSettings");

    const response = await safeFetchWithRetry(
        url.toString(),
        {
            headers: {
                Accept: "application/json",
            },
            next: { revalidate: 3600 },
        },
        10000
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch league info: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
};

export const getTeamInfo = async (teamId: string) => {
    const url = new URL(
        `${ESPN_FANTASY_API.BASE_URL}/seasons/${ESPN_FANTASY_API.SEASON}/segments/${ESPN_FANTASY_API.SEGMENT}/leagues/${ESPN_FANTASY_API.LEAGUE_ID}`
    );
    url.searchParams.append("rosterForTeamId", teamId);
    url.searchParams.append("view", "mRoster");
    url.searchParams.append("view", "mTeam");

    const response = await safeFetchWithRetry(
        url.toString(),
        {
            headers: {
                Accept: "application/json",
            },
            next: { revalidate: 3600 },
        },
        10000
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch team info: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
};

export const getHistoricalLeagueInfo = async (year: string) => {
    const url = new URL(
        `${ESPN_FANTASY_API.BASE_URL}/seasons/${year}/segments/${ESPN_FANTASY_API.SEGMENT}/leagues/${ESPN_FANTASY_API.LEAGUE_ID}`
    );
    url.searchParams.append("view", "mTeam");
    url.searchParams.append("view", "mStandings");

    const response = await safeFetchWithRetry(
        url.toString(),
        {
            headers: {
                Accept: "application/json",
            },
            next: { revalidate: 3600 },
        },
        10000
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch historical league info: ${response.status} ${response.statusText}`
        );
    }

    return response.json();
};

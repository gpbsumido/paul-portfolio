/**
 * Interface representing a player in the NBA
 * @interface Player
 */
export interface Player {
    /** Unique identifier for the player */
    id: number;
    /** Player's first name */
    first_name: string;
    /** Player's last name */
    last_name: string;
    /** Player's position (e.g., 'G', 'F', 'C') */
    position: string;
    /** Player's height in feet */
    height_feet: number | null;
    /** Player's height in inches */
    height_inches: number | null;
    /** Player's weight in pounds */
    weight_pounds: number | null;
    /** Reference to the player's team */
    team?: Team;
}

/**
 * Interface representing an NBA team
 * @interface Team
 */
export interface Team {
    /** Team's unique identifier */
    id: number;
    /** Team's abbreviation (e.g., 'LAL') */
    abbreviation: string;
    /** Team's city */
    city: string;
    /** Team's conference */
    conference: string;
    /** Team's division */
    division: string;
    /** Team's full name */
    full_name: string;
    /** Team's name */
    name: string;
}

/**
 * Interface representing a player's statistics
 * @interface PlayerStats
 */
export interface PlayerStats {
    /** Player's unique identifier */
    player_id: number;
    /** Games played */
    games_played: number;
    /** Season year */
    season: number;
    /** Minutes played per game */
    min: string;
    /** Field goals made per game */
    fgm: number;
    /** Field goals attempted per game */
    fga: number;
    /** Three-point field goals made per game */
    fg3m: number;
    /** Three-point field goals attempted per game */
    fg3a: number;
    /** Free throws made per game */
    ftm: number;
    /** Free throws attempted per game */
    fta: number;
    /** Offensive rebounds per game */
    oreb: number;
    /** Defensive rebounds per game */
    dreb: number;
    /** Total rebounds per game */
    reb: number;
    /** Assists per game */
    ast: number;
    /** Steals per game */
    stl: number;
    /** Blocks per game */
    blk: number;
    /** Turnovers per game */
    turnover: number;
    /** Personal fouls per game */
    pf: number;
    /** Points per game */
    pts: number;
    /** Field goal percentage */
    fg_pct: number;
    /** Three-point field goal percentage */
    fg3_pct: number;
    /** Free throw percentage */
    ft_pct: number;
    /** Fantasy points calculated based on stats */
    fantasy_points: number;
}

/**
 * Interface representing a map of player statistics
 * @interface PlayerStatsMap
 */
export interface PlayerStatsMap {
    [key: string]: PlayerStats;
}

/**
 * Interface representing the response from the NBA API for player data
 * @interface PlayerResponse
 */
export interface PlayerResponse {
    /** Array of player data */
    data: Player[];
    /** Metadata about the response */
    meta: {
        /** Total number of pages */
        total_pages: number;
        /** Current page number */
        current_page: number;
        /** Next page number, if available */
        next_page: number | null;
        /** Number of items per page */
        per_page: number;
        /** Total number of items */
        total_count: number;
    };
}

/**
 * Interface representing a player's season averages
 * @interface SeasonAverages
 */
export interface SeasonAverages {
    /** Player's unique identifier */
    player_id: number;
    /** Season year */
    season: number;
    /** Minutes played per game */
    min: string;
    /** Field goals made per game */
    fgm: number;
    /** Field goals attempted per game */
    fga: number;
    /** Three-point field goals made per game */
    fg3m: number;
    /** Three-point field goals attempted per game */
    fg3a: number;
    /** Free throws made per game */
    ftm: number;
    /** Free throws attempted per game */
    fta: number;
    /** Offensive rebounds per game */
    oreb: number;
    /** Defensive rebounds per game */
    dreb: number;
    /** Total rebounds per game */
    reb: number;
    /** Assists per game */
    ast: number;
    /** Steals per game */
    stl: number;
    /** Blocks per game */
    blk: number;
    /** Turnovers per game */
    turnover: number;
    /** Personal fouls per game */
    pf: number;
    /** Points per game */
    pts: number;
    /** Field goal percentage */
    fg_pct: number;
    /** Three-point field goal percentage */
    fg3_pct: number;
    /** Free throw percentage */
    ft_pct: number;
    /** Player Impact Estimate (PIE) - advanced metric */
    pie: number;
}

/**
 * Interface representing the response from the NBA API for season averages
 * @interface SeasonAveragesResponse
 */
export interface SeasonAveragesResponse {
    /** Array of season averages data */
    data: SeasonAverages[];
    /** Metadata about the response */
    meta: {
        /** Total number of pages */
        total_pages: number;
        /** Current page number */
        current_page: number;
        /** Next page number, if available */
        next_page: number | null;
        /** Number of items per page */
        per_page: number;
        /** Total number of items */
        total_count: number;
    };
}

/**
 * Interface representing the response from the NBA API for team data
 * @interface TeamResponse
 */
export interface TeamResponse {
    /** Array of team data */
    data: Team[];
    /** Metadata about the response */
    meta: {
        /** Total number of pages */
        total_pages: number;
        /** Current page number */
        current_page: number;
        /** Next page number, if available */
        next_page: number | null;
        /** Number of items per page */
        per_page: number;
        /** Total number of items */
        total_count: number;
    };
}

/**
 * Represents the response from the NBA API when fetching teams
 * @interface TeamResponse
 * @property {Team[]} data - Array of team objects
 * @property {Object} meta - Metadata about the response
 * @property {number} meta.total_pages - Total number of pages available
 * @property {number} meta.current_page - Current page number
 * @property {number | null} meta.next_page - Next page number, or null if none
 * @property {number} meta.per_page - Number of items per page
 * @property {number} meta.total_count - Total number of items
 */
export interface TeamResponse {
    data: Team[];
    meta: {
        total_pages: number;
        current_page: number;
        next_page: number | null;
        per_page: number;
        total_count: number;
    };
}

/**
 * Represents the response from the NBA API when fetching player stats
 * @interface PlayerStatsResponse
 * @property {PlayerStats[]} data - Array of player statistics objects
 * @property {Object} meta - Metadata about the response
 * @property {number} meta.total_pages - Total number of pages available
 * @property {number} meta.current_page - Current page number
 * @property {number | null} meta.next_page - Next page number, or null if none
 * @property {number} meta.per_page - Number of items per page
 * @property {number} meta.total_count - Total number of items
 */
export interface PlayerStatsResponse {
    data: PlayerStats[];
    meta: {
        total_pages: number;
        current_page: number;
        next_page: number | null;
        per_page: number;
        total_count: number;
    };
}

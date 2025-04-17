export interface ESPNPlayer {
    id: number;
    fullName: string;
    defaultPosition: string;
    injuryStatus?: string;
}

export interface ESPNPlayerPoolEntry {
    player: ESPNPlayer;
}

export interface ESPNRosterEntry {
    playerId: number;
    playerPoolEntry: ESPNPlayerPoolEntry;
}

export interface ESPNRoster {
    entries: ESPNRosterEntry[];
}

export interface ESPNRecord {
    overall: {
        wins: number;
        losses: number;
        pointsFor: number;
        pointsAgainst: number;
    };
}

export interface ESPNOwner {
    id: string;
    displayName: string;
}

export interface ESPNTeam {
    id: number;
    name: string;
    abbrev: string;
    owners: ESPNOwner[];
    roster: ESPNRoster;
    record: ESPNRecord;
    rank?: number;
    rankCalculatedFinal?: number;
}

export interface ESPNLeagueResponse {
    teams: ESPNTeam[];
    settings?: {
        name: string;
        seasonId: number;
    };
}

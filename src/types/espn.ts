import { ReactNode } from "react";

export interface ESPNPlayer {
    [x: string]: ReactNode;
    stats: any;
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

export interface ESPNScheduleSettings {
    matchupPeriodCount: number;
}

export interface ESPNSettings {
    name: string;
    seasonId: number;
    scheduleSettings?: ESPNScheduleSettings;
}

export interface ESPNScheduleMatchup {
    matchupPeriodId: number;
    home: {
        teamId: number;
        totalPoints: number;
    };
    away: {
        teamId: number;
        totalPoints: number;
    };
}

export interface ESPNLeagueResponse {
    seasonId: any;
    id: number;
    teams: ESPNTeam[];
    settings?: ESPNSettings;
    schedule?: ESPNScheduleMatchup[];
}

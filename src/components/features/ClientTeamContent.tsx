"use client";

import { useState, useEffect } from "react";
import { Player, Team, PlayerStatsMap } from "@/types/nba";
import FantasyBasketballTable from "./FantasyBasketballTable";
import TeamSelector from "./TeamSelector";
import { Box, Paper, Typography, Skeleton } from "@mui/material";
import { useLanguage } from "@/contexts/LanguageContext";
import { getBaseUrl } from "@/utils/getBaseUrl";

interface ClientTeamContentProps {
    initialTeams: Team[];
    initialPlayers: Player[];
    initialPlayerStatsMap: PlayerStatsMap;
}

export default function ClientTeamContent({
    initialTeams,
    initialPlayers,
    initialPlayerStatsMap,
}: ClientTeamContentProps) {
    const { t } = useLanguage();
    const [teams] = useState<Team[]>(initialTeams);
    const [players, setPlayers] = useState<Player[]>(initialPlayers);
    const [playerStatsMap, setPlayerStatsMap] = useState<PlayerStatsMap>(
        initialPlayerStatsMap
    );
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState<{
        column: string;
        direction: "asc" | "desc";
    }>({ column: "", direction: "asc" });

    // Find Spurs team initially
    useEffect(() => {
        const spursTeam = teams.find(
            (team) => team.full_name === "San Antonio Spurs"
        );
        if (spursTeam) {
            setSelectedTeam(spursTeam);
        }
    }, [teams]);

    const handleTeamChange = async (team: Team | null) => {
        if (!team) return;

        setLoading(true);
        setSelectedTeam(team);

        try {
            const baseUrl = getBaseUrl();
            const response = await fetch(`${baseUrl}/api/nba/players/${team.id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch players");
            }
            const { data: newPlayers } = await response.json();
            setPlayers(newPlayers);

            // Fetch stats for new players
            const statsPromises = newPlayers.map(async (player: Player) => {
                try {
                    const statsResponse = await fetch(
                        `${baseUrl}/api/nba/stats/${player.id}`
                    );
                    if (!statsResponse.ok) {
                        console.error(
                            `Failed to fetch stats for player ${player.id}`
                        );
                        return null;
                    }
                    const stats = await statsResponse.json();
                    return { playerId: player.id, stats: stats.data[0] };
                } catch (error) {
                    console.error(
                        `Error fetching stats for player ${player.id}:`,
                        error
                    );
                    return null;
                }
            });

            const statsResults = await Promise.all(statsPromises);
            const newPlayerStatsMap: PlayerStatsMap = {};
            statsResults.forEach((result) => {
                if (result && result.stats) {
                    newPlayerStatsMap[result.playerId] = result.stats;
                }
            });
            setPlayerStatsMap(newPlayerStatsMap);
        } catch (error) {
            console.error("Error fetching team data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (column: string) => {
        let direction: "asc" | "desc" = "asc";

        // If clicking the same column, toggle the direction
        if (sortConfig.column === column) {
            direction = sortConfig.direction === "asc" ? "desc" : "asc";
        }

        setSortConfig({ column, direction });

        const sortedPlayers = [...players].sort((a, b) => {
            const statsA = playerStatsMap[a.id];
            const statsB = playerStatsMap[b.id];

            let comparison = 0;
            switch (column) {
                case "name":
                    comparison = `${a.first_name} ${a.last_name}`.localeCompare(
                        `${b.first_name} ${b.last_name}`
                    );
                    break;
                case "position":
                    comparison = (a.position || "").localeCompare(
                        b.position || ""
                    );
                    break;
                case "team":
                    comparison = (a.team?.full_name || "").localeCompare(
                        b.team?.full_name || ""
                    );
                    break;
                case "points":
                    comparison = (statsB?.pts || 0) - (statsA?.pts || 0);
                    break;
                case "rebounds":
                    comparison = (statsB?.reb || 0) - (statsA?.reb || 0);
                    break;
                case "assists":
                    comparison = (statsB?.ast || 0) - (statsA?.ast || 0);
                    break;
                case "steals":
                    comparison = (statsB?.stl || 0) - (statsA?.stl || 0);
                    break;
                case "blocks":
                    comparison = (statsB?.blk || 0) - (statsA?.blk || 0);
                    break;
                case "fantasyPoints":
                    const fantasyPointsA = statsA
                        ? statsA.pts +
                          statsA.reb * 1.2 +
                          statsA.ast * 1.5 +
                          statsA.stl * 3 +
                          statsA.blk * 3
                        : 0;
                    const fantasyPointsB = statsB
                        ? statsB.pts +
                          statsB.reb * 1.2 +
                          statsB.ast * 1.5 +
                          statsB.stl * 3 +
                          statsB.blk * 3
                        : 0;
                    comparison = fantasyPointsB - fantasyPointsA;
                    break;
            }
            return direction === "asc" ? comparison : -comparison;
        });
        setPlayers(sortedPlayers);
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        {t("pages.fantasy.selectTeam")}
                    </Typography>
                    <TeamSelector
                        teams={teams}
                        selectedTeam={selectedTeam}
                        onTeamChange={handleTeamChange}
                    />
                </Box>

                {loading ? (
                    <Box sx={{ width: "100%" }}>
                        <Skeleton
                            variant="rectangular"
                            height={60}
                            sx={{ mb: 2 }}
                        />
                        <Skeleton variant="rectangular" height={400} />
                    </Box>
                ) : (
                    <>
                        <Typography variant="h6" gutterBottom>
                            {selectedTeam
                                ? `${selectedTeam.full_name} ${t("pages.fantasy.players")}`
                                : t("pages.fantasy.noTeamSelected")}
                        </Typography>
                        <FantasyBasketballTable
                            players={players}
                            playerStatsMap={playerStatsMap}
                            onSort={handleSort}
                            sortConfig={sortConfig}
                        />
                    </>
                )}
            </Paper>
        </Box>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Player, Team, PlayerStatsMap } from "@/types/nba";
import FantasyBasketballTable from "./FantasyBasketballTable";
import TeamSelector from "./TeamSelector";
import { Box, Paper, Typography, Skeleton } from "@mui/material";
import { useLanguage } from "@/contexts/LanguageContext";

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
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_NBA_SERVER_URL}/api/nba/players/${team.id}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch players");
            }
            const { data: newPlayers } = await response.json();
            setPlayers(newPlayers);

            // Fetch stats for all players in parallel
            const statsPromises = newPlayers.map((player: Player) =>
                fetch(
                    `${process.env.NEXT_PUBLIC_NBA_SERVER_URL}/api/nba/stats/${player.id}`
                )
                    .then((res) => res.json())
                    .then((stats) => ({
                        playerId: player.id,
                        stats: stats.data[0],
                    }))
                    .catch((error) => {
                        console.error(
                            `Error fetching stats for player ${player.id}:`,
                            error
                        );
                        return null;
                    })
            );

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
                case "pts":
                    comparison = (statsB?.pts || 0) - (statsA?.pts || 0);
                    break;
                case "reb":
                    comparison = (statsB?.reb || 0) - (statsA?.reb || 0);
                    break;
                case "ast":
                    comparison = (statsB?.ast || 0) - (statsA?.ast || 0);
                    break;
                case "stl":
                    comparison = (statsB?.stl || 0) - (statsA?.stl || 0);
                    break;
                case "blk":
                    comparison = (statsB?.blk || 0) - (statsA?.blk || 0);
                    break;
                case "games_played":
                    comparison =
                        (statsB?.games_played || 0) -
                        (statsA?.games_played || 0);
                    break;
                case "fantasyPoints":
                    comparison =
                        (statsB?.fantasy_points || 0) -
                        (statsA?.fantasy_points || 0);
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

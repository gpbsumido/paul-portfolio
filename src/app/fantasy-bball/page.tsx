"use client";

import ClientTeamContent from "@/components/features/ClientTeamContent";
import { Player, Team, PlayerStatsMap } from "@/types/nba";
import { Box, Container, Typography } from "@mui/material";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

export default function FantasyBasketballPage() {
    const { t } = useLanguage();
    const [teams, setTeams] = useState<Team[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [playerStatsMap, setPlayerStatsMap] = useState<PlayerStatsMap>({});
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // First fetch teams
                const teamsResponse = await fetch(`/api/nba/teams`, {
                    headers: { Accept: "application/json" },
                    next: { revalidate: 3600 },
                });

                if (!teamsResponse.ok) {
                    throw new Error(
                        `Failed to fetch teams: ${teamsResponse.statusText}`
                    );
                }

                const teamsData = await teamsResponse.json();
                setTeams(teamsData.data);

                // Find Spurs team
                const spursTeam = teamsData.data.find(
                    (team: Team) => team.full_name === "San Antonio Spurs"
                );
                if (!spursTeam) {
                    throw new Error("San Antonio Spurs team not found");
                }

                // Then fetch Spurs players
                const playersResponse = await fetch(
                    `/api/nba/players/${spursTeam.id}`,
                    {
                        headers: { Accept: "application/json" },
                        next: { revalidate: 3600 },
                    }
                );

                if (!playersResponse.ok) {
                    throw new Error(
                        `Failed to fetch players: ${playersResponse.statusText}`
                    );
                }

                const playersData = await playersResponse.json();
                const updatedPlayers = playersData.data.map(
                    (player: Player) => ({
                        ...player,
                        team:
                            teamsData.data.find(
                                (team: Team) => team.id === player.team?.id
                            ) || player.team,
                    })
                );
                setPlayers(updatedPlayers);

                // Batch player stats requests
                const BATCH_SIZE = 5;
                const statsPromises = [];

                for (let i = 0; i < updatedPlayers.length; i += BATCH_SIZE) {
                    const batch = updatedPlayers.slice(i, i + BATCH_SIZE);
                    const batchPromises = batch.map(async (player: Player) => {
                        try {
                            const statsResponse = await fetch(
                                `/api/nba/stats/${player.id}`,
                                {
                                    headers: { Accept: "application/json" },
                                    next: { revalidate: 300 },
                                }
                            );
                            if (!statsResponse.ok) {
                                console.error(
                                    `Failed to fetch stats for player ${player.id}: ${statsResponse.statusText}`
                                );
                                return null;
                            }
                            const stats = await statsResponse.json();
                            return {
                                playerId: player.id,
                                stats: stats.data[0],
                            };
                        } catch (error) {
                            console.error(
                                `Error fetching stats for player ${player.id}:`,
                                error
                            );
                            return null;
                        }
                    });
                    statsPromises.push(...batchPromises);
                }

                const statsResults = await Promise.all(statsPromises);
                const newPlayerStatsMap: PlayerStatsMap = {};
                statsResults.forEach((result) => {
                    if (result && result.stats) {
                        newPlayerStatsMap[result.playerId] = result.stats;
                    }
                });
                setPlayerStatsMap(newPlayerStatsMap);
                setIsLoading(false);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error("An unknown error occurred")
                );
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "60vh",
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h4" color="error" gutterBottom>
                        {t("pages.fantasy.errorTitle")}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {error.message || t("common.unknownError")}
                    </Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    position: "fixed",
                    top: { xs: "8px", sm: "16px" },
                    left: { xs: "8px", sm: "16px" },
                    zIndex: 9999,
                }}
            >
                <HomeButton component={Link} href="/" />
            </Box>
            <Box
                sx={{
                    position: "fixed",
                    top: { xs: "8px", sm: "16px" },
                    right: { xs: "8px", sm: "16px" },
                    zIndex: 9999,
                }}
            >
                <LanguageSwitcher />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Typography variant="h4" component="h1" fontWeight="bold">
                        {t("pages.fantasy.title")}
                    </Typography>
                </Box>

                {isLoading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "200px",
                        }}
                    >
                        <Typography variant="body1" color="text.secondary">
                            Loading...
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <ClientTeamContent
                            initialTeams={teams}
                            initialPlayers={players}
                            initialPlayerStatsMap={playerStatsMap}
                        />

                        <Typography variant="caption" color="text.secondary">
                            {t("pages.fantasy.dataNote")}
                        </Typography>
                    </>
                )}
            </Box>
        </Container>
    );
}

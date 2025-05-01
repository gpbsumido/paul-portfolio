"use client";

import ClientTeamContent from "@/components/features/fantasy/ClientTeamContent";
import { Player, Team, PlayerStatsMap } from "@/types/nba";
import { Box, Container, Skeleton, Typography } from "@mui/material";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import FantasyBasketballDropdownNav from "@/components/features/fantasy/FantasyBasketballDropdownNav";
import ErrorBoundary from "@/components/layout/ErrorBoundary";

/**
 * NBA Stats Page Component
 *
 * @component
 * @description
 * Displays NBA player statistics in a table format with team selection capabilities.
 * Fetches team and player data from the NBA API and allows users to view detailed
 * statistics for players on selected teams.
 *
 * @example
 * ```tsx
 * <NBAStatsPage />
 * ```
 *
 * @returns {JSX.Element} The NBA stats page component
 */
export default function NBAStatsPage() {
    const { t } = useLanguage();
    const [teams, setTeams] = useState<Team[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [playerStatsMap, setPlayerStatsMap] = useState<PlayerStatsMap>({});
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Fetches NBA teams and player data from the API
     * @async
     * @function fetchData
     * @returns {Promise<void>}
     */
    useEffect(() => {
        const fetchData = async () => {
            try {
                // First fetch teams
                const teamsResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/nba/teams`,
                    {
                        headers: { Accept: "application/json" },
                        next: { revalidate: 3600 },
                    }
                );

                if (!teamsResponse.ok) {
                    throw new Error(
                        `Failed to fetch teams: ${teamsResponse.statusText}`
                    );
                }

                const teamsData = await teamsResponse.json();
                setTeams(teamsData.data.data);

                // Find Spurs team
                const spursTeam = teamsData.data.data.find(
                    (team: Team) => team.full_name === "San Antonio Spurs"
                );
                if (!spursTeam) {
                    throw new Error("San Antonio Spurs team not found");
                }

                // Then fetch Spurs players
                const playersResponse = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/nba/players/${spursTeam.id}`,
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
                            teamsData.data.data.find(
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
                                `${process.env.NEXT_PUBLIC_API_URL}/api/nba/stats/${player.id}`,
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    /**
     * Renders the main content of the page based on the current state
     * @function renderContent
     * @returns {JSX.Element} The appropriate content based on loading/error state
     */
    const renderContent = () => {
        if (error) {
            return (
                <Typography variant="h6" align="center" color="error">
                    {error.message}
                </Typography>
            );
        }

        return (
            <ClientTeamContent
                initialTeams={teams}
                initialPlayers={players}
                initialPlayerStatsMap={playerStatsMap}
            />
        );
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    position: "fixed",
                    top: { xs: "8px", sm: "16px" },
                    left: { xs: "8px", sm: "16px" },
                    zIndex: 9999,
                }}
                role="navigation"
                aria-label={t("navigation.home")}
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
                role="navigation"
                aria-label={t("navigation.language")}
            >
                <LanguageSwitcher />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
                role="main"
                aria-label={t("pages.fantasy.subpages.nbaStats")}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 2,
                    }}
                    role="navigation"
                    aria-label={t("navigation.fantasy")}
                >
                    <FantasyBasketballDropdownNav />
                </Box>
                <ErrorBoundary>
                    {isLoading ? (
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <Typography variant="h6">
                                <Skeleton width="60%" />
                            </Typography>
                            <Skeleton variant="rectangular" height={200} />
                            <Skeleton variant="rectangular" height={200} />
                        </Box>
                    ) : (
                        renderContent()
                    )}
                </ErrorBoundary>
            </Box>
        </Container>
    );
}

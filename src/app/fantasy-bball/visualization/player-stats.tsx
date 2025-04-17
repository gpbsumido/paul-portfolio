import React, { useEffect, useState } from "react";
import { Box, Paper, CircularProgress, Typography } from "@mui/material";
import ReactECharts from "echarts-for-react";
import { useTheme } from "@mui/material/styles";
import { ESPNLeagueResponse } from "@/types/espn";
import { useLanguage } from "@/contexts/LanguageContext";

interface PlayerStatsProps {
    leagueData: ESPNLeagueResponse;
}

interface PlayerScatterData {
    playerId: string;
    playerName: string;
    teamId: number;
    teamName: string;
    week: number;
    points: number;
    rank: number;
}

interface PlayerStats {
    scoringPeriodId: number;
    statSourceId: number;
    appliedStats: Record<string, number>;
}

interface PlayerPoolEntry {
    player: {
        id: number;
        firstName: string;
        lastName: string;
        stats?: PlayerStats[];
    };
    stats?: PlayerStats[];
}

interface Matchup {
    matchupPeriodId: number;
    home: {
        teamId: number;
        rosterForMatchupPeriod?: {
            entries: Array<{
                playerPoolEntry: PlayerPoolEntry;
            }>;
        };
    };
    away: {
        teamId: number;
        rosterForMatchupPeriod?: {
            entries: Array<{
                playerPoolEntry: PlayerPoolEntry;
            }>;
        };
    };
}

interface WeekData {
    schedule: Matchup[];
}

interface TooltipParams {
    data: {
        playerName: string;
        teamName: string;
        week: number;
        points: number;
        value: [number, number];
        rank: number;
    };
}

function calculateWeeklyScore(weeklyStats: Record<string, number>): number {
    return Object.values(weeklyStats).reduce((sum, value) => sum + value, 0);
}

export default function PlayerStats({ leagueData }: PlayerStatsProps) {
    const theme = useTheme();
    const { t } = useLanguage();
    const [chartData, setChartData] = useState<PlayerScatterData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!leagueData || !leagueData.teams) {
            console.warn("League data not fully loaded");
            return;
        }

        const getScoringPeriodIdsByMatchupPeriod = async () => {
            const url = new URL(
                `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${leagueData.seasonId}/segments/0/leagues/${leagueData.id}`
            );
            url.searchParams.append("view", "mMatchupScore");

            const res = await fetch(url.toString());
            const data = await res.json();

            const periodMap = new Map<number, number>(); // matchupPeriodId -> scoringPeriodId

            for (const matchup of data.schedule) {
                const { matchupPeriodId, home, away } = matchup;

                if (!periodMap.has(matchupPeriodId)) {
                    const homePeriods = Object.keys(
                        home?.pointsByScoringPeriod ?? {}
                    ).map(Number);
                    const awayPeriods = Object.keys(
                        away?.pointsByScoringPeriod ?? {}
                    ).map(Number);
                    const combined = [...homePeriods, ...awayPeriods];
                    const firstPeriodId = Math.min(...combined);

                    if (Number.isFinite(firstPeriodId)) {
                        periodMap.set(matchupPeriodId, firstPeriodId);
                    }
                }
            }
            return periodMap;
        };

        const fetchWeekData = async (scoringPeriodId: number) => {
            try {
                // First get matchup data
                const matchupUrl = new URL(
                    `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${leagueData.seasonId}/segments/0/leagues/${leagueData.id}`
                );
                matchupUrl.searchParams.append("view", "mMatchupScore");
                matchupUrl.searchParams.append("view", "mMatchup");
                matchupUrl.searchParams.append(
                    "scoringPeriodId",
                    scoringPeriodId.toString()
                );

                const matchupResponse = await fetch(matchupUrl.toString());
                if (!matchupResponse.ok) {
                    throw new Error(
                        `HTTP error! status: ${matchupResponse.status}`
                    );
                }
                const matchupData = await matchupResponse.json();

                // Then get roster data
                const rosterUrl = new URL(
                    `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${leagueData.seasonId}/segments/0/leagues/${leagueData.id}`
                );
                rosterUrl.searchParams.append("view", "mRoster");
                rosterUrl.searchParams.append("view", "mTeam");
                rosterUrl.searchParams.append(
                    "scoringPeriodId",
                    scoringPeriodId.toString()
                );

                const rosterResponse = await fetch(rosterUrl.toString());
                if (!rosterResponse.ok) {
                    throw new Error(
                        `HTTP error! status: ${rosterResponse.status}`
                    );
                }
                const rosterData = await rosterResponse.json();

                // Combine the data
                const combinedData = {
                    schedule: matchupData.schedule,
                    teams: rosterData.teams,
                    scoringPeriodId: scoringPeriodId.toString(),
                };
                return combinedData;
            } catch (error) {
                console.error(
                    `Error fetching scoring period ${scoringPeriodId} data:`,
                    error
                );
                return null;
            }
        };

        const processWeek = (weekData: WeekData, week: number) => {
            const weekDataPoints: PlayerScatterData[] = [];
            const matchups = weekData.schedule || [];

            // Filter matchups based on the scoringPeriodId (week)
            const filteredMatchups = matchups.filter(
                (matchup) => Number(matchup.matchupPeriodId) === Number(week)
            );

            filteredMatchups.forEach((matchup: Matchup) => {
                const sides = ["home", "away"] as const;
                sides.forEach((side) => {
                    const team = matchup[side];
                    if (!team || !team.rosterForMatchupPeriod) {
                        return;
                    }

                    const entries = team.rosterForMatchupPeriod.entries;

                    for (const entry of entries) {
                        if (
                            !entry ||
                            !entry.playerPoolEntry ||
                            !entry.playerPoolEntry.player
                        ) {
                            console.warn("Missing player data in entry", entry);
                            continue;
                        }

                        const playerEntry = entry.playerPoolEntry;
                        const player = playerEntry.player;

                        if (
                            !playerEntry.player.stats ||
                            playerEntry.player.stats.length === 0
                        ) {
                            console.warn(
                                "No stats available for player",
                                player.firstName,
                                player.lastName
                            );
                            return;
                        }

                        const weeklyStats =
                            playerEntry.player.stats[0].appliedStats;
                        const weeklyPoints = calculateWeeklyScore(weeklyStats);

                        if (weeklyPoints > 0) {
                            const teamName =
                                leagueData.teams?.find(
                                    (t) => t.id === team.teamId
                                )?.name || `Team ${team?.teamId}`;

                            weekDataPoints.push({
                                playerId: player.id.toString(),
                                playerName: `${player.firstName} ${player.lastName}`,
                                teamId: team.teamId,
                                teamName: teamName,
                                week,
                                points: weeklyPoints,
                                rank: 0,
                            });
                        }
                    }
                });
            });

            return weekDataPoints;
        };

        const fetchAllWeeks = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const regularSeasonWeeks =
                    leagueData.settings?.scheduleSettings?.matchupPeriodCount ||
                    22;

                // Get the mapping of matchup periods to scoring periods
                const periodMap = await getScoringPeriodIdsByMatchupPeriod();

                // Fetch data for each week using the correct scoring period ID
                const weeksData = await Promise.all(
                    Array.from({ length: regularSeasonWeeks }, async (_, i) => {
                        const week = i + 1;
                        const scoringPeriodId = periodMap.get(week);
                        if (!scoringPeriodId) {
                            console.warn(
                                `No scoring period found for week ${week}`
                            );
                            return null;
                        }
                        return fetchWeekData(scoringPeriodId);
                    })
                );

                // Process all weeks
                const allData = weeksData.reduce<PlayerScatterData[]>(
                    (acc, weekData, index) => {
                        if (!weekData) return acc;
                        const week = index + 1;
                        const weekDataPoints = processWeek(weekData, week);
                        return [...acc, ...weekDataPoints];
                    },
                    []
                );

                // Improved ranking logic
                const groupedByWeek = new Map<number, PlayerScatterData[]>();
                allData.forEach((data) => {
                    if (!groupedByWeek.has(data.week)) {
                        groupedByWeek.set(data.week, []);
                    }
                    groupedByWeek.get(data.week)?.push(data);
                });

                groupedByWeek.forEach((players) => {
                    players.sort((a, b) => b.points - a.points);
                    let rank = 1;
                    players.forEach((player, index) => {
                        if (
                            index > 0 &&
                            player.points !== players[index - 1].points
                        ) {
                            rank = index + 1;
                        }
                        player.rank = rank;
                    });
                });

                setChartData(allData);
            } catch (err) {
                console.error("Error in fetchAllWeeks:", err);
                setError("Failed to load player data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllWeeks();
    }, [leagueData]);

    const getTopContributorsOption = () => {
        const teams = [...new Set(chartData.map((d) => d.teamName))];

        // Create a color palette for teams
        const teamColors = teams.reduce(
            (acc, team, index) => {
                const hue = (index * 137.508) % 360; // Golden angle for color distribution
                acc[team] = `hsl(${hue}, 70%, 50%)`;
                return acc;
            },
            {} as Record<string, string>
        );

        const option = {
            backgroundColor: "transparent",
            title: {
                text: t("pages.fantasy.playerStatsTitle"),
                left: "center",
                top: 0,
                textStyle: {
                    color: theme.palette.text.primary,
                    fontSize: 20,
                    fontWeight: "bold",
                },
            },
            tooltip: {
                trigger: "item",
                formatter: (params: TooltipParams) => {
                    const data = params.data;
                    return `${data.playerName}<br/>Team: ${data.teamName}<br/>Week ${data.week}: ${data.points} pts<br/>Rank: ${data.rank}`;
                },
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.divider,
                textStyle: {
                    color: theme.palette.text.primary,
                },
            },
            legend: {
                data: teams,
                top: 40,
                textStyle: {
                    color: theme.palette.text.primary,
                },
            },
            grid: {
                top: 100,
                right: 30,
                bottom: 80,
                left: 50,
            },
            xAxis: {
                type: "value",
                name: "Week",
                nameGap: 25,
                nameLocation: "middle",
                min: 1,
                max:
                    leagueData.settings?.scheduleSettings?.matchupPeriodCount ||
                    18,
                axisLabel: {
                    color: theme.palette.text.primary,
                    margin: 10,
                },
                axisLine: {
                    lineStyle: {
                        color: theme.palette.text.primary,
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: "dashed",
                        color: theme.palette.divider,
                    },
                },
            },
            yAxis: {
                type: "value",
                name: "Points",
                nameLocation: "middle",
                nameGap: 30,
                axisLabel: {
                    color: theme.palette.text.primary,
                },
                axisLine: {
                    lineStyle: {
                        color: theme.palette.text.primary,
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: "dashed",
                        color: theme.palette.divider,
                    },
                },
            },
            series: teams.map((teamName) => ({
                name: teamName,
                type: "scatter",
                data: chartData
                    .filter((d) => d.teamName === teamName)
                    .map((d) => ({
                        playerName: d.playerName,
                        value: [d.week, d.points],
                        teamName: d.teamName,
                        week: d.week,
                        points: d.points,
                        rank: d.rank,
                    })),
                symbolSize: 8,
                itemStyle: {
                    color: teamColors[teamName],
                },
                emphasis: {
                    itemStyle: {
                        borderColor: theme.palette.background.paper,
                        borderWidth: 2,
                    },
                    label: {
                        show: true,
                        formatter: (params: TooltipParams) => {
                            const data = params.data;
                            return `${data.playerName} (Rank ${data.rank})`;
                        },
                        position: "top",
                    },
                },
            })),
            dataZoom: [
                {
                    type: "slider",
                    show: true,
                    xAxisIndex: [0],
                    start: 0,
                    end: 100,
                    bottom: 15,
                    height: 20,
                    filterMode: "filter",
                    zoomLock: false,
                    handleStyle: {
                        color: theme.palette.primary.main,
                    },
                    showDetail: false,
                    showDataShadow: false,
                    brushSelect: true,
                    moveOnMouseMove: true,
                },
                {
                    type: "slider",
                    show: true,
                    yAxisIndex: [0],
                    start: 0,
                    end: 100,
                    right: 0,
                    width: 20,
                    filterMode: "filter",
                    zoomLock: false,
                    handleStyle: {
                        color: theme.palette.primary.main,
                    },
                },
            ],
        };
        return option;
    };

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "400px",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "400px",
                }}
            >
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ height: "500px" }}>
                    <ReactECharts
                        option={getTopContributorsOption()}
                        style={{
                            height: "100%",
                            width: "100%",
                            paddingBottom: "20px",
                        }}
                        theme={theme.palette.mode === "dark" ? "dark" : "light"}
                    />
                </Box>
            </Paper>
        </Box>
    );
}

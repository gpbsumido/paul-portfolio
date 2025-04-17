"use client";

import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    Menu,
    MenuItem,
    Portal,
    CircularProgress,
} from "@mui/material";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import FantasyDropdownNav from "@/components/FantasyDropdownNav";
import { useEffect, useState } from "react";
import { ESPNLeagueResponse } from "@/types/espn";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ErrorBoundary from "@/components/features/ErrorBoundary";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@mui/material/styles";
import ReactECharts from 'echarts-for-react';

interface WeeklyRanking {
    week: number;
    rank: number;
}

interface TeamRankingData {
    name: string;
    rankings: WeeklyRanking[];
    color: string;
    records: TeamRecord[];
}

interface TeamRecord {
    wins: number;
    losses: number;
    totalPoints: number;
}

interface WeeklyTeamRecord {
    [teamId: number]: TeamRecord;
}

interface TooltipParam {
    seriesName: string;
    value: number;
    color: string;
    axisValue: number;
}

interface WeekData {
    name: string;
    rank: number;
    record: TeamRecord | undefined;
    color: string;
}

/**
 * Visualization Page Component
 *
 * @component
 * @description
 * Displays a line chart showing the progression of team rankings throughout the season.
 * Allows users to switch between different seasons and view the ranking trends.
 *
 * @example
 * ```tsx
 * <VisualizationPage />
 * ```
 *
 * @returns {JSX.Element} The visualization page component
 */
export default function VisualizationPage() {
    const { t } = useLanguage();
    const theme = useTheme();
    const [leagueData, setLeagueData] = useState<ESPNLeagueResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSeason, setSelectedSeason] = useState("2025");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSeasonChange = (season: string) => {
        if (season === selectedSeason) {
            handleClose();
            return;
        }
        setSelectedSeason(season);
        setLoading(true);
        setError(null);
        handleClose();
    };

    const fetchLeagueData = async () => {
        try {
            setLoading(true);
            setError(null);
            // Add mStandings to get weekly rankings
            const response = await fetch(
                `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${selectedSeason}/segments/0/leagues/449389534?view=mTeam&view=mRoster&view=mSettings&view=mStandings`,
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch league data");
            }

            const data = await response.json();
            setLeagueData(data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An unknown error occurred"
            );
            setLeagueData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeagueData();
    }, [selectedSeason]);

    const prepareChartData = (): TeamRankingData[] => {
        if (!leagueData?.teams || !leagueData.schedule) return [];

        // Get regular season length from schedule settings
        const regularSeasonLength = leagueData.settings?.scheduleSettings?.matchupPeriodCount || 0;

        console.log('regularSeasonLength',regularSeasonLength)
        
        // Initialize records from scratch
        const weeklyRecords: { [week: number]: WeeklyTeamRecord } = {};
        const teamNames: { [teamId: number]: string } = {};
        const headToHeadRecords: { [teamId: number]: { [opponentId: number]: { wins: number; losses: number } } } = {};

        // Store team names and initialize head-to-head records
        leagueData.teams.forEach(team => {
            teamNames[team.id] = team.name;
            headToHeadRecords[team.id] = {};
            leagueData.teams.forEach(opponent => {
                if (team.id !== opponent.id) {
                    headToHeadRecords[team.id][opponent.id] = { wins: 0, losses: 0 };
                }
            });
        });

        // Pre-initialize weekly records
        for (let week = 1; week <= regularSeasonLength; week++) {
            weeklyRecords[week] = {};
            leagueData.teams.forEach(team => {
                // Start with previous week's record if it exists, otherwise 0-0
                const prevWeek = week - 1;
                const prevRecord = prevWeek > 0 ? weeklyRecords[prevWeek][team.id] : { wins: 0, losses: 0, totalPoints: 0 };
                weeklyRecords[week][team.id] = { ...prevRecord };
            });
        }

        // Sort matchups
        const sortedMatchups = [...leagueData.schedule].sort((a, b) => a.matchupPeriodId - b.matchupPeriodId);

        // Process matchups
        sortedMatchups.forEach(match => {
            const week = match.matchupPeriodId;
            if (week > regularSeasonLength) return;

            const homeTeamId = match.home.teamId;
            const awayTeamId = match.away.teamId;
            const homePoints = match.home.totalPoints;
            const awayPoints = match.away.totalPoints;

            // Get previous week's records
            const prevWeek = week - 1;
            const homePrevRecord = prevWeek > 0 ? weeklyRecords[prevWeek][homeTeamId] : { wins: 0, losses: 0, totalPoints: 0 };
            const awayPrevRecord = prevWeek > 0 ? weeklyRecords[prevWeek][awayTeamId] : { wins: 0, losses: 0, totalPoints: 0 };

            if (homePoints > awayPoints) {
                weeklyRecords[week][homeTeamId] = {
                    wins: homePrevRecord.wins + 1,
                    losses: homePrevRecord.losses,
                    totalPoints: homePrevRecord.totalPoints + homePoints
                };
                weeklyRecords[week][awayTeamId] = {
                    wins: awayPrevRecord.wins,
                    losses: awayPrevRecord.losses + 1,
                    totalPoints: awayPrevRecord.totalPoints + awayPoints
                };
                headToHeadRecords[homeTeamId][awayTeamId].wins++;
                headToHeadRecords[awayTeamId][homeTeamId].losses++;
            } else if (awayPoints > homePoints) {
                weeklyRecords[week][awayTeamId] = {
                    wins: awayPrevRecord.wins + 1,
                    losses: awayPrevRecord.losses,
                    totalPoints: awayPrevRecord.totalPoints + awayPoints
                };
                weeklyRecords[week][homeTeamId] = {
                    wins: homePrevRecord.wins,
                    losses: homePrevRecord.losses + 1,
                    totalPoints: homePrevRecord.totalPoints + homePoints
                };
                headToHeadRecords[awayTeamId][homeTeamId].wins++;
                headToHeadRecords[homeTeamId][awayTeamId].losses++;
            }
        });

        // Convert weekly records to rankings
        const teamData = leagueData.teams.map(team => {
            const rankings: WeeklyRanking[] = [];
            const weeks = Object.keys(weeklyRecords).map(Number).sort((a, b) => a - b);

            weeks.forEach(week => {
                // Get all teams' records for this week
                const weekRecords = weeklyRecords[week];
                const teamRecords = Object.entries(weekRecords).map(([teamId, record]) => ({
                    teamId: parseInt(teamId),
                    ...record
                }));

                // Sort teams by wins (desc), then by head-to-head record, then by total points (desc)
                teamRecords.sort((a, b) => {
                    if (b.wins !== a.wins) return b.wins - a.wins;
                    
                    // Head-to-head tiebreaker
                    const headToHeadA = headToHeadRecords[a.teamId]?.[b.teamId];
                    const headToHeadB = headToHeadRecords[b.teamId]?.[a.teamId];
                    if (headToHeadA && headToHeadB) {
                        const h2hA = headToHeadA.wins;
                        const h2hB = headToHeadB.wins;
                        if (h2hA !== h2hB) return h2hB - h2hA;
                    }
                    
                    return b.totalPoints - a.totalPoints;
                });

                // Find rank of current team
                const rank = teamRecords.findIndex(record => record.teamId === team.id) + 1;
                rankings.push({ week, rank });
            });

            return {
                name: team.name,
                rankings,
                color: team.rankCalculatedFinal === 1 
                    ? theme.palette.success.main 
                    : (team.rankCalculatedFinal ?? 0) <= 3 
                        ? theme.palette.primary.main 
                        : theme.palette.text.secondary,
                records: weeks.map(week => weeklyRecords[week][team.id])
            };
        });

        return teamData;
    };

    const getChartOption = () => {
        const teamData = prepareChartData();
        const maxWeek = Math.max(...teamData.flatMap(team => team.rankings.map(r => r.week)));
        
        const series = teamData.map(team => ({
            name: team.name,
            type: 'line',
            data: team.rankings.map(r => r.rank),
            symbolSize: 6,
            lineStyle: {
                width: 2
            },
            itemStyle: {
                color: team.color,
                borderColor: theme.palette.background.paper,
                borderWidth: 1
            },
            emphasis: {
                itemStyle: {
                    color: team.color,
                    borderColor: theme.palette.background.paper,
                    borderWidth: 2
                }
            }
        }));

        return {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                formatter: (params: TooltipParam[]) => {
                    const week = params[0].axisValue;
                    
                    // Get all teams' data for this week and sort by rank
                    const weekData: WeekData[] = params.map(param => {
                        const team = teamData.find(t => t.name === param.seriesName);
                        const record = team?.records[week - 1];
                        return {
                            name: param.seriesName,
                            rank: param.value,
                            record: record,
                            color: param.color
                        };
                    }).sort((a, b) => a.rank - b.rank);

                    // Build tooltip content with teams ordered by rank
                    let result = `<div style="font-weight: bold; margin-bottom: 8px;">${t("pages.fantasy.week")} ${week}</div>`;
                    weekData.forEach(team => {
                        result += `<div style="margin: 4px 0;">
                            <span style="color:${team.color}">${team.name}</span>: 
                            ${t("pages.fantasy.rank")} ${team.rank} 
                            (${team.record?.wins || 0}-${team.record?.losses || 0})
                        </div>`;
                    });
                    return result;
                },
                backgroundColor: theme.palette.background.paper,
                borderColor: theme.palette.divider,
                textStyle: {
                    color: theme.palette.text.primary
                },
                extraCssText: 'padding: 12px; border-radius: 4px;'
            },
            legend: {
                data: teamData.map(team => team.name),
                textStyle: {
                    color: theme.palette.text.primary,
                    fontSize: 12
                },
                top: 0,
                padding: [0, 0, 20, 0]
            },
            grid: {
                top: 60,
                right: 30,
                bottom: 30,
                left: 50
            },
            xAxis: {
                type: 'category',
                data: Array.from({ length: maxWeek }, (_, i) => i + 1),
                name: t("pages.fantasy.week"),
                nameLocation: 'middle',
                nameGap: 25,
                axisLine: {
                    lineStyle: {
                        color: theme.palette.text.primary
                    }
                },
                axisLabel: {
                    color: theme.palette.text.primary
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: theme.palette.divider
                    }
                }
            },
            yAxis: {
                type: 'value',
                inverse: true,
                min: 1,
                max: teamData.length,
                name: t("pages.fantasy.columns.finalPosition"),
                nameLocation: 'middle',
                nameGap: 30,
                axisLine: {
                    lineStyle: {
                        color: theme.palette.text.primary
                    }
                },
                axisLabel: {
                    color: theme.palette.text.primary
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',
                        color: theme.palette.divider
                    }
                }
            },
            series
        };
    };

    const renderContent = () => {
        if (loading) {
            return (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="400px"
                >
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="400px"
                    gap={2}
                >
                    <Typography color="error" variant="h6">
                        {t("pages.error")}
                    </Typography>
                    <Typography color="text.secondary">
                        {error}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={fetchLeagueData}
                        sx={{
                            mt: 2,
                            backgroundColor: "black",
                            color: "white",
                            "&:hover": {
                                backgroundColor: "black",
                            },
                        }}
                    >
                        {t("pages.tryAgain")}
                    </Button>
                </Box>
            );
        }

        if (!leagueData?.teams) {
            return (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="400px"
                >
                    <Typography color="text.secondary">
                        {t("pages.fantasy.noData")}
                    </Typography>
                </Box>
            );
        }

        return (
            <Box sx={{ width: "100%", height: "600px" }}>
                <ReactECharts
                    option={getChartOption()}
                    style={{ height: '100%', width: '100%' }}
                    theme={theme.palette.mode}
                />
            </Box>
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
            >
                <HomeButton />
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
                    <FantasyDropdownNav />
                </Box>
                <Paper elevation={2} sx={{ p: 3 }}>
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            align="center"
                            gutterBottom
                        >
                            {t("pages.fantasy.subpages.visualization")}
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                position: "relative",
                                minHeight: "48px",
                            }}
                        >
                            <Box sx={{ width: "200px", position: "relative" }}>
                                <Button
                                    variant="contained"
                                    endIcon={<KeyboardArrowDownIcon />}
                                    onClick={handleClick}
                                    aria-haspopup="true"
                                    aria-expanded={open}
                                    aria-controls={open ? "season-menu" : undefined}
                                    sx={{
                                        backgroundColor: "black",
                                        color: "white",
                                        "&:hover": {
                                            backgroundColor: "black",
                                        },
                                        width: "100%",
                                        border:
                                            theme.palette.mode === "dark"
                                                ? "1px solid rgba(255, 255, 255, 0.23)"
                                                : "none",
                                    }}
                                >
                                    {t("pages.fantasy.season")} {selectedSeason}
                                </Button>
                                {open && (
                                    <Portal>
                                        <Menu
                                            id="season-menu"
                                            anchorEl={anchorEl}
                                            open={open}
                                            onClose={handleClose}
                                            disableScrollLock
                                            aria-label={t("pages.fantasy.selectSeason")}
                                            anchorOrigin={{
                                                vertical: "bottom",
                                                horizontal: "center",
                                            }}
                                            transformOrigin={{
                                                vertical: "top",
                                                horizontal: "center",
                                            }}
                                            sx={{
                                                "& .MuiPaper-root": {
                                                    position: "fixed",
                                                    mt: 1,
                                                    backgroundColor: "background.paper",
                                                    border:
                                                        theme.palette.mode === "dark"
                                                            ? "1px solid rgba(255, 255, 255, 0.12)"
                                                            : "none",
                                                },
                                            }}
                                            PaperProps={{
                                                sx: {
                                                    minWidth: "200px",
                                                },
                                            }}
                                        >
                                            <MenuItem
                                                onClick={() => handleSeasonChange("2025")}
                                                selected={selectedSeason === "2025"}
                                                sx={{
                                                    "&.Mui-selected": {
                                                        backgroundColor: "black",
                                                        color: "white",
                                                        "&:hover": {
                                                            backgroundColor: "black",
                                                        },
                                                    },
                                                }}
                                            >
                                                <Typography variant="body1">2025</Typography>
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => handleSeasonChange("2024")}
                                                selected={selectedSeason === "2024"}
                                                sx={{
                                                    "&.Mui-selected": {
                                                        backgroundColor: "black",
                                                        color: "white",
                                                        "&:hover": {
                                                            backgroundColor: "black",
                                                        },
                                                    },
                                                }}
                                            >
                                                <Typography variant="body1">2024</Typography>
                                            </MenuItem>
                                        </Menu>
                                    </Portal>
                                )}
                            </Box>
                        </Box>
                    </Box>
                    <ErrorBoundary>{renderContent()}</ErrorBoundary>
                </Paper>
            </Box>
        </Container>
    );
} 
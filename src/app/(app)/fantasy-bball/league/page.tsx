"use client";

import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from "@mui/material";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import FantasyBasketballDropdownNav from "@/components/features/fantasy/FantasyBasketballDropdownNav";
import { useEffect, useState } from "react";
import { ESPNLeagueResponse } from "@/types/espn";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import { useTheme } from "@mui/material/styles";
import DropdownComponent from "@/components/shared/DropdownComponent";

/**
 * League Page Component
 *
 * @component
 * @description
 * Displays fantasy basketball league information including team standings, rosters,
 * and player statistics. Allows users to switch between different seasons and view
 * detailed team information.
 *
 * @example
 * ```tsx
 * <LeaguePage />
 * ```
 *
 * @returns {JSX.Element} The league page component
 */
export default function LeaguePage() {
    const { t } = useLanguage();
    const theme = useTheme();
    const [leagueData, setLeagueData] = useState<ESPNLeagueResponse | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const currentYear = new Date().getFullYear().toString();
    const [selectedSeason, setSelectedSeason] = useState(currentYear);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    /**
     * Handles the click event for the season selector button
     * @function handleClick
     * @param {React.MouseEvent<HTMLElement>} event - The click event
     */
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    /**
     * Closes the season selector menu
     * @function handleClose
     */
    const handleClose = () => {
        setAnchorEl(null);
    };

    /**
     * Handles season change and fetches new league data
     * @function handleSeasonChange
     * @param {string} season - The selected season
     */
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

    /**
     * Fetches league data from the ESPN API
     * @async
     * @function fetchLeagueData
     * @returns {Promise<void>}
     */
    const fetchLeagueData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(
                `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${selectedSeason}/segments/0/leagues/449389534?view=mTeam&view=mRoster&view=mSettings`,
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

    /**
     * Renders the main content of the page based on the current state
     * @function renderContent
     * @returns {JSX.Element} The appropriate content based on loading/error state
     */
    const renderContent = () => {
        return (
            <Paper elevation={2} sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        align="center"
                        gutterBottom
                        tabIndex={0}
                    >
                        {leagueData?.settings?.name}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            position: "relative",
                        }}
                    >
                        <DropdownComponent
                            title={t("pages.fantasy.season")}
                            titleLocation="left"
                            items={[
                                {
                                    key: currentYear,
                                    label: currentYear,
                                    value: currentYear,
                                },
                            ]}
                            currentSelected={selectedSeason}
                            onChange={(value) =>
                                handleSeasonChange(value as string)
                            }
                            minWidth={"7em"}
                        />
                    </Box>
                </Box>

                {loading ? (
                    <Typography
                        variant="h6"
                        align="center"
                        color="text.secondary"
                    >
                        {t("pages.fantasy.loading")}
                    </Typography>
                ) : error ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "400px",
                            gap: 2,
                            p: 3,
                        }}
                    >
                        <SentimentVeryDissatisfiedIcon
                            sx={{
                                fontSize: 80,
                                color: "error.main",
                                animation: "shake 0.5s ease-in-out infinite",
                                "@keyframes shake": {
                                    "0%, 100%": { transform: "rotate(0deg)" },
                                    "25%": { transform: "rotate(-10deg)" },
                                    "75%": { transform: "rotate(10deg)" },
                                },
                            }}
                        />
                        <Typography variant="h5" component="h2" align="center">
                            {t("pages.error")}
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            align="center"
                        >
                            {error}
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setError(null);
                                setLoading(true);
                                fetchLeagueData();
                            }}
                            sx={{
                                mt: 2,
                                backgroundColor: "black",
                                color: "white",
                                "&:hover": {
                                    backgroundColor: "black",
                                },
                                border:
                                    theme.palette.mode === "dark"
                                        ? "1px solid rgba(255, 255, 255, 0.23)"
                                        : "none",
                            }}
                        >
                            {t("pages.tryAgain")}
                        </Button>
                    </Box>
                ) : leagueData ? (
                    <Grid container spacing={3}>
                        {leagueData?.teams.map((team) => (
                            <Grid item xs={12} sm={6} md={4} key={team.id}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        transition:
                                            "transform 0.2s, box-shadow 0.2s",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: 6,
                                        },
                                    }}
                                    role="article"
                                    aria-label={`${team.name} ${t("pages.fantasy.team")}`}
                                >
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                mb: 2,
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    width: 56,
                                                    height: 56,
                                                    mr: 2,
                                                    cursor: "pointer",
                                                }}
                                                alt={team.name}
                                                src={`https://a.espncdn.com/i/teamlogos/nba/500/${team.abbrev}.png`}
                                                role="img"
                                                onClick={() => {
                                                    window.location.href = `/fantasy-bball/team/${team.id}`;
                                                }}
                                            />
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    component="h2"
                                                    tabIndex={0}
                                                >
                                                    {team.name}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    tabIndex={0}
                                                >
                                                    {
                                                        team.owners[0]
                                                            ?.displayName
                                                    }
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Chip
                                                label={`${team.record.overall.wins}-${team.record.overall.losses}`}
                                                color="default"
                                                sx={{ mr: 1 }}
                                                aria-label={`${t("pages.fantasy.record")}: ${team.record.overall.wins} ${t("pages.fantasy.wins")}, ${team.record.overall.losses} ${t("pages.fantasy.losses")}`}
                                            />
                                            {team.rankCalculatedFinal && (
                                                <Chip
                                                    label={`${t("pages.fantasy.columns.finalPosition")}: ${team.rankCalculatedFinal}`}
                                                    color={
                                                        team.rankCalculatedFinal ===
                                                        1
                                                            ? "success"
                                                            : team.rankCalculatedFinal <=
                                                                3
                                                              ? "primary"
                                                              : "default"
                                                    }
                                                    sx={{ mr: 1 }}
                                                    aria-label={`${t("pages.fantasy.columns.finalPosition")} ${team.rankCalculatedFinal}`}
                                                />
                                            )}
                                        </Box>

                                        <TableContainer
                                            component={Paper}
                                            variant="outlined"
                                            role="region"
                                            aria-label={`${team.name} ${t("pages.fantasy.roster")}`}
                                        >
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell role="columnheader">
                                                            {t(
                                                                "pages.fantasy.columns.player"
                                                            )}
                                                        </TableCell>
                                                        <TableCell role="columnheader">
                                                            {t(
                                                                "pages.fantasy.columns.position"
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {team.roster.entries.map(
                                                        (entry) => (
                                                            <TableRow
                                                                key={
                                                                    entry
                                                                        .playerPoolEntry
                                                                        .player
                                                                        .id
                                                                }
                                                                role="row"
                                                            >
                                                                <TableCell role="cell">
                                                                    {
                                                                        entry
                                                                            .playerPoolEntry
                                                                            .player
                                                                            .fullName
                                                                    }
                                                                </TableCell>
                                                                <TableCell role="cell">
                                                                    {
                                                                        entry
                                                                            .playerPoolEntry
                                                                            .player
                                                                            .defaultPosition
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                ) : null}
            </Paper>
        );
    };

    // <Paper elevation={2} sx={{ p: 3 }}>

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
                    <FantasyBasketballDropdownNav />
                </Box>
                <ErrorBoundary>{renderContent()}</ErrorBoundary>
            </Box>
        </Container>
    );
}

"use client";

import { Box, Container, Typography, Card, CardContent, Grid, Chip, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Menu, MenuItem, Portal } from "@mui/material";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import FantasyDropdownNav from "@/components/FantasyDropdownNav";
import { useEffect, useState } from "react";
import { ESPNLeagueResponse } from "@/types/espn";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ErrorBoundary from "@/components/features/ErrorBoundary";
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

export default function LeaguePage() {
    const { t } = useLanguage();
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

    useEffect(() => {
        const fetchLeagueData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(
                    `https://lm-api-reads.fantasy.espn.com/apis/v3/games/fba/seasons/${selectedSeason}/segments/0/leagues/449389534?view=mTeam&view=mRoster&view=mSettings`,
                    {
                        headers: {
                            'Accept': 'application/json',
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch league data');
                }

                const data = await response.json();
                setLeagueData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
                setLeagueData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchLeagueData();
    }, [selectedSeason]);

    const renderContent = () => {
        if (loading) {
            return (
                <Typography variant="h6" align="center" color="text.secondary">
                    {t("pages.loading")}
                </Typography>
            );
        }

        if (error) {
            return (
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
                                "75%": { transform: "rotate(10deg)" }
                            }
                        }} 
                    />
                    <Typography variant="h5" component="h2" align="center">
                        {t("pages.error")}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center">
                        {error}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.location.reload()}
                        sx={{ mt: 2 }}
                    >
                        {t("pages.tryAgain")}
                    </Button>
                </Box>
            );
        }

        if (!leagueData) {
            return null;
        }

        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" align="center" gutterBottom>
                        {leagueData?.settings?.name || t("pages.fantasy.league")}
                    </Typography>
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            width: '100%',
                            position: 'relative',
                            minHeight: '48px'
                        }}
                    >
                        <Box sx={{ width: '200px', position: 'relative' }}>
                            <Button
                                variant="contained"
                                endIcon={<KeyboardArrowDownIcon />}
                                onClick={handleClick}
                                sx={{
                                    backgroundColor: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    },
                                    width: '100%',
                                }}
                            >
                                Season {selectedSeason}
                            </Button>
                            {open && (
                                <Portal>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        disableScrollLock
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'center',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'center',
                                        }}
                                        sx={{
                                            '& .MuiPaper-root': {
                                                position: 'fixed',
                                                mt: 1,
                                            }
                                        }}
                                        PaperProps={{
                                            sx: {
                                                minWidth: '200px',
                                            }
                                        }}
                                    >
                                        <MenuItem
                                            onClick={() => handleSeasonChange("2025")}
                                            selected={selectedSeason === "2025"}
                                            sx={{
                                                '&.Mui-selected': {
                                                    backgroundColor: 'primary.light',
                                                    '&:hover': {
                                                        backgroundColor: 'primary.light',
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
                                                '&.Mui-selected': {
                                                    backgroundColor: 'primary.light',
                                                    '&:hover': {
                                                        backgroundColor: 'primary.light',
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
                <Grid container spacing={3}>
                    {leagueData?.teams.map((team) => (
                        <Grid item xs={12} sm={6} md={4} key={team.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar
                                            sx={{ width: 56, height: 56, mr: 2 }}
                                            alt={team.name}
                                            src={`https://a.espncdn.com/i/teamlogos/nba/500/${team.abbrev}.png`}
                                        />
                                        <Box>
                                            <Typography variant="h6" component="h2">
                                                {team.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {team.owners[0]?.displayName}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Chip
                                            label={`${team.record.overall.wins}-${team.record.overall.losses}`}
                                            color="primary"
                                            sx={{ mr: 1 }}
                                        />
                                        <Chip
                                            label={`Rank: ${team.rank}`}
                                            color="secondary"
                                        />
                                    </Box>

                                    <TableContainer component={Paper} variant="outlined">
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Player</TableCell>
                                                    <TableCell>Position</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {team.roster.entries.map((entry) => (
                                                    <TableRow key={entry.playerPoolEntry.player.id}>
                                                        <TableCell>
                                                            {entry.playerPoolEntry.player.fullName}
                                                        </TableCell>
                                                        <TableCell>
                                                            {entry.playerPoolEntry.player.defaultPosition}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
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
                    <FantasyDropdownNav />
                </Box>
                <ErrorBoundary>
                    {renderContent()}
                </ErrorBoundary>
            </Box>
        </Container>
    );
} 
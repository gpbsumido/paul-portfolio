"use client";

import React, { Suspense, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Container,
} from "@mui/material";
import FantasyBasketballDropdownNav from "@/components/features/fantasy/FantasyBasketballDropdownNav";
import { useTheme } from "@mui/material/styles";
import { getHistoricalLeagueInfo } from "@/lib/espnService";
import HistoryError from "./HistoryError";
import DropdownComponent from "@/components/shared/DropdownComponent";
import { useLanguage } from "@/contexts/LanguageContext";

interface HistoryPageProps {
    params: {
        year: string;
    };
}

async function HistoryContent({ year }: { year: string }) {
    const { t } = useLanguage();
    const theme = useTheme();
    const [selectedSeason, setSelectedSeason] = useState("2025");
    let data;

    try {
        data = await getHistoricalLeagueInfo(year);
    } catch (error) {
        console.error("Failed to fetch historical league info:", error);
        return <HistoryError year={year} />;
    }

    const handleSeasonChange = (season: string) => {
        setSelectedSeason(season);
    };

    return (
        <Card
            sx={{
                backgroundColor: "background.paper",
                boxShadow: 3,
                borderRadius: 2,
                p: { xs: 2, md: 3 },
                mt: 4,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    position: "relative",
                    minHeight: "40px",
                }}
            >
                <DropdownComponent
                    items={[
                        {
                            key: "2025",
                            label: "2025",
                            value: "2025",
                        },
                    ]}
                    currentSelected={selectedSeason}
                    onChange={(value) => handleSeasonChange(value as string)}
                    title={t("pages.fantasy.season")}
                    titleLocation="left"
                />
            </Box>
            <CardContent>
                <Typography
                    variant="h5"
                    component="h2"
                    gutterBottom
                    sx={{
                        fontWeight: "medium",
                        color:
                            theme.palette.mode === "dark"
                                ? "grey.300"
                                : "text.secondary",
                    }}
                >
                    Final Standings
                </Typography>
                <TableContainer
                    component={Paper}
                    sx={{
                        mt: 2,
                        borderRadius: 2,
                        boxShadow: 2,
                        overflow: "auto",
                    }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow
                                sx={{
                                    backgroundColor:
                                        theme.palette.mode === "dark"
                                            ? "grey.800"
                                            : "grey.200",
                                }}
                            >
                                <TableCell
                                    sx={{
                                        fontWeight: "bold",
                                        color: "inherit",
                                    }}
                                >
                                    Rank
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: "bold",
                                        color: "inherit",
                                    }}
                                >
                                    Team
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: "bold",
                                        color: "inherit",
                                    }}
                                >
                                    Owner
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: "bold",
                                        color: "inherit",
                                    }}
                                >
                                    Record
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: "bold",
                                        color: "inherit",
                                    }}
                                >
                                    Points For
                                </TableCell>
                                <TableCell
                                    sx={{
                                        fontWeight: "bold",
                                        color: "inherit",
                                    }}
                                >
                                    Points Against
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.teams
                                .sort((a: any, b: any) => {
                                    const aWins = a.record.overall.wins;
                                    const bWins = b.record.overall.wins;
                                    const aPointsFor =
                                        a.record.overall.pointsFor;
                                    const bPointsFor =
                                        b.record.overall.pointsFor;

                                    if (aWins === bWins) {
                                        return bPointsFor - aPointsFor;
                                    }
                                    return bWins - aWins;
                                })
                                .map(
                                    (team: {
                                        id: number;
                                        rank: number;
                                        name: string;
                                        owners: {
                                            displayName: string;
                                        }[];
                                        record: {
                                            overall: {
                                                wins: number;
                                                losses: number;
                                                pointsFor: number;
                                                pointsAgainst: number;
                                            };
                                        };
                                    }) => (
                                        <TableRow key={team.id}>
                                            <TableCell>{team.rank}</TableCell>
                                            <TableCell>{team.name}</TableCell>
                                            <TableCell>
                                                {team.owners[0].displayName}
                                            </TableCell>
                                            <TableCell>
                                                {team.record.overall.wins}-
                                                {team.record.overall.losses}
                                            </TableCell>
                                            <TableCell>
                                                {team.record.overall.pointsFor}
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    team.record.overall
                                                        .pointsAgainst
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
    );
}

export default function HistoryPage({ params }: HistoryPageProps) {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Suspense
                fallback={
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "100vh",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                }
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
                <HistoryContent year={params.year} />
            </Suspense>
        </Container>
    );
}

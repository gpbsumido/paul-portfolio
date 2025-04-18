import { getHistoricalLeagueInfo } from "@/lib/espnService";
import { Suspense } from "react";
import HistoryError from "./HistoryError";
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Card,
    CardContent,
} from "@mui/material";

interface HistoryPageProps {
    params: {
        year: string;
    };
}

async function HistoryContent({ year }: { year: string }) {
    let data;
    try {
        data = await getHistoricalLeagueInfo(year);
    } catch (error) {
        console.error("Failed to fetch historical league info:", error);
        return <HistoryError year={year} />;
    }

    return (
        <Box sx={{ px: 4, py: 6 }}>
            <Typography
                variant="h3"
                component="h1"
                align="center"
                gutterBottom
                sx={{ fontWeight: "bold" }}
            >
                League History - {year}
            </Typography>

            <Card
                sx={{
                    backgroundColor: "background.paper",
                    boxShadow: 3,
                    borderRadius: 2,
                    p: 3,
                    mt: 4,
                }}
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        component="h2"
                        gutterBottom
                        sx={{ fontWeight: "medium" }}
                    >
                        Final Standings
                    </Typography>
                    <TableContainer
                        component={Paper}
                        sx={{
                            mt: 2,
                            borderRadius: 2,
                            boxShadow: 2,
                            overflow: "hidden",
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "grey.200" }}>
                                    <TableCell>Rank</TableCell>
                                    <TableCell>Team</TableCell>
                                    <TableCell>Owner</TableCell>
                                    <TableCell>Record</TableCell>
                                    <TableCell>Points For</TableCell>
                                    <TableCell>Points Against</TableCell>
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
                                                <TableCell>
                                                    {team.rank}
                                                </TableCell>
                                                <TableCell>
                                                    {team.name}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        team.owners[0]
                                                            .displayName
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {team.record.overall.wins}-
                                                    {team.record.overall.losses}
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        team.record.overall
                                                            .pointsFor
                                                    }
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
        </Box>
    );
}

export default function HistoryPage({ params }: HistoryPageProps) {
    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
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
                <HistoryContent year={params.year} />
            </Suspense>
        </Box>
    );
}

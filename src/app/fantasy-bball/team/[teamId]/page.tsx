"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { getTeamInfo } from "@/lib/espnService";
import { ESPNRosterEntry } from "@/types/espn";
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
    Container,
    Button,
} from "@mui/material";

interface TeamProps {
    params: {
        teamId: string;
    };
}

export default async function TeamPage({ params }: TeamProps) {
    const { t } = useLanguage();
    const data = await getTeamInfo(params.teamId);
    const team = data.teams[0];

    function getPositionName(positionId: string): string {
        const positionMap: { [key: string]: string } = {
            "5": "Center",
            "4": "Power Forward",
            "3": "Small Forward",
            "2": "Shooting Guard",
            "1": "Point Guard",
        };
        return positionMap[positionId] || "Unknown Position";
    }

    function getOwnerName(ownerId: string): string {
        const team = data.teams.find(
            (owner: { id: string }) =>
                owner.id.toString() === ownerId.toString()
        );
        const foundOwnerEspnId = team?.owners[0];
        const ownerData = data.members.find(
            (owner: { id: string }) => owner.id === foundOwnerEspnId
        );
        return ownerData ? ownerData.displayName : "Unknown Owner";
    }

    return (
        <Container
            maxWidth="lg"
            sx={{
                py: 4,
                height: "100vh", // Full viewport height
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    borderRadius: 2,
                    flex: "1 1 auto", // Allow the paper to grow and shrink
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden", // Prevent content overflow
                }}
            >
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {team.name}
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Team Information
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                    >
                        Owner: {getOwnerName(params.teamId)}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Record: {team.record.overall.wins}-
                        {team.record.overall.losses}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        flex: "1 1 auto", // Allow the roster section to grow and shrink
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden", // Prevent content overflow
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "space-between",
                            mb: 2,
                        }}
                    >
                        <Typography
                            sx={{ margin: "auto 0 0 0" }}
                            variant="h5"
                            fontWeight="bold"
                            gutterBottom
                        >
                            Roster
                        </Typography>
                        <Box>
                            <Button
                                onClick={() => {
                                    window.location.href =
                                        "/fantasy-bball/league";
                                }}
                                style={{
                                    backgroundColor: "#1976d2",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    background: "primary",
                                }}
                            >
                                Back
                            </Button>
                        </Box>
                    </Box>
                    <TableContainer
                        sx={{
                            flex: "1 1 auto", // Allow the table to grow and shrink
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: 2,
                            boxShadow: 1,
                            backgroundColor: "background.paper",
                            overflowY: "auto", // Enable vertical scrolling
                        }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography
                                            variant="subtitle2"
                                            color="text.secondary"
                                            fontWeight="bold"
                                        >
                                            Player
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="subtitle2"
                                            color="text.secondary"
                                            fontWeight="bold"
                                        >
                                            Position
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="subtitle2"
                                            color="text.secondary"
                                            fontWeight="bold"
                                        >
                                            Status
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {team.roster.entries.map(
                                    (entry: ESPNRosterEntry) => (
                                        <TableRow key={entry.playerId}>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    fontWeight="medium"
                                                >
                                                    {
                                                        entry.playerPoolEntry
                                                            .player.fullName
                                                    }
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {getPositionName(
                                                        entry.playerPoolEntry
                                                            .player
                                                            .defaultPositionId
                                                    )}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {entry.playerPoolEntry
                                                        .player.injuryStatus ||
                                                        "Active"}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Paper>
        </Container>
    );
}

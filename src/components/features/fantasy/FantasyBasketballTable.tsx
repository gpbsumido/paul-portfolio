"use client";
import { Player, PlayerStatsMap } from "@/types/nba";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
    useMediaQuery,
    Box,
    Avatar,
    CircularProgress,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo } from "react";

interface FantasyBasketballTableProps {
    players: Player[];
    playerStatsMap: PlayerStatsMap;
    onSort: (column: string) => void;
    sortConfig: {
        column: string;
        direction: "asc" | "desc";
    };
    isLoading?: boolean;
    error?: Error | null;
}

const COLUMNS = [
    { id: "name", label: "pages.fantasy.columns.player", width: "20%" },
    { id: "position", label: "pages.fantasy.columns.position", width: "10%" },
    { id: "games_played", label: "pages.fantasy.columns.games", width: "10%" },
    { id: "pts", label: "pages.fantasy.columns.points", width: "10%" },
    { id: "reb", label: "pages.fantasy.columns.rebounds", width: "10%" },
    { id: "ast", label: "pages.fantasy.columns.assists", width: "10%" },
    { id: "stl", label: "pages.fantasy.columns.steals", width: "10%" },
    { id: "blk", label: "pages.fantasy.columns.blocks", width: "10%" },
    {
        id: "fantasyPoints",
        label: "pages.fantasy.columns.fantasyPoints",
        width: "10%",
    },
] as const;

const MOBILE_COLUMNS = [
    { id: "name", label: "pages.fantasy.columns.player", width: "25%" },
    { id: "position", label: "pages.fantasy.columns.position", width: "10%" },
    { id: "games_played", label: "pages.fantasy.columns.games", width: "10%" },
    { id: "pts", label: "pages.fantasy.columns.points", width: "15%" },
    { id: "reb", label: "pages.fantasy.columns.rebounds", width: "15%" },
    { id: "ast", label: "pages.fantasy.columns.assists", width: "15%" },
    {
        id: "fantasyPoints",
        label: "pages.fantasy.columns.fantasyPoints",
        width: "10%",
    },
] as const;

export default function FantasyBasketballTable({
    players,
    playerStatsMap,
    onSort,
    sortConfig,
    isLoading = false,
    error = null,
}: FantasyBasketballTableProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { t } = useLanguage();

    const handleKeyDown = (e: React.KeyboardEvent, column: string) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSort(column);
        }
    };

    const displayColumns = useMemo(() => {
        const columns = isMobile ? MOBILE_COLUMNS : COLUMNS;
        return columns.map((column) => ({
            ...column,
            label: t(column.label),
        }));
    }, [isMobile, t]);

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
                role="status"
                aria-label={t("pages.fantasy.loading")}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
                role="alert"
                aria-label={t("pages.error")}
            >
                <Typography color="error">
                    {error.message || t("pages.error")}
                </Typography>
            </Box>
        );
    }

    if (!players.length) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
                role="status"
                aria-label={t("pages.fantasy.noPlayers")}
            >
                <Typography color="text.secondary">
                    {t("pages.fantasy.noPlayers")}
                </Typography>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
            role="region"
            aria-label={t("pages.fantasy.playerStats")}
        >
            <TableContainer
                component={Paper}
                elevation={2}
                sx={{
                    flex: 1,
                    borderRadius: 2,
                    overflow: "auto",
                    backgroundColor: theme.palette.background.paper,
                    maxHeight: "calc(100vh - 25em)",
                    "&::-webkit-scrollbar": {
                        width: 8,
                        height: 8,
                    },
                    "&::-webkit-scrollbar-track": {
                        backgroundColor:
                            theme.palette.mode === "dark"
                                ? theme.palette.grey[900]
                                : theme.palette.grey[100],
                        borderRadius: 4,
                    },
                    "&::-webkit-scrollbar-thumb": {
                        backgroundColor:
                            theme.palette.mode === "dark"
                                ? theme.palette.grey[700]
                                : theme.palette.grey[400],
                        borderRadius: 4,
                        "&:hover": {
                            backgroundColor:
                                theme.palette.mode === "dark"
                                    ? theme.palette.grey[600]
                                    : theme.palette.grey[500],
                        },
                    },
                }}
            >
                <Table
                    stickyHeader
                    sx={{
                        minWidth: isMobile ? 600 : 800,
                        backgroundColor: theme.palette.background.paper,
                    }}
                    role="grid"
                    aria-label={t("pages.fantasy.playerStatsTable")}
                >
                    <TableHead>
                        <TableRow role="row">
                            {displayColumns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    onClick={() => onSort(column.id)}
                                    onKeyDown={(e) =>
                                        handleKeyDown(e, column.id)
                                    }
                                    tabIndex={0}
                                    role="columnheader"
                                    scope="col"
                                    aria-sort={
                                        sortConfig.column === column.id
                                            ? sortConfig.direction === "asc"
                                                ? "ascending"
                                                : "descending"
                                            : "none"
                                    }
                                    aria-label={`${column.label}, ${
                                        sortConfig.column === column.id
                                            ? t(
                                                  `pages.fantasy.sort.${sortConfig.direction}`
                                              )
                                            : t("pages.fantasy.sort.none")
                                    }`}
                                    sx={{
                                        width: column.width,
                                        cursor: "pointer",
                                        backgroundColor:
                                            theme.palette.mode === "dark"
                                                ? theme.palette.grey[900]
                                                : theme.palette.grey[50],
                                        "&:hover": {
                                            backgroundColor:
                                                theme.palette.mode === "dark"
                                                    ? theme.palette.grey[800]
                                                    : theme.palette.grey[100],
                                            boxShadow:
                                                theme.palette.mode === "dark"
                                                    ? "0 0 8px rgba(255, 255, 255, 0.1)"
                                                    : "0 0 8px rgba(0, 0, 0, 0.1)",
                                        },
                                        transition: "background-color 0.2s",
                                        borderColor: theme.palette.divider,
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                            justifyContent:
                                                column.id === "name"
                                                    ? "flex-start"
                                                    : "center",
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                fontWeight: 600,
                                                color:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? theme.palette.text
                                                              .primary
                                                        : theme.palette.text
                                                              .secondary,
                                            }}
                                        >
                                            {column.label}
                                        </Typography>
                                        {sortConfig.column === column.id && (
                                            <Box
                                                component="span"
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {sortConfig.direction ===
                                                "asc" ? (
                                                    <ArrowUpwardIcon fontSize="small" />
                                                ) : (
                                                    <ArrowDownwardIcon fontSize="small" />
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {players.map((player) => {
                            const stats = playerStatsMap[player.id] || {};
                            return (
                                <TableRow
                                    key={player.id}
                                    role="row"
                                    sx={{
                                        "&:hover": {
                                            backgroundColor:
                                                theme.palette.mode === "dark"
                                                    ? theme.palette.grey[800]
                                                    : theme.palette.grey[100],
                                        },
                                    }}
                                >
                                    {displayColumns.map((column) => (
                                        <TableCell
                                            key={`${player.id}-${column.id}`}
                                            role="cell"
                                            sx={{
                                                borderColor:
                                                    theme.palette.divider,
                                            }}
                                        >
                                            {column.id === "name" ? (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1,
                                                    }}
                                                >
                                                    <Avatar
                                                        src={`https://cdn.nba.com/headshots/nba/latest/260x190/${player.id}.png`}
                                                        alt={player.first_name}
                                                        sx={{
                                                            width: 32,
                                                            height: 32,
                                                        }}
                                                    />
                                                    <Typography>
                                                        {player.first_name}{" "}
                                                        {player.last_name}
                                                    </Typography>
                                                </Box>
                                            ) : column.id === "position" ? (
                                                <Typography>
                                                    {player.position || "N/A"}
                                                </Typography>
                                            ) : column.id ===
                                              "fantasyPoints" ? (
                                                <Typography>
                                                    {stats[
                                                        "fantasy_points"
                                                    ].toFixed(1)}
                                                </Typography>
                                            ) : column.id === "games_played" ? (
                                                <Typography>
                                                    {stats["games_played"] ||
                                                        "0"}
                                                </Typography>
                                            ) : (
                                                <Typography>
                                                    {Number(
                                                        stats[
                                                            column.id as keyof typeof stats
                                                        ]
                                                    )?.toFixed(1) || "0.0"}
                                                </Typography>
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

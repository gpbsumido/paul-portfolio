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
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useLanguage } from "@/contexts/LanguageContext";

interface FantasyBasketballTableProps {
    players: Player[];
    playerStatsMap: PlayerStatsMap;
    onSort: (column: string) => void;
    sortConfig: {
        column: string;
        direction: "asc" | "desc";
    };
}

export default function FantasyBasketballTable({
    players,
    playerStatsMap,
    onSort,
    sortConfig,
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

    const columns = [
        { id: "name", label: t("pages.fantasy.columns.player"), width: "25%" },
        {
            id: "position",
            label: t("pages.fantasy.columns.position"),
            width: "10%",
        },
        {
            id: "points",
            label: t("pages.fantasy.columns.points"),
            width: "15%",
        },
        {
            id: "rebounds",
            label: t("pages.fantasy.columns.rebounds"),
            width: "10%",
        },
        {
            id: "assists",
            label: t("pages.fantasy.columns.assists"),
            width: "10%",
        },
        {
            id: "steals",
            label: t("pages.fantasy.columns.steals"),
            width: "10%",
        },
        {
            id: "blocks",
            label: t("pages.fantasy.columns.blocks"),
            width: "10%",
        },
        {
            id: "fantasyPoints",
            label: t("pages.fantasy.columns.fantasyPoints"),
            width: "15%",
        },
    ];

    const mobileColumns = [
        { id: "name", label: t("pages.fantasy.columns.player"), width: "30%" },
        {
            id: "position",
            label: t("pages.fantasy.columns.position"),
            width: "10%",
        },
        {
            id: "points",
            label: t("pages.fantasy.columns.points"),
            width: "15%",
        },
        {
            id: "rebounds",
            label: t("pages.fantasy.columns.rebounds"),
            width: "15%",
        },
        {
            id: "assists",
            label: t("pages.fantasy.columns.assists"),
            width: "15%",
        },
        {
            id: "fantasyPoints",
            label: t("pages.fantasy.columns.fantasyPoints"),
            width: "15%",
        },
    ];

    const displayColumns = isMobile ? mobileColumns : columns;

    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <TableContainer
                component={Paper}
                elevation={2}
                sx={{
                    flex: 1,
                    borderRadius: 2,
                    overflow: "auto",
                    backgroundColor: theme.palette.background.paper,
                    maxHeight: "calc(100vh - 25em)", // Adjust this value based on your layout
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
                >
                    <TableHead>
                        <TableRow>
                            {displayColumns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    onClick={() => onSort(column.id)}
                                    onKeyDown={(e) =>
                                        handleKeyDown(e, column.id)
                                    }
                                    tabIndex={0}
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
                                                color: theme.palette.text
                                                    .secondary,
                                            }}
                                        >
                                            {column.label}
                                        </Typography>
                                        {sortConfig?.column === column.id &&
                                            (sortConfig.direction === "asc" ? (
                                                <ArrowUpwardIcon
                                                    sx={{
                                                        fontSize: 16,
                                                        color: theme.palette
                                                            .primary.main,
                                                    }}
                                                />
                                            ) : (
                                                <ArrowDownwardIcon
                                                    sx={{
                                                        fontSize: 16,
                                                        color: theme.palette
                                                            .primary.main,
                                                    }}
                                                />
                                            ))}
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {players.map((player) => {
                            const stats = playerStatsMap[player.id];
                            const fantasyPoints = stats
                                ? stats.pts +
                                  stats.reb * 1.2 +
                                  stats.ast * 1.5 +
                                  stats.stl * 3 +
                                  stats.blk * 3
                                : 0;

                            return (
                                <TableRow
                                    key={player.id}
                                    sx={{
                                        backgroundColor:
                                            theme.palette.background.paper,
                                        "&:hover": {
                                            "& td": {
                                                paddingTop: "24px",
                                                paddingBottom: "24px",
                                                backgroundColor:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? theme.palette
                                                              .grey[800]
                                                        : theme.palette
                                                              .grey[100],
                                                boxShadow:
                                                    theme.palette.mode ===
                                                    "dark"
                                                        ? "0 4px 8px rgba(0, 0, 0, 0.3)"
                                                        : "0 4px 8px rgba(0, 0, 0, 0.1)",
                                                "& .MuiTypography-root": {
                                                    fontWeight: 600,
                                                },
                                            },
                                        },
                                    }}
                                >
                                    {displayColumns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            sx={{
                                                color: theme.palette.text
                                                    .primary,
                                                borderColor:
                                                    theme.palette.divider,
                                                backgroundColor:
                                                    theme.palette.background
                                                        .paper,
                                            }}
                                        >
                                            {column.id === "name" && (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 2,
                                                    }}
                                                >
                                                    <Avatar
                                                        src={`https://cdn.nba.com/headshots/nba/latest/260x190/${player.id}.png`}
                                                        alt={`${player.first_name} ${player.last_name}`}
                                                        sx={{
                                                            width: 40,
                                                            height: 40,
                                                        }}
                                                    />
                                                    <Box>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            {`${player.first_name} ${player.last_name}`}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            )}
                                            {column.id === "position" && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{ textAlign: "center" }}
                                                >
                                                    {player.position || "N/A"}
                                                </Typography>
                                            )}
                                            {column.id === "points" && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{ textAlign: "center" }}
                                                >
                                                    {stats?.pts?.toFixed(1) ||
                                                        "0.0"}
                                                </Typography>
                                            )}
                                            {column.id === "rebounds" && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{ textAlign: "center" }}
                                                >
                                                    {stats?.reb?.toFixed(1) ||
                                                        "0.0"}
                                                </Typography>
                                            )}
                                            {column.id === "assists" && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{ textAlign: "center" }}
                                                >
                                                    {stats?.ast?.toFixed(1) ||
                                                        "0.0"}
                                                </Typography>
                                            )}
                                            {column.id === "steals" && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{ textAlign: "center" }}
                                                >
                                                    {stats?.stl?.toFixed(1) ||
                                                        "0.0"}
                                                </Typography>
                                            )}
                                            {column.id === "blocks" && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{ textAlign: "center" }}
                                                >
                                                    {stats?.blk?.toFixed(1) ||
                                                        "0.0"}
                                                </Typography>
                                            )}
                                            {column.id === "fantasyPoints" && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: theme.palette
                                                            .primary.main,
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    {fantasyPoints.toFixed(1)}
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

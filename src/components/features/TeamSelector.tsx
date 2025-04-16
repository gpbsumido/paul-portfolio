"use client";

import { Team } from "@/types/nba";
import { Autocomplete, TextField, useTheme } from "@mui/material";

interface TeamSelectorProps {
    teams: Team[];
    selectedTeam: Team | null;
    onTeamChange: (team: Team | null) => void;
}

export default function TeamSelector({
    teams,
    selectedTeam,
    onTeamChange,
}: TeamSelectorProps) {
    const theme = useTheme();

    return (
        <Autocomplete
            value={selectedTeam}
            onChange={(_, newValue) => onTeamChange(newValue)}
            options={teams}
            getOptionLabel={(option) => option.full_name}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            backgroundColor:
                                theme.palette.mode === "dark"
                                    ? "rgba(255, 255, 255, 0.05)"
                                    : "white",
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: theme.palette.primary.main,
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: theme.palette.primary.main,
                            },
                        },
                        "& .MuiInputLabel-root": {
                            color:
                                theme.palette.mode === "dark"
                                    ? "rgba(255, 255, 255, 0.7)"
                                    : "rgba(0, 0, 0, 0.6)",
                        },
                    }}
                />
            )}
            sx={{
                width: "100%",
                "& .MuiAutocomplete-listbox": {
                    backgroundColor:
                        theme.palette.mode === "dark"
                            ? "rgba(0, 0, 0, 0.8)"
                            : "white",
                    "& .MuiAutocomplete-option": {
                        "&:hover": {
                            backgroundColor:
                                theme.palette.mode === "dark"
                                    ? "rgba(255, 255, 255, 0.1)"
                                    : "rgba(0, 0, 0, 0.04)",
                        },
                        "&[aria-selected='true']": {
                            backgroundColor:
                                theme.palette.mode === "dark"
                                    ? "rgba(255, 255, 255, 0.2)"
                                    : "rgba(0, 0, 0, 0.08)",
                        },
                    },
                },
            }}
        />
    );
}

"use client";

import { Team } from "@/types/nba";
import { Autocomplete, TextField, useTheme, Typography } from "@mui/material";
import { useLanguage } from "@/contexts/LanguageContext";

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
    const { t } = useLanguage();
    const theme = useTheme();

    return (
        <Autocomplete
            value={selectedTeam}
            onChange={(_, newValue) => onTeamChange(newValue)}
            options={teams}
            getOptionLabel={(option) => option.full_name}
            aria-label={t("pages.fantasy.selectTeam")}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="outlined"
                    placeholder={t("pages.fantasy.searchTeams")}
                    aria-label={t("pages.fantasy.searchTeams")}
                    sx={{
                        "& .MuiOutlinedInput-root": {
                            backgroundColor:
                                theme.palette.mode === "dark"
                                    ? "rgba(255, 255, 255, 0.08)"
                                    : "white",
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: theme.palette.primary.main,
                                borderWidth: "2px",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: theme.palette.primary.main,
                                borderWidth: "2px",
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                    theme.palette.mode === "dark"
                                        ? "rgba(255, 255, 255, 0.23)"
                                        : "rgba(0, 0, 0, 0.23)",
                                borderWidth: "1px",
                            },
                        },
                        "& .MuiInputLabel-root": {
                            color:
                                theme.palette.mode === "dark"
                                    ? theme.palette.text.primary
                                    : "rgba(0, 0, 0, 0.6)",
                        },
                        "& .MuiOutlinedInput-input": {
                            color: theme.palette.text.primary,
                        },
                    }}
                />
            )}
            renderOption={(props, option) => (
                <li {...props} role="option" aria-label={option.full_name}>
                    <Typography variant="body1">{option.full_name}</Typography>
                </li>
            )}
            sx={{
                width: "100%",
                "& .MuiAutocomplete-listbox": {
                    backgroundColor:
                        theme.palette.mode === "dark"
                            ? theme.palette.grey[900]
                            : "white",
                    "& .MuiAutocomplete-option": {
                        color: theme.palette.text.primary,
                        "&:hover": {
                            backgroundColor:
                                theme.palette.mode === "dark"
                                    ? "rgba(255, 255, 255, 0.15)"
                                    : "rgba(0, 0, 0, 0.04)",
                        },
                        "&[aria-selected='true']": {
                            backgroundColor:
                                theme.palette.mode === "dark"
                                    ? "rgba(255, 255, 255, 0.25)"
                                    : "rgba(0, 0, 0, 0.08)",
                        },
                    },
                },
                "& .MuiAutocomplete-paper": {
                    backgroundColor:
                        theme.palette.mode === "dark"
                            ? theme.palette.grey[900]
                            : "white",
                    boxShadow:
                        theme.palette.mode === "dark"
                            ? "0 4px 20px rgba(0, 0, 0, 0.5)"
                            : "0 4px 20px rgba(0, 0, 0, 0.1)",
                },
            }}
            ListboxProps={{
                "aria-label": t("pages.fantasy.teamsList"),
            }}
        />
    );
}

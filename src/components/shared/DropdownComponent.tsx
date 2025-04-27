"use client";

import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
    Box,
    Button,
    Menu,
    MenuItem,
    Typography,
    Portal,
    useTheme,
} from "@mui/material";
import { DropdownComponentProps } from "@/types/common";

export default function DropdownComponent({
    items,
    currentSelected,
    startIcon,
    buttonStyles,
    onChange,
    minWidth = '15em',
    title,
    titleLocation = "above",
}: DropdownComponentProps) {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleItemClick = (value: any) => {
        handleClose();
        onChange?.(value);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: titleLocation === "left" ? "row" : "column",
                alignItems: titleLocation === "left" ? "center" : "flex-start",
                gap: titleLocation === "left" ? 2 : 0,
            }}
        >
            {title && (
                <Typography
                    variant="subtitle1"
                    sx={{
                        marginBottom: titleLocation === "above" ? 1 : 0,
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        color: theme.palette.text.primary,
                    }}
                >
                    {title}
                </Typography>
            )}
            <Button
                variant="contained"
                startIcon={startIcon}
                onClick={handleClick}
                aria-haspopup="true"
                aria-expanded={open}
                aria-controls={open ? "dropdown-menu" : undefined}
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: theme.palette.mode === "dark" ? "black" : theme.palette.grey[200],
                    color: theme.palette.mode === "dark" ? "white" : "black",
                    "&:hover": {
                        backgroundColor: theme.palette.mode === "dark" ? "black" : theme.palette.grey[300],
                    },
                    border:
                        theme.palette.mode === "dark"
                            ? "1px solid rgba(255, 255, 255, 0.23)"
                            : "1px solid rgba(0, 0, 0, 0.23)",
                    minWidth: minWidth,
                    ...buttonStyles,
                }}
            >
                <Box sx={{ flexGrow: 1, textAlign: "left" }}>
                    {items.find((item) => item.key === currentSelected)?.label || "Select"}
                </Box>
                <KeyboardArrowDownIcon />
            </Button>
            {open && (
                <Portal>
                    <Menu
                        id="dropdown-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        disableScrollLock
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "left",
                        }}
                        sx={{
                            "& .MuiPaper-root": {
                                position: "fixed",
                                mt: 1,
                                minWidth: anchorEl ? anchorEl.offsetWidth : minWidth,
                                backgroundColor: theme.palette.background.paper,
                                border:
                                    theme.palette.mode === "dark"
                                        ? "1px solid rgba(255, 255, 255, 0.12)"
                                        : "1px solid rgba(0, 0, 0, 0.12)",
                            },
                        }}
                    >
                        {items.map((item) => (
                            <MenuItem
                                key={item.key}
                                onClick={() => handleItemClick(item.value)}
                                sx={{
                                    "&.Mui-selected": {
                                        backgroundColor: theme.palette.mode === "dark" ? "black" : theme.palette.grey[300],
                                        color: theme.palette.mode === "dark" ? "white" : "black",
                                        "&:hover": {
                                            backgroundColor: theme.palette.mode === "dark" ? "black" : theme.palette.grey[400],
                                        },
                                    },
                                }}
                            >
                                <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                                    {item.label}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Portal>
            )}
        </Box>
    );
}
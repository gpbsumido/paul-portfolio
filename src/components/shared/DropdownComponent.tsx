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
    titleLocation = "above", // New prop with default value
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
                    backgroundColor: "black",
                    color: "white",
                    "&:hover": {
                        backgroundColor: "black",
                    },
                    border:
                        theme.palette.mode === "dark"
                            ? "1px solid rgba(255, 255, 255, 0.23)"
                            : "none",
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
                                minWidth: anchorEl ? anchorEl.offsetWidth : minWidth, // Match Button's width
                                backgroundColor: "background.paper",
                                border:
                                    theme.palette.mode === "dark"
                                        ? "1px solid rgba(255, 255, 255, 0.12)"
                                        : "none",
                            },
                        }}
                    >
                        {items.map((item) => (
                            <MenuItem
                                key={item.key}
                                onClick={() => handleItemClick(item.value)}
                                sx={{
                                    "&.Mui-selected": {
                                        backgroundColor: "black",
                                        color: "white",
                                        "&:hover": {
                                            backgroundColor: "black",
                                        },
                                    },
                                }}
                            >
                                <Typography variant="body2">{item.label}</Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Portal>
            )}
        </Box>
    );
}
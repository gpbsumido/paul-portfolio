"use client";

import { useState } from "react";
import {
    Box,
    Button,
    Menu,
    MenuItem,
    Typography,
    Portal,
    useTheme,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useLanguage } from "@/contexts/LanguageContext";

const subpages = [
    {
        key: "drivers",
        href: "/fantasy-f1/drivers",
    },
    {
        key: "constructors",
        href: "/fantasy-f1/constructors",
    },
    {
        key: "schedule",
        href: "/fantasy-f1/schedule",
    },
    {
        key: "qualifying",
        href: `/fantasy-f1/qualifying`,
    },
    {
        key: "fantasy-scoring",
        href: `/fantasy-f1/fantasy-scoring`,
    },
];

/**
 * Fantasy Dropdown Navigation Component
 *
 * @component
 * @description
 * A navigation component that displays a dropdown menu for fantasy basketball subpages.
 * Shows the current page and allows users to navigate between different fantasy basketball sections.
 *
 * @example
 * ```tsx
 * <FantasyDropdownNav />
 * ```
 *
 * @returns {JSX.Element} The fantasy dropdown navigation component
 */
export default function FantasyDropdownNav() {
    const { t } = useLanguage();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const pathname = usePathname();
    const open = Boolean(anchorEl);

    /**
     * Handles the click event for the dropdown button
     * @function handleClick
     * @param {React.MouseEvent<HTMLElement>} event - The click event
     */
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    /**
     * Closes the dropdown menu
     * @function handleClose
     */
    const handleClose = () => {
        setAnchorEl(null);
    };

    const currentPage =
        subpages.find((page) => pathname === page.href)?.key || "title";

    return (
        <Box>
            <Button
                variant="contained"
                startIcon={<SportsBasketballIcon />}
                endIcon={<KeyboardArrowDownIcon />}
                onClick={handleClick}
                aria-haspopup="true"
                aria-expanded={open}
                aria-controls={open ? "fantasy-menu" : undefined}
                sx={{
                    backgroundColor: "black",
                    color: "white",
                    "&:hover": {
                        backgroundColor: "black",
                    },
                    border:
                        theme.palette.mode === "dark"
                            ? "1px solid rgba(255, 255, 255, 0.23)"
                            : "none",
                }}
            >
                {t(
                    `pages.fantasy.${currentPage === "title" ? "title" : `subpages.${currentPage}`}`
                )}
            </Button>
            {open && (
                <Portal>
                    <Menu
                        id="fantasy-menu"
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
                                backgroundColor: "background.paper",
                                border:
                                    theme.palette.mode === "dark"
                                        ? "1px solid rgba(255, 255, 255, 0.12)"
                                        : "none",
                            },
                        }}
                    >
                        {subpages.map((page) => (
                            <MenuItem
                                key={page.href}
                                component={Link}
                                href={page.href}
                                onClick={handleClose}
                                selected={pathname === page.href}
                                sx={{
                                    minWidth: 200,
                                    "&.Mui-selected": {
                                        backgroundColor: "black",
                                        color: "white",
                                        "&:hover": {
                                            backgroundColor: "black",
                                        },
                                    },
                                }}
                            >
                                <Typography variant="body1">
                                    {t(`pages.fantasy.subpages.${page.key}`)}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Menu>
                </Portal>
            )}
        </Box>
    );
}

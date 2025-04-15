"use client";

import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * HomeButton component for navigation
 * @component
 * @param {Object} props - Component props
 * @param {() => void} props.onClick - Click handler function
 * @param {string} props.textColor - Text color
 * @param {string} props.bgColor - Background color
 * @returns {JSX.Element} Home button with icon
 */
export const HomeButton = () => {
    const { t } = useLanguage();

    return (
        <Box
            sx={{
                position: "fixed",
                top: "16px",
                left: "16px",
                zIndex: 9999,
            }}
        >
            <Link href="/" passHref>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        color: "white",
                        backdropFilter: "blur(8px)",
                        borderRadius: "50%",
                        width: "40px",
                        height: "40px",
                        minWidth: "40px",
                        padding: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.9)",
                        },
                    }}
                    aria-label={t("navigation.home")}
                >
                    <Typography variant="h6">P</Typography>
                </Button>
            </Link>
        </Box>
    );
};

"use client";

import React, { JSX } from "react";
import { Box, Button } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useLanguage } from "@/contexts/LanguageContext";
import { HomeButtonProps } from "@/types/common";

/**
 * HomeButton component for navigation
 * @component
 * @param {Object} props - Component props
 * @param {() => void} props.onClick - Click handler function
 * @param {string} props.textColor - Text color
 * @param {string} props.bgColor - Background color
 * @param {React.ElementType} props.component - Custom component to wrap the button
 * @param {string} props.href - URL for the link
 * @returns {JSX.Element} Home button with icon
 */
export const HomeButton = ({
    component: Component = "div",
    href = "/",
}: HomeButtonProps): JSX.Element => {
    const { t } = useLanguage();

    return (
        <Box
            sx={{
                position: "fixed",
                top: { xs: "8px", sm: "16px" },
                left: { xs: "8px", sm: "16px" },
                zIndex: 9999,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "48px",
            }}
        >
            <Component href={href}>
                <Button
                    variant="outlined"
                    sx={{
                        color: "white",
                        backgroundColor: "black",
                        borderColor: "white",
                        "&:hover": {
                            backgroundColor: "black",
                            borderColor: "white",
                        },
                        backdropFilter: "blur(4px)",
                        minWidth: "48px",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        padding: "0",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: 0,
                    }}
                    aria-label={t("navigation.home")}
                >
                    <HomeIcon sx={{ fontSize: "1.5rem" }} />
                </Button>
            </Component>
        </Box>
    );
};

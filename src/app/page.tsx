"use client";

import { AboutSection } from "@/components/features/AboutSection";
import { Box, Skeleton } from "@mui/material";
import Link from "next/link";
import BrushIcon from "@mui/icons-material/Brush";
import TerminalIcon from "@mui/icons-material/Terminal";
import PreviewIcon from "@mui/icons-material/Preview";
import { useState, useEffect } from "react";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

/**
 * Home component - Main landing page
 * @component
 * @description The main landing page component that displays the about section and designs link
 * @returns {JSX.Element} Home page with about section and designs link
 */
export default function Home(): React.ReactElement {
    const icons = [BrushIcon, TerminalIcon, PreviewIcon];
    const [currentIconIndex, setCurrentIconIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isHovered) {
                setCurrentIconIndex(
                    (prevIndex) => (prevIndex + 1) % icons.length
                );
            }
        }, 1000);

        // simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 80);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [icons.length, isHovered]);

    const CurrentIcon = icons[currentIconIndex];

    if (isLoading) {
        return (
            <Box
                sx={{
                    height: { xs: "100vh", md: "100vh" },
                    width: "100%",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    overflow: "hidden",
                    position: "relative",
                }}
            >
                {/* About Section Skeleton */}
                <Box
                    sx={{
                        width: { xs: "100%", md: "50%" },
                        minHeight: { xs: "50vh", md: "100vh" },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 4,
                        p: 3,
                        bgcolor: "background.default",
                    }}
                >
                    <Skeleton
                        variant="rectangular"
                        sx={{
                            width: { xs: "10em", md: "20em" },
                            height: { xs: "15em", md: "30em" },
                            aspectRatio: "9/13",
                            bgcolor: "grey.800",
                            borderRadius: 2,
                        }}
                    />
                    <Skeleton
                        variant="text"
                        sx={{
                            width: "200px",
                            height: "40px",
                            bgcolor: "grey.800",
                        }}
                    />
                    <Skeleton
                        variant="text"
                        sx={{
                            width: "300px",
                            height: "24px",
                            bgcolor: "grey.800",
                        }}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mt: 2,
                        }}
                    >
                        {[...Array(3)].map((_, index) => (
                            <Skeleton
                                key={index}
                                variant="circular"
                                width={40}
                                height={40}
                                sx={{ bgcolor: "grey.800" }}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Designs Section Skeleton */}
                <Box
                    sx={{
                        width: { xs: "100%", md: "50%" },
                        minHeight: { xs: "50vh", md: "100vh" },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 2,
                        bgcolor: "white",
                    }}
                >
                    <Skeleton
                        variant="circular"
                        width={64}
                        height={64}
                        sx={{ bgcolor: "grey.300" }}
                    />
                    <Skeleton
                        variant="text"
                        sx={{
                            width: "150px",
                            height: "40px",
                            bgcolor: "grey.300",
                        }}
                    />
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                height: { xs: "100vh", md: "100vh" },
                width: "100%",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                overflow: "hidden",
                position: "relative",
            }}
        >
            <Box
                sx={{
                    position: "fixed",
                    top: { xs: "8px", sm: "16px" },
                    right: { xs: "8px", sm: "16px" },
                    zIndex: 9999,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "48px",
                }}
            >
                <LanguageSwitcher />
            </Box>
            <AboutSection />
            <Box
                id="designsbox"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                sx={{
                    width: { xs: "100%", md: "50%" },
                    height: { xs: "50vh", md: "100vh" },
                    background: "white",
                    color: "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition:
                        "background-color 0.5s ease-in-out, color 0.5s ease-in-out",
                    cursor: "pointer",
                    "&:hover": {
                        background: "black",
                        color: "white",
                    },
                }}
            >
                <Link
                    href="/designs"
                    style={{
                        fontWeight: "normal",
                        transition:
                            "transform 0.3s ease-in-out, font-weight 0.3s ease-in-out",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        fontSize: "2rem",
                        textDecoration: "none",
                        color: "inherit",
                        padding: "2rem",
                        width: "100%",
                        height: "100%",
                        justifyContent: "center",
                    }}
                >
                    <CurrentIcon
                        sx={{
                            fontSize: "4rem",
                            marginBottom: "0.5em",
                            opacity: isHovered ? 1 : 0.7,
                            transform: isHovered ? "scale(1.1)" : "scale(1)",
                            transition:
                                "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                            color: "inherit",
                            display: "block",
                            animation: !isHovered
                                ? "float 2s ease-in-out infinite"
                                : "none",
                            "@keyframes float": {
                                "0%, 100%": {
                                    transform: "translateY(0)",
                                },
                                "50%": {
                                    transform: "translateY(-10px)",
                                },
                            },
                        }}
                    />
                    <span
                        style={{
                            transition:
                                "transform 0.3s ease-in-out, font-weight 0.3s ease-in-out",
                            transform: isHovered ? "scale(1.1)" : "scale(1)",
                            fontWeight: isHovered ? "bold" : "normal",
                        }}
                    >
                        {t("navigation.designs")}
                    </span>
                </Link>
            </Box>
        </Box>
    );
}

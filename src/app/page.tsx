"use client";

import { AboutSection } from "@/components/features/AboutSection";
import { Box, Skeleton } from "@mui/material";
import Link from "next/link";
import BrushIcon from "@mui/icons-material/Brush";
import TerminalIcon from "@mui/icons-material/Terminal";
import PreviewIcon from "@mui/icons-material/Preview";
import { useState, useEffect } from "react";
import React from "react";

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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
        }, 1000);

        // Simulate minimum loading time to prevent flash
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [icons.length]);

    const CurrentIcon = icons[currentIconIndex];

    // Base container styles that are shared between loading and loaded states
    const containerStyles = {
        minHeight: "100vh", // Change from height to minHeight
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        overflow: "hidden", // Prevent any potential scrolling during transitions
    };

    if (isLoading) {
        return (
            <Box sx={containerStyles}>
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
        <Box sx={containerStyles}>
            <AboutSection />
            <Box
                id="designsbox"
                sx={{
                    width: { xs: "100%", md: "50%" },
                    minHeight: { xs: "50vh", md: "100vh" },
                    background: "white",
                    color: "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "all 0.6s ease",
                    "&:hover": {
                        background: "black",
                        color: "white",
                        "& svg": {
                            display: "block",
                        },
                    },
                }}
            >
                <Link
                    href="/designs"
                    style={{
                        fontWeight: "normal",
                        transition: "all 0.6s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        fontSize: "2rem",
                        textDecoration: "none",
                        color: "inherit",
                    }}
                >
                    <CurrentIcon
                        sx={{
                            margin: "auto auto 0.2em auto",
                            display: "none",
                            transition: "all 0.6s ease",
                            color: "inherit",
                            fontSize: "4rem",
                        }}
                    />
                    Designs
                </Link>
            </Box>
        </Box>
    );
}

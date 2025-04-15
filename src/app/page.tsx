"use client";

import AboutSection from "@/components/features/AboutSection";
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

        // Set loading to false immediately since we don't have any actual loading
        setIsLoading(false);

        return () => clearInterval(interval);
    }, [icons.length]);

    const CurrentIcon = icons[currentIconIndex];

    if (isLoading) {
        return (
            <Box
                sx={{
                    height: "100vh",
                    width: "100vw",
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                }}
            >
                {/* About Section Skeleton */}
                <Box
                    sx={{
                        width: { xs: "100%", md: "50vw" },
                        height: { xs: "50vh", md: "100%" },
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1em",
                        padding: "2em",
                    }}
                >
                    <Skeleton
                        variant="rectangular"
                        width="200px"
                        height="300px"
                        sx={{ bgcolor: "grey.800" }}
                    />
                    <Skeleton
                        variant="text"
                        width="150px"
                        height="40px"
                        sx={{ bgcolor: "grey.800" }}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5em",
                        }}
                    >
                        {[...Array(3)].map((_, index) => (
                            <Skeleton
                                key={index}
                                variant="text"
                                width="100px"
                                height="30px"
                                sx={{ bgcolor: "grey.800" }}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Designs Section Skeleton */}
                <Box
                    sx={{
                        width: { xs: "100%", md: "50vw" },
                        height: { xs: "50vh", md: "100%" },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Skeleton
                        variant="text"
                        width="200px"
                        height="60px"
                        sx={{ bgcolor: "grey.800" }}
                    />
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
            }}
        >
            <AboutSection />
            <Box
                id="designsbox"
                sx={{
                    width: { xs: "100vw", md: "50vw" },
                    height: { xs: "50vh", md: "100%" },
                    background: "white",
                    color: "black",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "background 0.6s ease",
                    "&:hover": {
                        background: "black",
                        color: "white",
                        "& svg": {
                            display: "block",
                        },
                    },
                    fontSize: "2rem",
                }}
            >
                <Link
                    href="/designs"
                    style={{
                        fontWeight: "normal",
                        transition: "font-weight 0.6s ease",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <CurrentIcon
                        sx={{
                            margin: "auto auto 0.2em auto",
                            display: "none",
                            transition: "display 0.6s ease",
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

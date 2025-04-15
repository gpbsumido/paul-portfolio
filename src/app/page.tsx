"use client";

import AboutSection from "@/components/AboutSection";
import { Box } from "@mui/material";
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

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIconIndex((prevIndex) => (prevIndex + 1) % icons.length);
        }, 1000); // Change icon every 2 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [icons.length]);

    const CurrentIcon = icons[currentIconIndex];

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: { xs: "column", md: "row" }, // Vertical on small screens
            }}
        >
            <AboutSection />
            <Box
                id="designsbox"
                sx={{
                    width: { xs: "100vw", md: "50vw" }, // Full width on small screens
                    height: { xs: "50vh", md: "100%" }, // Half height on small screens
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
                            color: "inherit", // Inherit color from parent
                            fontSize: "4rem",
                        }}
                    />
                    Designs
                </Link>
            </Box>
        </Box>
    );
}

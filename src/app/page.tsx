"use client";

import { AboutSection } from "@/components/features/home/AboutSection";
import { Box, Skeleton } from "@mui/material";
import Link from "next/link";
import BrushIcon from "@mui/icons-material/Brush";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import SportsMotorsportsIcon from "@mui/icons-material/SportsMotorsports";
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
    const designsIcons = [BrushIcon];
    const fantasyBasketballIcons = [SportsBasketballIcon];
    const fantasyF1Icons = [SportsMotorsportsIcon];

    const [designsIconIndex, setDesignsIconIndex] = useState(0);
    const [fantasyBasketballIconIndex, setFantasyBasketballIconIndex] =
        useState(0);
    const [fantasyF1IconIndex, setFantasyF1IconIndex] = useState(0);

    const [hoveredSection, setHoveredSection] = useState<string | null>(null);
    const { t } = useLanguage();

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (hoveredSection === "designs") {
            timer = setInterval(() => {
                setDesignsIconIndex(
                    (prevIndex) => (prevIndex + 1) % designsIcons.length
                );
            }, 1000);
        } else if (hoveredSection === "fantasyBasketball") {
            timer = setInterval(() => {
                setFantasyBasketballIconIndex(
                    (prevIndex) =>
                        (prevIndex + 1) % fantasyBasketballIcons.length
                );
            }, 1000);
        } else if (hoveredSection === "fantasyF1") {
            timer = setInterval(() => {
                setFantasyF1IconIndex(
                    (prevIndex) => (prevIndex + 1) % fantasyF1Icons.length
                );
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [
        hoveredSection,
        designsIcons.length,
        fantasyBasketballIcons.length,
        fantasyF1Icons.length,
    ]);

    const DesignsIcon = designsIcons[designsIconIndex];
    const FantasyBasketballIcon =
        fantasyBasketballIcons[fantasyBasketballIconIndex];
    const FantasyF1Icon = fantasyF1Icons[fantasyF1IconIndex];

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading state
        const timer = setTimeout(() => setIsLoading(false), 50);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    height: "100vh",
                    width: "100vw",
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
                        gap: 2,
                        bgcolor: "black",
                    }}
                >
                    <Skeleton
                        variant="circular"
                        width={200}
                        height={200}
                        sx={{ bgcolor: "grey.800" }}
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
                            height: "100px",
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
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                height: "100vh",
                width: "100vw",
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
                sx={{
                    width: { xs: "100%", md: "50%" },
                    height: { xs: "100vh", md: "100vh" },
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Box
                    id="designsbox"
                    onMouseEnter={() => setHoveredSection("designs")}
                    onMouseLeave={() => setHoveredSection(null)}
                    sx={{
                        width: "100%",
                        height: "33.33%",
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
                        <DesignsIcon
                            sx={{
                                fontSize: "4rem",
                                marginBottom: "0.5em",
                                opacity: hoveredSection === "designs" ? 1 : 0.7,
                                transform:
                                    hoveredSection === "designs"
                                        ? "scale(1.1)"
                                        : "scale(1)",
                                transition:
                                    "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                                color: "inherit",
                                display: "block",
                                animation:
                                    hoveredSection === "designs"
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
                                transform:
                                    hoveredSection === "designs"
                                        ? "scale(1.1)"
                                        : "scale(1)",
                                fontWeight:
                                    hoveredSection === "designs"
                                        ? "bold"
                                        : "normal",
                            }}
                        >
                            {t("navigation.designs")}
                        </span>
                    </Link>
                </Box>

                <Box
                    id="fantasybballbox"
                    onMouseEnter={() => setHoveredSection("fantasyBasketball")}
                    onMouseLeave={() => setHoveredSection(null)}
                    sx={{
                        width: "100%",
                        height: "33.33%",
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
                        href="/fantasy-bball"
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
                        <FantasyBasketballIcon
                            sx={{
                                fontSize: "4rem",
                                marginBottom: "0.5em",
                                opacity:
                                    hoveredSection === "fantasyBasketball"
                                        ? 1
                                        : 0.7,
                                transform:
                                    hoveredSection === "fantasyBasketball"
                                        ? "scale(1.1)"
                                        : "scale(1)",
                                transition:
                                    "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                                color: "inherit",
                                display: "block",
                                animation:
                                    hoveredSection === "fantasyBasketball"
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
                                transform:
                                    hoveredSection === "fantasyBasketball"
                                        ? "scale(1.1)"
                                        : "scale(1)",
                                fontWeight:
                                    hoveredSection === "fantasyBasketball"
                                        ? "bold"
                                        : "normal",
                            }}
                        >
                            {t("navigation.fantasybasketball")}
                        </span>
                    </Link>
                </Box>

                <Box
                    id="fantasyf1box"
                    onMouseEnter={() => setHoveredSection("fantasyF1")}
                    onMouseLeave={() => setHoveredSection(null)}
                    sx={{
                        width: "100%",
                        height: "33.33%",
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
                        href="/fantasy-f1"
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
                        <FantasyF1Icon
                            sx={{
                                fontSize: "4rem",
                                marginBottom: "0.5em",
                                opacity:
                                    hoveredSection === "fantasyF1" ? 1 : 0.7,
                                transform:
                                    hoveredSection === "fantasyF1"
                                        ? "scale(1.1)"
                                        : "scale(1)",
                                transition:
                                    "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                                color: "inherit",
                                display: "block",
                                animation:
                                    hoveredSection === "fantasyF1"
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
                                transform:
                                    hoveredSection === "fantasyF1"
                                        ? "scale(1.1)"
                                        : "scale(1)",
                                fontWeight:
                                    hoveredSection === "fantasyF1"
                                        ? "bold"
                                        : "normal",
                            }}
                        >
                            {t("navigation.fantasyF1")}
                        </span>
                    </Link>
                </Box>
            </Box>
        </Box>
    );
}

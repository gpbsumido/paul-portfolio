"use client";

import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SkeletonLoader } from "@/components/common/SkeletonLoader";
import BrushIcon from "@mui/icons-material/Brush";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import SportsMotorsportsIcon from "@mui/icons-material/SportsMotorsports";
import MapIcon from "@mui/icons-material/Map";
import ForumIcon from "@mui/icons-material/Forum";
import { HoverableSection } from "@/components/common/HoverableSection";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { AboutSection } from "@/components/features/home/AboutSection";

/**
 * Home component - Main landing page
 * @component
 * @description The main landing page component that displays the about section and links to other sections
 * @returns {JSX.Element} Home page with about section and links
 */
export default function Home(): React.ReactElement {
    const designsIcons = [BrushIcon];
    const fantasyBasketballIcons = [SportsBasketballIcon];
    const fantasyF1Icons = [SportsMotorsportsIcon];
    const mapsIcons = [MapIcon];
    const forumIcons = [ForumIcon];

    const [hoveredSection, setHoveredSection] = useState<string | null>(null);
    const { t } = useLanguage();

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
                    overflow: "auto",
                }}
            >
                <SkeletonLoader
                    width={{ xs: "100%", md: "50%" }}
                    minHeight={{ xs: "50vh", md: "100vh" }}
                    bgcolor="black"
                    circularSize={200}
                    textWidths={[200, 300]}
                />
                <SkeletonLoader
                    width={{ xs: "100%", md: "50%" }}
                    minHeight={{ xs: "50vh", md: "100vh" }}
                    bgcolor="white"
                    circularSize={64}
                    textWidths={[150]}
                />
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
                overflow: "auto",
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
                    overflow: "visible",
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
                <HoverableSection
                    id="designsbox"
                    href="/designs"
                    icon={designsIcons[0]}
                    label={t("navigation.designs")}
                    hoveredSection={hoveredSection}
                    setHoveredSection={setHoveredSection}
                />
                <HoverableSection
                    id="fantasybballbox"
                    href="/fantasy-bball"
                    icon={fantasyBasketballIcons[0]}
                    label={t("navigation.fantasybasketball")}
                    hoveredSection={hoveredSection}
                    setHoveredSection={setHoveredSection}
                />
                <HoverableSection
                    id="fantasyf1box"
                    href="/fantasy-f1"
                    icon={fantasyF1Icons[0]}
                    label={t("navigation.fantasyF1")}
                    hoveredSection={hoveredSection}
                    setHoveredSection={setHoveredSection}
                />
                <HoverableSection
                    id="mapsbox"
                    href="/maps"
                    icon={mapsIcons[0]}
                    label={t("navigation.maps")}
                    hoveredSection={hoveredSection}
                    setHoveredSection={setHoveredSection}
                />
                <HoverableSection
                    id="forumbox"
                    href="/forum"
                    icon={forumIcons[0]}
                    label={t("navigation.forum")}
                    hoveredSection={hoveredSection}
                    setHoveredSection={setHoveredSection}
                />
            </Box>
        </Box>
    );
}

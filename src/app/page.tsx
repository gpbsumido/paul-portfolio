"use client";

import {
    Box,
    Typography,
    Container,
    useTheme,
    useMediaQuery,
    IconButton,
    Avatar,
} from "@mui/material";
import { useRouter } from "next/navigation";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import EmailIcon from "@mui/icons-material/Email";
import { SOCIAL_LINKS } from "@/constants/social_links";
import { useState, useEffect } from "react";
import paulImage from "@/assets/paul.jpeg";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import SportsMotorsportsIcon from "@mui/icons-material/SportsMotorsports";
import MapIcon from "@mui/icons-material/Map";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import BrushIcon from "@mui/icons-material/Brush";

const sections = [
    {
        title: "Gallery",
        description: "Photography & Visual Work",
        path: "/gallery",
        icon: <PhotoLibraryIcon fontSize="large" />,
        bgImage:
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1638&q=80",
    },
    {
        title: "Fantasy Basketball",
        description: "Stats & Analysis",
        path: "/fantasy-bball",
        icon: <SportsBasketballIcon fontSize="large" />,
        bgImage:
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    },
    {
        title: "Fantasy F1",
        description: "Racing Analytics",
        path: "/fantasy-f1",
        icon: <SportsMotorsportsIcon fontSize="large" />,
        bgImage:
            "https://images.unsplash.com/photo-1568219656418-15c329312bf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    },
    {
        title: "Interactive Map",
        description: "Location Explorer",
        path: "/maps",
        icon: <MapIcon fontSize="large" />,
        bgImage:
            "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1650&q=80",
    },
    {
        title: "Forum",
        description: "Community Discussions/Logbook",
        path: "/forum",
        icon: <SmartphoneIcon fontSize="large" />,
        bgImage:
            "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1674&q=80",
    },
    {
        title: "Design Showcase",
        description: "Projects & Work",
        path: "/designs",
        icon: <BrushIcon fontSize="large" />,
        bgImage:
            "https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1664&q=80",
    },
];

export default function Home() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const router = useRouter();
    const [hoveredSection, setHoveredSection] = useState<number | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (hoveredSection === null) {
            interval = setInterval(() => {
                setCurrentImageIndex(
                    (prevIndex) => (prevIndex + 1) % sections.length
                );
            }, 2000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [hoveredSection]);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: theme.palette.background.default,
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Box
                key={
                    hoveredSection !== null ? hoveredSection : currentImageIndex
                }
                sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "40%",
                    height: "100%",
                    background: `url(${hoveredSection !== null ? sections[hoveredSection].bgImage : sections[currentImageIndex].bgImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    clipPath: "polygon(100% 0, 100% 100%, 0 100%, 30% 0)",
                    zIndex: 0,
                    transition:
                        "opacity 1.5s ease-in-out, transform 1.5s ease-in-out", // Added zoom-in effect
                    opacity: 1,
                    transform: "scale(1.1)", // Slight zoom-in effect
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                            theme.palette.mode === "dark"
                                ? "rgba(0, 0, 0, 0.5)"
                                : "rgba(255, 255, 255, 0.3)",
                        transition: "background 0.4s ease",
                    },
                }}
            />
            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        alignItems: "center",
                        gap: { xs: 3, md: 6 },
                        py: { xs: 4, md: 8 },
                    }}
                >
                    <Box
                        sx={{
                            position: "relative",
                            borderRadius: "50%",
                            overflow: "hidden",
                            boxShadow:
                                theme.palette.mode === "dark"
                                    ? "0 4px 20px rgba(255,255,255,0.1)"
                                    : "0 4px 20px rgba(0,0,0,0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.02)",
                                boxShadow:
                                    theme.palette.mode === "dark"
                                        ? "0 8px 30px rgba(255,255,255,0.15)"
                                        : "0 8px 30px rgba(0,0,0,0.15)",
                            },
                        }}
                    >
                        <Avatar
                            src={paulImage.src}
                            sx={{
                                width: { xs: 150, md: 200 },
                                height: { xs: 150, md: 200 },
                                border: "none",
                                transition: "transform 0.3s ease",
                            }}
                        />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: "bold",
                                mb: 2,
                                fontSize: { xs: "2.5rem", md: "3.5rem" },
                                position: "relative",
                                display: "inline-block",
                                color: theme.palette.text.primary,
                                "&::after": {
                                    content: '""',
                                    position: "absolute",
                                    bottom: -5,
                                    left: 0,
                                    width: "100%",
                                    height: "3px",
                                    background: theme.palette.text.primary,
                                    transform: "scaleX(0)",
                                    transformOrigin: "left",
                                    transition: "transform 0.3s ease",
                                },
                                "&:hover::after": { transform: "scaleX(1)" },
                            }}
                        >
                            Paul Sumido
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                color: theme.palette.text.secondary,
                                mb: 3,
                                maxWidth: "600px",
                                fontStyle: "italic",
                            }}
                        >
                            Full Stack Developer & Designer passionate about
                            creating intuitive and beautiful digital
                            experiences.
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                "& .MuiIconButton-root": {
                                    transition: "all 0.3s ease",
                                    color: theme.palette.text.primary,
                                    "&:hover": {
                                        transform: "translateY(-3px)",
                                        color: theme.palette.text.secondary,
                                    },
                                },
                            }}
                        >
                            <IconButton
                                href={SOCIAL_LINKS[0].href}
                                target="_blank"
                            >
                                <GitHubIcon />
                            </IconButton>
                            <IconButton
                                href={SOCIAL_LINKS[1].href}
                                target="_blank"
                            >
                                <LinkedInIcon />
                            </IconButton>
                            <IconButton href={SOCIAL_LINKS[2].href}>
                                <EmailIcon />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                        },
                        gap: 3,
                        py: 4,
                    }}
                >
                    {sections.map((section, index) => (
                        <Box
                            key={section.path}
                            onClick={() => router.push(section.path)}
                            onMouseEnter={() => setHoveredSection(index)}
                            onMouseLeave={() => setHoveredSection(null)}
                            sx={{
                                position: "relative",
                                cursor: "pointer",
                                "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: theme.palette.background.paper,
                                    transform: "scale(0.95)",
                                    transition:
                                        "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease",
                                    zIndex: -1,
                                },
                                "&:hover::before": {
                                    transform: "scale(1)",
                                    background: theme.palette.action.hover,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    p: 3,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    textAlign: "center",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                    },
                                }}
                            >
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontSize: "3rem",
                                        mb: 2,
                                        color: theme.palette.text.primary,
                                        transition: "transform 0.3s ease",
                                        "&:hover": { transform: "scale(1.1)" },
                                    }}
                                >
                                    {section.icon}
                                </Typography>
                                <Typography
                                    variant="h5"
                                    component="h2"
                                    sx={{
                                        fontWeight: "bold",
                                        mb: 1,
                                        color: theme.palette.text.primary,
                                        position: "relative",
                                        "&::after": {
                                            content: '""',
                                            position: "absolute",
                                            bottom: -2,
                                            left: "50%",
                                            width: 0,
                                            height: "2px",
                                            background:
                                                theme.palette.text.primary,
                                            transition: "all 0.3s ease",
                                            transform: "translateX(-50%)",
                                        },
                                    }}
                                >
                                    {section.title}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{ opacity: 0.8 }}
                                >
                                    {section.description}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
}

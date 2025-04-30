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
import { HOME_PAGE_SECTIONS } from "@/constants/constants";
import { getShapeProps } from "@/utils/background";

export default function Home() {
    const theme = useTheme();
    const router = useRouter();
    const [hoveredSection, setHoveredSection] = useState<number | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const activeIndex =
        hoveredSection !== null ? hoveredSection : currentImageIndex;
    const transitionDuration = "0.8s ease-in-out";

    useEffect(() => {
        if (hoveredSection !== null) return;

        const interval = setInterval(() => {
            setCurrentImageIndex(
                (prevIndex) => (prevIndex + 1) % HOME_PAGE_SECTIONS.length
            );
        }, 3000);

        return () => clearInterval(interval);
    }, [hoveredSection]);

    useEffect(() => {
        const preloadImages = () => {
            HOME_PAGE_SECTIONS.forEach((section) => {
                const img = new Image();
                img.src = section.bgImage;
            });
        };
        preloadImages();
    }, []);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: theme.palette.background.default,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {HOME_PAGE_SECTIONS.map((section, index) => {
                const isActive = index === activeIndex;
                const shapeProps = getShapeProps(index);

                return (
                    <Box
                        key={index}
                        sx={{
                            position: "absolute",
                            top: 0,
                            height: "100%",
                            background: `url(${section.bgImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            zIndex: isActive ? 1 : 0,
                            opacity: isActive ? 1 : 0,
                            pointerEvents: isActive ? "auto" : "none",
                            filter: isActive ? "blur(0px)" : "blur(20px)",
                            transform: "scale(1.05)",
                            willChange: "opacity, filter, transform",
                            transition: `opacity ${transitionDuration}, filter ${transitionDuration}, transform ${transitionDuration}`,
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
                            ...shapeProps,
                        }}
                    />
                );
            })}
            <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
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
                                background:
                                    theme.palette.mode === "dark"
                                        ? "rgba(0, 0, 0, 0.5)"
                                        : "rgba(255, 255, 255, 0.5)",
                                padding: "0.5rem 1rem",
                                borderRadius: "8px",
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
                                color: theme.palette.text.primary,
                                mb: 3,
                                maxWidth: "600px",
                                background:
                                    theme.palette.mode === "dark"
                                        ? "rgba(0, 0, 0, 0.5)"
                                        : "rgba(255, 255, 255, 0.5)",
                                padding: "0.5rem 1rem",
                                borderRadius: "8px",
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
                    {HOME_PAGE_SECTIONS.map((section, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <Box
                                key={section.path}
                                onClick={() => router.push(section.path)}
                                onMouseEnter={() => setHoveredSection(index)}
                                onMouseLeave={() => setHoveredSection(null)}
                                sx={{
                                    position: "relative",
                                    cursor: "pointer",
                                    transform: isActive
                                        ? "scale(1.05)"
                                        : "scale(1)",
                                    boxShadow: isActive
                                        ? theme.palette.mode === "dark"
                                            ? "0 8px 20px rgba(255, 255, 255, 0.2)"
                                            : "0 8px 20px rgba(0, 0, 0, 0.2)"
                                        : "none",
                                    transition:
                                        "transform 0.3s ease, box-shadow 0.3s ease",
                                    "&::before": {
                                        content: '""',
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background:
                                            theme.palette.background.paper,
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
                                        background:
                                            theme.palette.mode === "light"
                                                ? "rgba(255, 255, 255, 0.9)"
                                                : theme.palette.background
                                                      .paper,
                                        boxShadow:
                                            theme.palette.mode === "light"
                                                ? "0 4px 10px rgba(0, 0, 0, 0.1)"
                                                : "none",
                                        borderRadius: "8px",
                                        "&:hover": {
                                            transform: "translateY(-5px)",
                                            background:
                                                theme.palette.mode === "light"
                                                    ? "rgba(245, 245, 245, 1)"
                                                    : theme.palette.action
                                                          .hover,
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
                                            "&:hover": {
                                                transform: "scale(1.1)",
                                            },
                                        }}
                                    >
                                        {<section.icon fontSize="large" />}
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
                                        color={theme.palette.text.secondary}
                                        sx={{ opacity: 0.9 }}
                                    >
                                        {section.description}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Container>
        </Box>
    );
}

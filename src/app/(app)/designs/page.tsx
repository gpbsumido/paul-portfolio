"use client";

import {
    Box,
    Typography,
    Button,
    Card,
    CardMedia,
    CardContent,
    Modal,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import Footer from "../../../components/layout/Footer";
import {
    figmaDesigns,
    figmaImages,
    HELIKA_PORTAL_IMAGES,
    HELIKA_UA_IMAGES,
} from "@/constants/constants";
import React from "react";
import { HomeButton } from "@/components/common/HomeButton";
import CarouselSection from "@/components/common/CarouselSection";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

export default function Designs(): React.ReactElement {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
    const [heroBackground, setHeroBackground] = useState<string | null>(null);
    const [isHeroSticky, setIsHeroSticky] = useState(true); // State to control hero stickiness
    const [heroHeight, setHeroHeight] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [figmaRect, setFigmaRect] = useState({ top: 0 });

    const handleOpenModal = (design: string) => {
        setSelectedDesign(design);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedDesign(null);
        setOpenModal(false);
    };

    const handleMouseEnter = (image: string) => {
        setHeroBackground(image);
    };

    const handleMouseLeave = () => {
        setHeroBackground(null);
    };

    useEffect(() => {
        const loadImages = async () => {
            try {
                const imagePromises = [
                    ...HELIKA_PORTAL_IMAGES,
                    ...HELIKA_UA_IMAGES,
                ].map((src) => {
                    return new Promise<void>((resolve, reject) => {
                        const img = new window.Image();
                        img.src = typeof src === "string" ? src : src.src;
                        img.onload = () => resolve();
                        img.onerror = () =>
                            reject(new Error("Failed to load image"));
                    });
                });

                await Promise.all(imagePromises);
                setIsLoading(false);
            } catch (error) {
                console.error("Error loading images:", error);
                setIsLoading(false);
            }
        };

        loadImages();
    }, []);

    useEffect(() => {
        const updateHeroHeight = () => {
            const heroSection = document.getElementById("hero-section");
            if (heroSection) setHeroHeight(heroSection.offsetHeight);
        };

        const handleScroll = () => {
            const figmaSection = document.getElementById("figma-section");
            const heroSection = document.getElementById("hero-section");

            if (figmaSection && heroSection) {
                const figmaRect = figmaSection.getBoundingClientRect();
                const heroRect = heroSection.getBoundingClientRect();
                setFigmaRect(figmaRect);

                // Calculate the visible height of the hero section
                const visibleHeroHeight = Math.min(
                    heroRect.height,
                    window.innerHeight - heroRect.top
                );

                // Hero should be fixed if the Figma section is above the visible part of the hero
                setIsHeroSticky(figmaRect.top > visibleHeroHeight);
            }
        };

        updateHeroHeight();
        window.addEventListener("resize", updateHeroHeight);
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("resize", updateHeroHeight);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const designNames = ["CoinFX", "Sunbow", "RoyaltiesFi"];

    return (
        <>
            {/* Fixed Language Switcher and Home Button */}
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
                <HomeButton component={Link} href="/" />
            </Box>

            {/* Hero Section */}
            <Box
                id="hero-section"
                sx={{
                    height: { xs: "50vh", sm: "60vh" },
                    width: "100%",
                    position: "fixed",
                    top: isHeroSticky ? 0 : figmaRect.top - heroHeight,
                    zIndex: 1000,
                    background: (theme) =>
                        heroBackground
                            ? `url(${heroBackground}) center/contain no-repeat, linear-gradient(135deg, #2c3e50, #34495e, #4a69bd, #6a89cc)`
                            : "linear-gradient(135deg, #2c3e50, #34495e, #4a69bd, #6a89cc)",
                    backgroundSize: heroBackground
                        ? "contain, 400% 400%"
                        : "400% 400%",
                    animation: heroBackground
                        ? undefined
                        : "pastelGradient 10s ease infinite",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: (theme) =>
                        theme.palette.mode === "dark" ? "#ecf0f1" : "#fff",
                    textAlign: "center",
                    padding: "2em",
                    overflow: "hidden",
                    transition: "top 0.3s ease",
                    "&::before": heroBackground
                        ? undefined
                        : {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "200%",
                              height: "200%",
                              background:
                                  "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
                              animation: "waveEffect 6s infinite linear",
                              transform: "translate(-50%, -50%)",
                          },
                    "@keyframes waveEffect": {
                        "0%": {
                            transform: "translate(-50%, -50%) rotate(0deg)",
                        },
                        "100%": {
                            transform: "translate(-50%, -50%) rotate(360deg)",
                        },
                    },
                    "@keyframes pastelGradient": {
                        "0%": { backgroundPosition: "0% 50%" },
                        "50%": { backgroundPosition: "100% 50%" },
                        "100%": { backgroundPosition: "0% 50%" },
                    },
                }}
            >
                <Box
                    sx={{
                        opacity: heroBackground ? 0 : 1, // Hide text when an image is displayed
                        transition: "opacity 0.3s ease",
                    }}
                >
                    <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
                        {t("designs.title")}
                    </Typography>
                    <Typography variant="h6" sx={{ maxWidth: "600px", mb: 4 }}>
                        {t("designs.subtitle")}
                    </Typography>
                </Box>
            </Box>

            {/* Main Content Container */}
            <Box
                id="main-content"
                sx={{
                    position: "relative",
                    zIndex: 1,
                    paddingBottom: "2em",
                }}
            >
                {/* Placeholder to prevent layout shift */}
                <Box
                    sx={{
                        height: { xs: "50vh", sm: "60vh" },
                        width: "100%",
                    }}
                />

                <Box
                    id="designs"
                    sx={{
                        width: "100%",
                        background: "var(--background)",
                        color: "var(--foreground)",
                        display: "flex",
                        flexDirection: "column",
                        gap: { xs: "2em" },
                        padding: { xs: "2em" },
                        mb: "3em",
                        zIndex: 9999,
                    }}
                >
                    {/* Mosaic Gallery Section */}
                    <Card
                        sx={{
                            p: 2,
                            borderRadius: "0.5em",
                        }}
                    >
                        Helika WebApp
                    </Card>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(250px, 1fr))", // Uniform size for grid items
                            gap: "1em",
                            marginBottom: "-4em",
                            width: "100%",
                            maxWidth: "lg",
                            justifyContent: "center",
                            alignItems: "center",
                            marginLeft: "auto",
                            marginRight: "auto",
                        }}
                    >
                        {[...HELIKA_PORTAL_IMAGES, ...HELIKA_UA_IMAGES].map(
                            (image, index) => (
                                <Box
                                    key={index}
                                    onMouseEnter={() =>
                                        handleMouseEnter(
                                            typeof image === "string"
                                                ? image
                                                : image.src
                                        )
                                    }
                                    onMouseLeave={handleMouseLeave}
                                    sx={{
                                        position: "relative",
                                        overflow: "hidden",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        height: "150px", // Uniform height for all images
                                        transition: "transform 0.3s ease",
                                        "&:hover": {
                                            transform: "scale(1.1)",
                                            zIndex: 1,
                                        },
                                    }}
                                >
                                    <Image
                                        src={
                                            typeof image === "string"
                                                ? image
                                                : image.src
                                        }
                                        alt={`Gallery Image ${index + 1}`}
                                        layout="fill"
                                        objectFit="cover" // Ensure the image fills the container
                                    />
                                </Box>
                            )
                        )}
                    </Box>

                    <Box
                        id="figma-section"
                        sx={{
                            pt: "5em",
                            gap: "2em",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* Figma Designs Section */}
                        <Card
                            sx={{
                                p: 2,
                                borderRadius: "0.5em",
                            }}
                        >
                            Figmas
                        </Card>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "1fr 1fr 1fr",
                                },
                                gap: "2em",
                            }}
                        >
                            {figmaDesigns.map((design, index) => (
                                <Card
                                    key={index}
                                    sx={{
                                        borderRadius: "16px",
                                        boxShadow: 3,
                                        overflow: "hidden",
                                        transition: "transform 0.3s ease",
                                        "&:hover": {
                                            transform: "scale(1.05)",
                                        },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        image={
                                            typeof figmaImages[index] ===
                                            "string"
                                                ? figmaImages[index]
                                                : figmaImages[index].src
                                        }
                                        alt={`Project ${designNames[index]}`}
                                        sx={{
                                            height: "200px",
                                            objectFit: "cover",
                                        }}
                                    />
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: "bold", mb: 1 }}
                                        >
                                            {designNames[index]}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() =>
                                                handleOpenModal(design)
                                            }
                                            sx={{
                                                textTransform: "none",
                                                borderRadius: "8px",
                                            }}
                                        >
                                            {t("designs.viewDesign", {
                                                name: designNames[index],
                                            })}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Modal */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        width: "90%",
                        height: "90%",
                        backgroundColor: (theme) =>
                            theme.palette.mode === "dark" ? "#2c3e50" : "white",
                        color: (theme) =>
                            theme.palette.mode === "dark" ? "#ecf0f1" : "black",
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow: 24,
                        padding: "1em",
                        position: "relative",
                    }}
                >
                    <Button
                        onClick={handleCloseModal}
                        sx={{
                            position: "absolute",
                            top: "16px",
                            right: "16px",
                            zIndex: 10,
                            color: (theme) =>
                                theme.palette.mode === "dark"
                                    ? "#ecf0f1"
                                    : "black",
                        }}
                    >
                        Close
                    </Button>
                    {selectedDesign && (
                        <iframe
                            src={selectedDesign}
                            style={{
                                width: "100%",
                                height: "100%",
                                border: "none",
                            }}
                        />
                    )}
                </Box>
            </Modal>

            <Footer />
        </>
    );
}

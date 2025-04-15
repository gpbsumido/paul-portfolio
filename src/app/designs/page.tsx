"use client";

import { Box } from "@mui/material";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import Footer from "../../components/layout/Footer";
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
    const [activeIframes, setActiveIframes] = useState([false, false, false]);
    const [currentPortalImage, setCurrentPortalImage] = useState(0);
    const [currentUAImage, setCurrentUAImage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const handleTextClick = useCallback((index: number) => {
        setActiveIframes((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
        });
    }, []);

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
        const interval = setInterval(() => {
            setCurrentPortalImage(
                (prev) => (prev + 1) % HELIKA_PORTAL_IMAGES.length
            );
            setCurrentUAImage((prev) => (prev + 1) % HELIKA_UA_IMAGES.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const designNames = ["Sunbow", "RoyaltiesFi", "CoinFX"];

    return (
        <>
            <Box
                sx={{
                    height: "fit-content",
                    width: "100vw",
                    background: "var(--background)",
                    color: "var(--foreground)",
                    display: "flex",
                    flexDirection: "column",
                    scrollSnapType: { xs: "none", sm: "y mandatory" },
                    overflowY: "scroll",
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

                <CarouselSection
                    images={HELIKA_PORTAL_IMAGES}
                    currentIndex={currentPortalImage}
                    onIndexChange={setCurrentPortalImage}
                    title="Helika Portal"
                    textColor="var(--foreground)"
                    isLoading={isLoading}
                />

                <CarouselSection
                    images={HELIKA_UA_IMAGES}
                    currentIndex={currentUAImage}
                    onIndexChange={setCurrentUAImage}
                    title="Helika UA"
                    textColor="var(--foreground)"
                    isLoading={isLoading}
                />

                {[...Array(3)].map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            height: {
                                xs: "auto",
                                sm: `calc(100vh + ${index === 2 ? "0" : "min(25vh, 25vw)"})`,
                            },
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            scrollSnapAlign: { xs: "none", sm: "start" },
                            color: "var(--foreground)",
                            padding: { xs: "2em 0", sm: "0" },
                        }}
                    >
                        <Box
                            sx={{
                                height: { xs: "auto", sm: "100vh" },
                                width: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: { xs: "0.5em", sm: "1em" },
                                padding: { xs: "1em", sm: "0" },
                            }}
                        >
                            {activeIframes[index] ? (
                                <iframe
                                    src={figmaDesigns[index]}
                                    style={{
                                        width: "90%",
                                        height: "90%",
                                        border: "none",
                                    }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                        fontSize: { xs: "1rem", sm: "1.5rem" },
                                        fontWeight: "bold",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: { xs: "0.25em", sm: "0.5em" },
                                    }}
                                    onClick={() => handleTextClick(index)}
                                >
                                    <Image
                                        src={figmaImages[index]}
                                        alt={`Project ${designNames[index]}`}
                                        style={{
                                            width: "80%",
                                            height: "auto",
                                            objectFit: "contain",
                                        }}
                                        loading="lazy"
                                    />
                                    {t("designs.viewDesign", {
                                        name: designNames[index],
                                    })}
                                </Box>
                            )}
                        </Box>
                    </Box>
                ))}
            </Box>
            <Footer />
        </>
    );
}

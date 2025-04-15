"use client";

import { Box } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import Footer from "../../components/layout/Footer";
import {
    figmaDesigns,
    figmaImages,
    HELIKA_PORTAL_IMAGES,
    HELIKA_UA_IMAGES,
} from "@/constants/constants";
import React from "react";
import HomeButton from "@/components/common/HomeButton";
import CarouselSection from "@/components/common/CarouselSection";
import Image from "next/image";

export default function Designs(): React.ReactElement {
    const router = useRouter();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [activeIframes, setActiveIframes] = useState([false, false, false]);
    const sections = 5;
    const [currentPortalImage, setCurrentPortalImage] = useState(0);
    const [currentUAImage, setCurrentUAImage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const handleScroll = useCallback(() => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const position = Math.min(scrollTop / windowHeight, sections);
        setScrollPosition(position);
    }, [sections]);

    const handleTextClick = useCallback((index: number) => {
        setActiveIframes((prev) => {
            const updated = [...prev];
            updated[index] = true;
            return updated;
        });
    }, []);

    const getBackgroundColor = useCallback(() => {
        const sectionHeight = 1;
        const gapHeight = 0.25;
        const totalHeight = sectionHeight + gapHeight;
        const sectionIndex = Math.floor(scrollPosition / totalHeight);
        const positionInSection =
            (scrollPosition % totalHeight) / sectionHeight;
        const adjustedTransition = Math.max(0, Math.min(positionInSection, 1));
        const isEvenSection = sectionIndex % 2 === 0;
        const colorValue = isEvenSection
            ? Math.round(adjustedTransition * 255)
            : Math.round((1 - adjustedTransition) * 255);
        return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
    }, [scrollPosition]);

    const getTextColor = useCallback(() => {
        const sectionHeight = 1.25;
        const sectionIndex = Math.floor(scrollPosition / sectionHeight);
        const transition = scrollPosition / sectionHeight - sectionIndex;
        const isEvenSection = sectionIndex % 2 === 0;
        const adjustedTransition = Math.max(
            0,
            Math.min((transition - 0.2) * 1.25, 1)
        );
        const colorValue = isEvenSection
            ? Math.round((1 - adjustedTransition) * 255)
            : Math.round(adjustedTransition * 255);
        return `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
    }, [scrollPosition]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        // Simulate loading time for images
        const loadImages = async () => {
            try {
                // Preload images
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
                setIsLoading(false); // Still set loading to false to show error state
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

    const bgColor = useMemo(() => getBackgroundColor(), [getBackgroundColor]);
    const textColor = useMemo(() => getTextColor(), [getTextColor]);

    const designNames = ["Sunbow", "RoyaltiesFi", "CoinFX"];

    return (
        <>
            <Box
                sx={{
                    height: "fit-content",
                    width: "100vw",
                    background: bgColor,
                    color: textColor,
                    display: "flex",
                    flexDirection: "column",
                    scrollSnapType: { xs: "none", sm: "y mandatory" },
                    overflowY: "scroll",
                }}
            >
                <Link href="/">
                    <Box
                        sx={{
                            position: "fixed",
                            top: { xs: "8px", sm: "16px" },
                            left: { xs: "8px", sm: "16px" },
                            zIndex: 999,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <HomeButton
                            onClick={() => router.push("/")}
                            textColor={textColor}
                            bgColor={bgColor}
                        />
                    </Box>
                </Link>

                <CarouselSection
                    images={HELIKA_PORTAL_IMAGES}
                    currentIndex={currentPortalImage}
                    onIndexChange={setCurrentPortalImage}
                    title="Helika Portal"
                    textColor={textColor}
                    isLoading={isLoading}
                />

                <CarouselSection
                    images={HELIKA_UA_IMAGES}
                    currentIndex={currentUAImage}
                    onIndexChange={setCurrentUAImage}
                    title="Helika UA"
                    textColor={textColor}
                    isLoading={isLoading}
                />

                {[...Array(sections - 2)].map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            height: {
                                xs: "auto",
                                sm: `calc(100vh + ${index === sections - 3 ? "0" : "min(25vh, 25vw)"})`,
                            },
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            scrollSnapAlign: { xs: "none", sm: "start" },
                            color: textColor,
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
                                    View {designNames[index]} Design
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

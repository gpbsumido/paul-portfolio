"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import Image from "next/image";
import { CarouselProps } from "@/types/designs";
import ProgressBar from "./ProgressBar";
import CarouselSectionLoading from "./CarouselSectionLoading";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { ImageCarousel } from "./ImageCarousel";

/**
 * CarouselSection component for displaying a section with a carousel
 * @component
 * @param {Object} props - Component props
 * @param {(string | StaticImageData)[]} props.images - Array of images to display
 * @param {number} props.currentIndex - Current image index
 * @param {(index: number) => void} props.onIndexChange - Function to change current index
 * @param {string} props.title - Section title
 * @param {string} props.textColor - Text color
 * @param {boolean} props.isLoading - Whether the component is in loading state
 * @returns {JSX.Element} Section with carousel and title
 */
export default function CarouselSection({
    images,
    currentIndex,
    onIndexChange,
    title,
    textColor,
    isLoading = false,
    maxWidth,
    sx,
}: CarouselProps & { isLoading?: boolean }): React.ReactElement {
    const [currentIndexState, setCurrentIndexState] = useState(currentIndex);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Sync with parent's currentIndex
    useEffect(() => {
        setCurrentIndexState(currentIndex);
    }, [currentIndex]);

    const handlePrevious = useCallback(() => {
        const newIndex =
            currentIndexState === 0 ? images.length - 1 : currentIndexState - 1;
        setCurrentIndexState(newIndex);
        onIndexChange(newIndex);
    }, [currentIndexState, images.length, onIndexChange]);

    const handleNext = useCallback(() => {
        const newIndex =
            currentIndexState === images.length - 1 ? 0 : currentIndexState + 1;
        setCurrentIndexState(newIndex);
        onIndexChange(newIndex);
    }, [currentIndexState, images.length, onIndexChange]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                handlePrevious();
            } else if (event.key === "ArrowRight") {
                handleNext();
            }
        };

        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener("keydown", handleKeyDown);
            return () => carousel.removeEventListener("keydown", handleKeyDown);
        }
    }, [handleNext, handlePrevious, images.length]); // Add dependencies

    if (isLoading) {
        return <CarouselSectionLoading />;
    }

    return (
        <Box
            ref={carouselRef}
            role="region"
            aria-label={`${title} carousel`}
            tabIndex={0}
            sx={{
                height: { xs: "calc(100dvh - 80px)", sm: "calc(100vh - 80px)" },
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                scrollSnapAlign: "none",
                color: textColor,
                justifyContent: "center",
                padding: { xs: "2em 0", sm: "0" },
                "&:focus": {
                    outline: "2px solid #fff",
                    outlineOffset: "2px",
                },
                ...sx,
            }}
        >
            <Typography
                variant="h3"
                sx={{
                    color: textColor,
                    fontFamily: "inherit",
                    paddingBottom: { xs: "0.25em", sm: "0.5em" },
                    fontSize: { xs: "1.5rem", sm: "2.5rem" },
                    textAlign: "center",
                }}
            >
                {title}
            </Typography>
            <Box
                id="designsbox"
                sx={{
                    height: { xs: "calc(50dvh - 80px)", sm: "calc(60vh - 80px)" },
                    width: { xs: "90%", sm: "auto" },
                    maxWidth: { xs: "90vw", sm: maxWidth || "90vw" },
                    aspectRatio: "3593/2090",
                    position: "relative",
                    boxShadow: "10px 0 10px -4px gray, -10px 0 10px -4px gray",
                    cursor: "pointer",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                <Image
                    src={images[currentIndexState]}
                    alt={`${title} image ${currentIndexState + 1}`}
                    style={{
                        objectFit: "contain",
                        zIndex: 100,
                        marginBottom: "1em",
                        width: "100%",
                        height: "100%",
                    }}
                    fill={true}
                    priority={currentIndexState === 0}
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 90vw, 90vw"
                    quality={85}
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${Buffer.from(
                        '<svg width="40" height="24" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#333"/></svg>'
                    ).toString("base64")}`}
                />
                <ProgressBar progressKey={currentIndexState} />
            </Box>
            <Box
                sx={{
                    position: "relative",
                    width: { xs: "90%", sm: "100%" },
                    maxWidth: { xs: "90vw", sm: maxWidth || "90vw" },
                    minHeight: "200px",
                    display: "flex",
                    alignItems: "center",
                    overflow: "hidden",
                    margin: "0 auto",
                }}
            >
                <ImageCarousel
                    images={images}
                    currentIndex={currentIndexState}
                    onIndexChange={setCurrentIndexState}
                />
                <IconButton
                    onClick={handlePrevious}
                    aria-label="Previous image"
                    sx={{
                        position: "absolute",
                        left: { xs: "4px", sm: "8px" },
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "white",
                        bgcolor: "rgba(0, 0, 0, 0.5)",
                        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
                        zIndex: 1,
                    }}
                >
                    <ChevronLeft />
                </IconButton>
                <IconButton
                    onClick={handleNext}
                    aria-label="Next image"
                    sx={{
                        position: "absolute",
                        right: { xs: "4px", sm: "8px" },
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "white",
                        bgcolor: "rgba(0, 0, 0, 0.5)",
                        "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
                        zIndex: 1,
                    }}
                >
                    <ChevronRight />
                </IconButton>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 1,
                    mt: 2,
                }}
            >
                {images.map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor:
                                index === currentIndex
                                    ? "var(--foreground)"
                                    : "var(--background)",
                            border: "1px solid var(--foreground)",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                        }}
                        onClick={() => onIndexChange(index)}
                    />
                ))}
            </Box>
        </Box>
    );
}

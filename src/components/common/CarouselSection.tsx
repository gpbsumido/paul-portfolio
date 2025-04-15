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
    isLoading = false 
}: CarouselProps & { isLoading?: boolean }): React.ReactElement {
    const [currentIndexState, setCurrentIndexState] = useState(currentIndex);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Sync with parent's currentIndex
    useEffect(() => {
        setCurrentIndexState(currentIndex);
    }, [currentIndex]);

    const handlePrevious = useCallback(() => {
        const newIndex = currentIndexState === 0 ? images.length - 1 : currentIndexState - 1;
        setCurrentIndexState(newIndex);
        onIndexChange(newIndex);
    }, [currentIndexState, images.length, onIndexChange]);

    const handleNext = useCallback(() => {
        const newIndex = currentIndexState === images.length - 1 ? 0 : currentIndexState + 1;
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
                height: { xs: "auto", sm: `calc(100vh + min(25vh, 25vw))` },
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                scrollSnapAlign: "start",
                color: textColor,
                justifyContent: "start",
                paddingTop: { xs: "2em", sm: "5em" },
                paddingBottom: { xs: "2em", sm: "0" },
                "&:focus": {
                    outline: "2px solid #fff",
                    outlineOffset: "2px",
                },
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
                    height: { xs: "40vh", sm: "60vh" },
                    width: { xs: "90%", sm: "auto" },
                    maxWidth: { xs: "100%", sm: "90vw" },
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
                />
                <ProgressBar progressKey={currentIndexState} />
            </Box>
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    minHeight: "200px",
                    display: "flex",
                    alignItems: "center",
                    overflow: "visible",
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
                        left: 0,
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
                        right: 0,
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
                    mt: 2,
                    gap: 1,
                }}
            >
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndexState(index)}
                        aria-label={`Go to image ${index + 1} of ${images.length}`}
                        aria-current={currentIndexState === index}
                        style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            border: "none",
                            backgroundColor: currentIndexState === index ? "white" : "gray",
                            cursor: "pointer",
                            padding: 0,
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
} 
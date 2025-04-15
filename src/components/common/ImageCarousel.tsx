"use client";

import React, { JSX, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import { ImageCarouselProps } from "@/types/designs";
import ImageCarouselLoading from "./ImageCarouselLoading";

/**
 * ImageCarousel component for displaying a carousel of images
 * @component
 * @param {Object} props - Component props
 * @param {(string | StaticImageData)[]} props.images - Array of images to display
 * @param {number} props.currentIndex - Current image index
 * @param {(index: number) => void} props.onIndexChange - Function to change current index
 * @param {boolean} props.isLoading - Whether the component is in loading state
 * @returns {JSX.Element} Image carousel with navigation
 */
export const ImageCarousel = ({
    images,
    currentIndex,
    onIndexChange,
    isLoading = false,
}: ImageCarouselProps): JSX.Element => {
    const maxVisible = 3; // Show 3 thumbnails at a time
    const carouselRef = useRef<HTMLDivElement>(null);

    // Calculate the slide position
    const getSlidePosition = () => {
        // If we're in the last 3 images, don't slide further
        if (currentIndex >= images.length - maxVisible) {
            return (images.length - maxVisible) * 33.33;
        }
        // Otherwise, slide normally
        return currentIndex * 33.33;
    };

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowLeft") {
                onIndexChange(
                    currentIndex === 0 ? images.length - 1 : currentIndex - 1
                );
            } else if (event.key === "ArrowRight") {
                onIndexChange(
                    currentIndex === images.length - 1 ? 0 : currentIndex + 1
                );
            }
        };

        const carousel = carouselRef.current;
        if (carousel) {
            carousel.addEventListener("keydown", handleKeyDown);
            return () => carousel.removeEventListener("keydown", handleKeyDown);
        }
    }, [currentIndex, images.length, onIndexChange]);

    if (isLoading) {
        return <ImageCarouselLoading />;
    }

    return (
        <Box
            ref={carouselRef}
            role="region"
            aria-label="Image carousel thumbnails"
            tabIndex={0}
            sx={{
                height: { xs: "15vh", sm: "20vh" },
                justifyContent: "center",
                alignItems: "center",
                marginTop: { xs: "8px", sm: "16px" },
                display: "flex",
                flexDirection: "row",
                gap: { xs: "0.5em", sm: "1em" },
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: { xs: "0.5em", sm: "1em" },
                    transform: `translateX(-${getSlidePosition()}%)`,
                    transition: "transform 0.3s ease",
                    width: `${images.length * 33.33}%`,
                    paddingLeft: { xs: "2em", sm: "1em" },
                    paddingRight: { xs: "2em", sm: "1em" },
                }}
            >
                {images.map((image, idx) => (
                    <Box
                        key={idx}
                        sx={{
                            height: "100%",
                            aspectRatio: "3593/2090",
                            backgroundColor: "white",
                            overflow: "hidden",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flex: "0 0 calc(33.33% - 0.5em)",
                            opacity: currentIndex === idx ? 1 : 0.6,
                            transition: "opacity 0.3s ease",
                            "&:hover": {
                                opacity: 1,
                            },
                        }}
                        onClick={() => onIndexChange(idx)}
                        role="button"
                        aria-label={`Preview image ${idx + 1}`}
                        tabIndex={0}
                    >
                        <Image
                            src={image}
                            alt={`Thumbnail ${idx + 1}`}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                            loading="lazy"
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

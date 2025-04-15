"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { CarouselProps } from "@/types/designs";
import ImageCarousel from "./ImageCarousel";
import ProgressBar from "./ProgressBar";
import CarouselSectionLoading from "./CarouselSectionLoading";

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
    if (isLoading) {
        return <CarouselSectionLoading />;
    }

    return (
        <Box
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
                    src={images[currentIndex]}
                    alt={`${title} image ${currentIndex + 1}`}
                    style={{
                        objectFit: "contain",
                        zIndex: 100,
                        marginBottom: "1em",
                        width: "100%",
                        height: "100%",
                    }}
                    fill={true}
                    priority={currentIndex === 0}
                />
                <ProgressBar progressKey={currentIndex} />
            </Box>
            <ImageCarousel
                images={images}
                currentIndex={currentIndex}
                onIndexChange={onIndexChange}
            />
        </Box>
    );
} 
"use client";

import React, { useMemo } from "react";
import { Box, IconButton } from "@mui/material";
import Image from "next/image";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { ImageCarouselProps } from "@/types/designs";

/**
 * ImageCarousel component for displaying a carousel of images
 * @component
 * @param {Object} props - Component props
 * @param {(string | StaticImageData)[]} props.images - Array of images to display
 * @param {number} props.currentIndex - Current image index
 * @param {(index: number) => void} props.onIndexChange - Function to change current index
 * @returns {JSX.Element} Image carousel with navigation
 */
export default function ImageCarousel({ images, currentIndex, onIndexChange }: ImageCarouselProps): React.ReactElement {
    const maxVisible = 3;
    const carouselIndex = useMemo(
        () => Math.min(currentIndex, images.length - maxVisible),
        [currentIndex, images.length]
    );

    return (
        <Box
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
            <IconButton
                onClick={() => onIndexChange(Math.max(currentIndex - 1, 0))}
                sx={{
                    position: "absolute",
                    left: { xs: "4px", sm: "0" },
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    background: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    "&:hover": { background: "rgba(0, 0, 0, 0.7)" },
                    padding: { xs: "4px", sm: "8px" },
                    minWidth: { xs: "32px", sm: "48px" },
                    minHeight: { xs: "32px", sm: "48px" },
                }}
            >
                <ArrowCircleLeftIcon sx={{ fontSize: { xs: "1.5em", sm: "3em" } }} />
            </IconButton>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: { xs: "0.5em", sm: "1em" },
                    transform: `translateX(-${carouselIndex * 33.33}%)`,
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
                        }}
                        onMouseEnter={() => onIndexChange(idx)}
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
            <IconButton
                onClick={() =>
                    onIndexChange(
                        Math.min(currentIndex + 1, images.length - maxVisible)
                    )
                }
                sx={{
                    position: "absolute",
                    right: { xs: "4px", sm: "0" },
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    background: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    "&:hover": { background: "rgba(0, 0, 0, 0.7)" },
                    padding: { xs: "4px", sm: "8px" },
                    minWidth: { xs: "32px", sm: "48px" },
                    minHeight: { xs: "32px", sm: "48px" },
                }}
            >
                <ArrowCircleRightIcon sx={{ fontSize: { xs: "1.5em", sm: "3em" } }} />
            </IconButton>
        </Box>
    );
} 
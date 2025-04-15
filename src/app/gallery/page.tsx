"use client";

import { Box } from "@mui/material";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import React from "react";
import { HELIKA_PORTAL_IMAGES } from "@/constants/constants";

interface ImageData {
    src: string | StaticImageData;
    width: number;
    height: number;
}

/**
 * Gallery component - Image gallery with responsive layout
 * @component
 * @description A responsive image gallery component that automatically arranges images in optimal rows
 * @returns {JSX.Element} Responsive image gallery with hover effects
 */
export default function Gallery(): React.ReactElement {
    const [images, setImages] = useState<ImageData[]>([]);
    const [containerWidth, setContainerWidth] = useState(0);
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);

    /**
     * Updates the container width based on window resize
     * @description Updates the container width state when the window is resized
     */
    const updateWidth = (): void => {
        setContainerWidth(window.innerWidth - 40); // 40px for padding
    };

    useEffect(() => {
        // In a real app, this would fetch from an API or database
        // Placeholder data for demonstration
        setImages(HELIKA_PORTAL_IMAGES);

        updateWidth();
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    /**
     * Calculates the optimal layout for a row of images
     * @description Arranges images in rows with optimal spacing and height
     */
    const getOptimalRowLayout = (
        images: ImageData[],
        containerWidth: number,
        targetRowHeight: number = 300
    ): ImageData[][] => {
        const rows: ImageData[][] = [];
        let currentRow: ImageData[] = [];
        let currentRowWidth = 0;

        images.forEach((image) => {
            const scaledWidth = (image.width * targetRowHeight) / image.height;

            if (
                currentRowWidth + scaledWidth > containerWidth &&
                currentRow.length > 0
            ) {
                rows.push([...currentRow]);
                currentRow = [];
                currentRowWidth = 0;
            }

            currentRow.push(image);
            currentRowWidth += scaledWidth;
        });

        if (currentRow.length > 0) {
            rows.push(currentRow);
        }

        return rows;
    };

    return (
        <Box
            sx={{
                padding: "20px",
                width: "100%",
                minHeight: "100vh",
                backgroundColor: "#f5f5f5",
            }}
        >
            {getOptimalRowLayout(images, containerWidth).map(
                (row, rowIndex) => {
                    const totalAspectRatio = row.reduce(
                        (sum, img) => sum + img.width / img.height,
                        0
                    );
                    const rowHeight = containerWidth / totalAspectRatio;

                    return (
                        <Box
                            key={rowIndex}
                            sx={{
                                display: "flex",
                                gap: "4px",
                                marginBottom: "4px",
                                alignItems: "center",
                            }}
                        >
                            {row.map((image, imageIndex) => {
                                const width =
                                    (image.width * rowHeight) / image.height;
                                const isHovered =
                                    hoveredImage ===
                                    `${rowIndex}-${imageIndex}`;
                                const scale = isHovered ? 1.1 : 1;

                                return (
                                    <Box
                                        key={`${rowIndex}-${imageIndex}`}
                                        sx={{
                                            position: "relative",
                                            width: `${width}px`,
                                            height: `${rowHeight}px`,
                                            overflow: "hidden",
                                            transform: `scale(${scale})`,
                                            transition: "transform 0.3s ease",
                                            zIndex: isHovered ? 1 : 0,
                                        }}
                                        onMouseEnter={() =>
                                            setHoveredImage(
                                                `${rowIndex}-${imageIndex}`
                                            )
                                        }
                                        onMouseLeave={() =>
                                            setHoveredImage(null)
                                        }
                                    >
                                        <Image
                                            src={image.src}
                                            alt={`Gallery image ${rowIndex}-${imageIndex}`}
                                            fill
                                            style={{
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Box>
                                );
                            })}
                        </Box>
                    );
                }
            )}
        </Box>
    );
}

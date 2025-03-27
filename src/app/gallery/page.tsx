'use client';

import { HELIKA_PORTAL_IMAGES } from "@/constants/constants";
import { Box } from "@mui/material";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ImageData {
    src: string;
    width: number;
    height: number;
}

export default function Gallery() {
    const [images, setImages] = useState<ImageData[]>([]);
    const [containerWidth, setContainerWidth] = useState(0);
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);

    useEffect(() => {
        // In a real app, this would fetch from an API or database
        // Placeholder data for demonstration
        setImages(HELIKA_PORTAL_IMAGES);

        const updateWidth = () => {
            setContainerWidth(window.innerWidth - 40); // 40px for padding
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const getOptimalRowLayout = (images: ImageData[], containerWidth: number, targetRowHeight: number = 300) => {
        const rows: ImageData[][] = [];
        let currentRow: ImageData[] = [];
        let currentRowWidth = 0;

        images.forEach((image) => {
            const scaledWidth = (image.width * targetRowHeight) / image.height;
            
            if (currentRowWidth + scaledWidth > containerWidth && currentRow.length > 0) {
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
        <Box sx={{
            padding: '20px',
            width: '100%',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            {getOptimalRowLayout(images, containerWidth).map((row, rowIndex) => {
                const totalAspectRatio = row.reduce((sum, img) => sum + (img.width / img.height), 0);
                const rowHeight = containerWidth / totalAspectRatio;

                return (
                    <Box
                        key={rowIndex}
                        sx={{
                            display: 'flex',
                            gap: '4px',
                            marginBottom: '4px',
                            alignItems: 'center'
                        }}
                    >
                        {row.map((image, imageIndex) => {
                            const width = (image.width * rowHeight) / image.height;
                            const isHovered = hoveredImage === `${rowIndex}-${imageIndex}`;
                            const scale = isHovered ? 1.1 : 1;
                            
                            return (
                                <Box
                                    key={`${rowIndex}-${imageIndex}`}
                                    sx={{
                                        position: 'relative',
                                        width: `${width}px`,
                                        height: `${rowHeight}px`,
                                        overflow: 'hidden',
                                        transform: `scale(${scale})`,
                                        transition: 'transform 0.3s ease',
                                        zIndex: isHovered ? 1 : 0
                                    }}
                                    onMouseEnter={() => setHoveredImage(`${rowIndex}-${imageIndex}`)}
                                    onMouseLeave={() => setHoveredImage(null)}
                                >
                                    <Image
                                        src={image.src}
                                        alt={`Gallery image ${rowIndex}-${imageIndex}`}
                                        fill
                                        style={{
                                            objectFit: 'cover'
                                        }}
                                    />
                                </Box>
                            );
                        })}
                    </Box>
                );
            })}
        </Box>
    );
}

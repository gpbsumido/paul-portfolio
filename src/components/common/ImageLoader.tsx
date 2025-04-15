"use client";

import React from "react";
import { Box, Skeleton } from "@mui/material";

interface ImageLoaderProps {
    width: string | number;
    height: string | number;
}

export default function ImageLoader({ width, height }: ImageLoaderProps) {
    return (
        <Box
            sx={{
                width,
                height,
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation="wave"
                sx={{
                    bgcolor: "grey.800",
                    borderRadius: 1,
                }}
            />
        </Box>
    );
}

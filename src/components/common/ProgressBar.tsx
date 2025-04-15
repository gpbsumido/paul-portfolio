"use client";

import React from "react";
import { Box } from "@mui/material";
import { ProgressBarProps } from "@/types/designs";

/**
 * ProgressBar component for showing progress
 * @component
 * @param {Object} props - Component props
 * @param {number} props.progressKey - Key to trigger animation
 * @returns {JSX.Element} Animated progress bar
 */
export default function ProgressBar({ progressKey }: ProgressBarProps): React.ReactElement {
    return (
        <Box
            sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "5px",
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                zIndex: 200,
                overflow: "hidden",
            }}
        >
            <Box
                sx={{
                    height: "100%",
                    backgroundColor: "white",
                    animation: "fillProgress 5s linear infinite",
                    width: "100%",
                    zIndex: 201,
                }}
                key={progressKey}
            />
            <style jsx>{`
                @keyframes fillProgress {
                    from {
                        width: 0;
                    }
                    to {
                        width: 100%;
                    }
                }
            `}</style>
        </Box>
    );
} 
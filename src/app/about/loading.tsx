"use client";

import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
                backgroundColor: "black",
            }}
        >
            <CircularProgress sx={{ color: "white" }} />
        </Box>
    );
} 
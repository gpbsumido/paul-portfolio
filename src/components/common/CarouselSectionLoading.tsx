"use client";

import React from "react";
import { Box, Typography, Skeleton } from "@mui/material";

export default function CarouselSectionLoading(): React.ReactElement {
    return (
        <Box
            sx={{
                height: { xs: "auto", sm: `calc(100vh + min(25vh, 25vw))` },
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                scrollSnapAlign: "start",
                color: "white",
                justifyContent: "start",
                paddingTop: { xs: "2em", sm: "5em" },
                paddingBottom: { xs: "2em", sm: "0" },
            }}
        >
            <Typography
                variant="h3"
                sx={{
                    color: "white",
                    fontFamily: "inherit",
                    paddingBottom: { xs: "0.25em", sm: "0.5em" },
                    fontSize: { xs: "1.5rem", sm: "2.5rem" },
                    textAlign: "center",
                }}
            >
                <Skeleton width={200} height={40} />
            </Typography>
            <Box
                sx={{
                    height: { xs: "40vh", sm: "60vh" },
                    width: { xs: "90%", sm: "auto" },
                    maxWidth: { xs: "100%", sm: "90vw" },
                    aspectRatio: "3593/2090",
                    position: "relative",
                    boxShadow: "10px 0 10px -4px gray, -10px 0 10px -4px gray",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                }}
            >
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    sx={{ bgcolor: "grey.800" }}
                />
            </Box>
            <Box
                sx={{
                    height: { xs: "15vh", sm: "20vh" },
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: { xs: "8px", sm: "16px" },
                    gap: { xs: "0.5em", sm: "1em" },
                }}
            >
                <Skeleton
                    variant="rectangular"
                    width="30%"
                    height="100%"
                    sx={{ bgcolor: "grey.800" }}
                />
                <Skeleton
                    variant="rectangular"
                    width="30%"
                    height="100%"
                    sx={{ bgcolor: "grey.800" }}
                />
                <Skeleton
                    variant="rectangular"
                    width="30%"
                    height="100%"
                    sx={{ bgcolor: "grey.800" }}
                />
            </Box>
        </Box>
    );
}

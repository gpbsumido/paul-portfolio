"use client";

import React from "react";
import { Box, Skeleton } from "@mui/material";

export default function ImageCarouselLoading(): React.ReactElement {
    return (
        <Box
            sx={{
                height: { xs: "15vh", sm: "20vh" },
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: { xs: "8px", sm: "16px" },
                gap: { xs: "0.5em", sm: "1em" },
                position: "relative",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: { xs: "0.5em", sm: "1em" },
                    width: "100%",
                    paddingLeft: { xs: "2em", sm: "1em" },
                    paddingRight: { xs: "2em", sm: "1em" },
                }}
            >
                {[...Array(3)].map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            height: "100%",
                            aspectRatio: "3593/2090",
                            flex: "0 0 calc(33.33% - 0.5em)",
                        }}
                    >
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height="100%"
                            sx={{ bgcolor: "grey.800" }}
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

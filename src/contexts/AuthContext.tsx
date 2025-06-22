"use client";

import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Box, CircularProgress } from "@mui/material";

export default function AuthContext({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isLoading } = useAuth0();

    // Show loading if Auth0 is loading
    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    width: "100vw",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }
    return children;
}

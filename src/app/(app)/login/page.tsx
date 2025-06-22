"use client";

import React, { useEffect, useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoginPage() {
    const { isLoading, isAuthenticated, error } = useAuth0();
    const router = useRouter();
    const hasRedirectedRef = useRef(false);

    useEffect(() => {
        // Only proceed if Auth0 has finished loading and we haven't redirected yet
        if (!isLoading && !hasRedirectedRef.current) {
            hasRedirectedRef.current = true;

            // Check for stored redirect paths
            const loginRedirectPath = localStorage.getItem("loginRedirectPath");
            const logoutRedirectPath =
                localStorage.getItem("logoutRedirectPath");

            console.log("Login page - Auth state:", {
                isAuthenticated,
                loginRedirectPath,
                logoutRedirectPath,
            });

            if (isAuthenticated && loginRedirectPath) {
                // User just logged in, redirect to stored path
                console.log("Redirecting to login path:", loginRedirectPath);
                localStorage.removeItem("loginRedirectPath");
                router.push(loginRedirectPath);
            } else if (!isAuthenticated && logoutRedirectPath) {
                // User just logged out, redirect to stored path
                console.log("Redirecting to logout path:", logoutRedirectPath);
                localStorage.removeItem("logoutRedirectPath");
                router.push(logoutRedirectPath);
            } else if (isAuthenticated && !loginRedirectPath) {
                // User is authenticated but no stored path, redirect to home
                console.log("User authenticated, redirecting to home");
                router.push("/");
            } else {
                // No stored path and not authenticated, redirect to home
                console.log("No stored path, redirecting to home");
                router.push("/");
            }
        }
    }, [isLoading, isAuthenticated, router]);

    // Show error if authentication failed
    if (error) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    width: "100vw",
                    gap: 2,
                }}
            >
                <Typography variant="h6" color="error">
                    Authentication Error
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {error.message}
                </Typography>
                <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => router.push("/")}
                >
                    Return to Home
                </Typography>
            </Box>
        );
    }

    // Show loading spinner
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
                gap: 2,
            }}
        >
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
                {isLoading
                    ? "Loading..."
                    : isAuthenticated
                      ? "Redirecting..."
                      : "Processing..."}
            </Typography>
        </Box>
    );
}

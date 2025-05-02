"use client";

import {
    Box,
    Typography,
    Button,
    useTheme,
    useMediaQuery,
    Avatar,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useState, useEffect, useRef } from "react";

export default function FloatingPill({
    redirectUrl,
}: {
    redirectUrl?: string;
}) {
    const theme = useTheme();
    const { user, isAuthenticated, isLoading, loginWithRedirect, logout } =
        useAuth0();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [minimized, setMinimized] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const isLoggedIn = !isLoading && isAuthenticated;

    // Function to schedule auto-minimize after 10 seconds
    const scheduleMinimize = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => setMinimized(true), 10000);
    };

    useEffect(() => {
        if (isLoggedIn && isMobile) {
            scheduleMinimize();
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isLoggedIn, isMobile]);

    const handleMouseEnter = () => {
        if (isLoggedIn && isMobile) {
            if (timerRef.current) clearTimeout(timerRef.current);
            setMinimized(false);
            scheduleMinimize();
        }
    };

    const handleMouseLeave = () => {
        if (isLoggedIn && isMobile) {
            scheduleMinimize();
        }
    };

    // Also handle tap on mobile to expand and restart timer
    const handleTap = () => {
        if (isLoggedIn && isMobile && minimized) {
            if (timerRef.current) clearTimeout(timerRef.current);
            setMinimized(false);
            scheduleMinimize();
        }
    };

    return (
        <Box
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTap}
            onClick={handleTap}
            sx={{
                position: "fixed",
                top: { xs: "8px", sm: "8px" }, // Top center of the screen
                left: "50%",
                transform: "translateX(-50%)", // Center horizontally
                zIndex: 9999,
                background:
                    theme.palette.mode === "dark"
                        ? "rgba(15, 23, 42, 0.95)" // Dark blue pastel
                        : "rgba(30, 58, 138, 0.95)", // Lighter blue pastel
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease-in-out",
                borderRadius:
                    isLoggedIn && isMobile && minimized ? "50%" : "20px",
                padding:
                    isLoggedIn && isMobile && minimized ? "8px" : "8px 16px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: isLoggedIn && isMobile && minimized ? 0 : 2,
                color: theme.palette.common.white,
                textAlign: "center",
                width: isLoggedIn && isMobile && minimized ? 48 : "fit-content",
            }}
        >
            {!isLoading && isAuthenticated ? (
                minimized && isMobile ? (
                    <Avatar
                        src={user?.picture}
                        alt={user?.name}
                        sx={{ width: 32, height: 32 }}
                    />
                ) : (
                    <>
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                color: "rgba(255, 255, 255, 0.9)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            Welcome, {user?.name || "User"}!
                        </Typography>
                        <Button
                            variant="outlined"
                            sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                color: "rgba(255, 255, 255, 0.9)",
                                borderColor: "rgba(255, 255, 255, 0.6)",
                                borderRadius: "12px",
                                padding: "4px 12px",
                                fontSize: "0.8rem",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                    borderColor: "rgba(255, 255, 255, 0.9)",
                                },
                            }}
                            onClick={() =>
                                logout({
                                    logoutParams: {
                                        returnTo:
                                            redirectUrl || window.location.href, // Return to the provided redirect URL or current location
                                    },
                                })
                            }
                        >
                            Logout
                        </Button>
                    </>
                )
            ) : (
                <Button
                    variant="contained"
                    sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        backgroundColor: "rgba(37, 99, 235, 0.9)",
                        color: theme.palette.common.white,
                        borderRadius: "12px",
                        padding: "4px 12px",
                        fontSize: "0.8rem",
                        "&:hover": {
                            backgroundColor: "rgba(29, 78, 216, 1)",
                        },
                        margin: "0 auto",
                    }}
                    onClick={() =>
                        loginWithRedirect({
                            appState: {
                                returnTo: redirectUrl || window.location.href,
                            },
                        })
                    }
                >
                    Log In
                </Button>
            )}
        </Box>
    );
}

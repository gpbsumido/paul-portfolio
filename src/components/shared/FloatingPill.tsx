"use client";

import { Box, Typography, Button, useTheme } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

export default function FloatingPill({ redirectUrl }: { redirectUrl?: string }) {
    const theme = useTheme();
    const { user, isAuthenticated, isLoading, loginWithRedirect, logout } =
        useAuth0();

    return (
        <Box
            sx={{
                position: "fixed",
                top: { xs: "8px", sm: "8px" }, // Top center of the screen
                left: "50%",
                transform: "translateX(-50%)", // Center horizontally
                zIndex: 9999,
                background: theme.palette.mode === "dark"
                    ? "rgba(15, 23, 42, 0.95)" // Dark blue pastel
                    : "rgba(30, 58, 138, 0.95)", // Lighter blue pastel
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                borderRadius: "20px", // Pill shape
                padding: "8px 16px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
                color: theme.palette.common.white,
                textAlign: "center",
                width: "fit-content",
            }}
        >
            {!isLoading && isAuthenticated ? (
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
                                    returnTo: redirectUrl || window.location.href, // Return to the provided redirect URL or current location
                                },
                            })
                        }
                    >
                        Logout
                    </Button>
                </>
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

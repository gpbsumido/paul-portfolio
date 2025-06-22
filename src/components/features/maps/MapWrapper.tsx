"use client";

import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/components/layout/ErrorBoundary";

const MapContent = dynamic(
    () => import("./MapContent").then((mod) => mod.default),
    {
        ssr: false,
        loading: () => (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
            >
                <CircularProgress />
            </Box>
        ),
    }
);

export default function MapWrapper() {
    const [location, setLocation] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== "undefined" && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                    setLoading(false);
                },
                (error) => {
                    setError(error.message);
                    setLoading(false);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
        }
    }, []);

    if (!mounted) {
        return null;
    }

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="400px"
            >
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!location) {
        return null;
    }

    return (
        <Box
            sx={{
                height: "fit-content",
                borderRadius: 1,
                overflow: "hidden",
                mt: 2,
            }}
        >
            <ErrorBoundary>
                <MapContent location={location} />
            </ErrorBoundary>
        </Box>
    );
}

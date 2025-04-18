"use client";

import { Box, Container, Typography } from "@mui/material";
import { useLanguage } from "@/contexts/LanguageContext";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import Link from "next/link";
import dynamic from "next/dynamic";

const MapWrapper = dynamic(
    () => import("@/components/features/maps/MapWrapper"),
    {
        ssr: false,
        loading: () => (
            <Box
                sx={{
                    height: "600px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Typography>Loading map...</Typography>
            </Box>
        ),
    }
);

function MapPage() {
    const { t } = useLanguage();

    return (
        <Container maxWidth="lg" sx={{ py: 2 }}>
            <Box
                sx={{
                    position: "fixed",
                    top: { xs: "8px", sm: "16px" },
                    left: { xs: "8px", sm: "16px" },
                    zIndex: 9999,
                }}
            >
                <HomeButton component={Link} href="/" />
            </Box>
            <Box
                sx={{
                    position: "fixed",
                    top: { xs: "8px", sm: "16px" },
                    right: { xs: "8px", sm: "16px" },
                    zIndex: 9999,
                }}
            >
                <LanguageSwitcher />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{ width: "100%", textAlign: "center" }}
                >
                    {t("pages.map.title")}
                </Typography>

                <MapWrapper />
            </Box>
        </Container>
    );
}

export default MapPage;

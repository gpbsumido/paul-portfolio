"use client";

import { Box, Container, Typography } from "@mui/material";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import FantasyBasketballDropdownNav from "@/components/features/fantasy/FantasyBasketballDropdownNav";
import ErrorBoundary from "@/components/layout/ErrorBoundary";

export default function MatchupsPage() {
    const { t } = useLanguage();

    const renderContent = () => (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
            }}
        >
            <Typography variant="body1" color="text.secondary">
                {t("pages.fantasy.matchupsComingSoon")}
            </Typography>
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
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
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <FantasyBasketballDropdownNav />
                </Box>
                <ErrorBoundary>{renderContent()}</ErrorBoundary>
            </Box>
        </Container>
    );
}

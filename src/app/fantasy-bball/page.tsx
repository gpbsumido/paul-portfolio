"use client";

import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    Grid,
} from "@mui/material";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";

export default function FantasyBasketballPage() {
    const { t } = useLanguage();

    const subpages = [
        {
            title: "NBA Stats",
            description: "View player statistics and team information",
            href: "/fantasy-bball/nba-stats",
            icon: (
                <SportsBasketballIcon
                    sx={{ fontSize: 40, color: "primary.main" }}
                />
            ),
        },
        {
            title: "League",
            description: "View your fantasy league standings and rosters",
            href: "/fantasy-bball/league",
            icon: (
                <SportsBasketballIcon
                    sx={{ fontSize: 40, color: "primary.main" }}
                />
            ),
        },
        {
            title: "History",
            description: "View past seasons and historical data",
            href: "/fantasy-bball/history/2024",
            icon: (
                <SportsBasketballIcon
                    sx={{ fontSize: 40, color: "primary.main" }}
                />
            ),
        },
        {
            title: "Matchups",
            description: "View current and upcoming matchups",
            href: "/fantasy-bball/matchups",
            icon: (
                <SportsBasketballIcon
                    sx={{ fontSize: 40, color: "primary.main" }}
                />
            ),
        },
    ];

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
                    alignItems: "center",
                    gap: 4,
                    mt: 4,
                }}
            >
                <Box
                    sx={{
                        textAlign: "center",
                        mb: 4,
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h1"
                        fontWeight="bold"
                        gutterBottom
                    >
                        {t("pages.fantasy.title")}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {t("pages.fantasy.subtitle")}
                    </Typography>
                </Box>

                <Grid container spacing={3} sx={{ maxWidth: 1200 }}>
                    {subpages.map((page) => (
                        <Grid item xs={12} sm={6} key={page.href}>
                            <Card
                                sx={{
                                    height: "100%",
                                    transition:
                                        "transform 0.2s, box-shadow 0.2s",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: 6,
                                    },
                                }}
                            >
                                <CardActionArea
                                    component={Link}
                                    href={page.href}
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        p: 3,
                                    }}
                                >
                                    <Box sx={{ mb: 2 }}>{page.icon}</Box>
                                    <CardContent sx={{ textAlign: "center" }}>
                                        <Typography
                                            variant="h5"
                                            component="h2"
                                            gutterBottom
                                        >
                                            {page.title}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            color="text.secondary"
                                        >
                                            {page.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
}

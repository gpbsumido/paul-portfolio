"use client";

import { Box, Container, Typography } from "@mui/material";
import { useLanguage } from "@/contexts/LanguageContext";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import Link from "next/link";
import dynamic from "next/dynamic";

/**
 * The `MapPage` component renders a page with a dynamic map and additional UI elements.
 * It includes a home button, a language switcher, and a title fetched from the language context.
 * The map is loaded dynamically with server-side rendering disabled.
 *
 * @component
 * @returns {JSX.Element} The rendered map page component.
 *
 * @remarks
 * - The map is wrapped in a `MapWrapper` component, which is dynamically imported with a loading fallback.
 * - The `useLanguage` hook is used to fetch localized text for the page title.
 * - Material-UI components are used for layout and styling.
 *
 * @dependencies
 * - `@mui/material`: Provides UI components like `Box`, `Container`, and `Typography`.
 * - `next/dynamic`: Used for dynamic imports with server-side rendering disabled.
 * - `@/contexts/LanguageContext`: Provides the `useLanguage` hook for localization.
 * - `@/components/common/HomeButton`: A reusable home button component.
 * - `@/components/common/LanguageSwitcher`: A reusable language switcher component.
 * - `@/components/features/maps/MapWrapper`: The map wrapper component for rendering the map.
 *
 * @example
 * ```tsx
 * import MapPage from "@/app/maps/page";
 *
 * export default function App() {
 *   return <MapPage />;
 * }
 * ```
 */
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
        <Container maxWidth="lg" sx={{ py: 2, px: { xs: 0, sm: 2 }, flex: 1 }}>
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
                    mb: 5,
                    textAlign: "center",
                    color: "text.primary", // Ensures text is visible in dark mode
                }}
            >
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        color: "text.primary",
                        background: (theme) =>
                            `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {t("pages.maps.title")}
                </Typography>
                <Typography
                    variant="subtitle1"
                    sx={{
                        color: "text.secondary",
                        background: (theme) =>
                            `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {t("pages.maps.subtitle")}
                </Typography>
                <MapWrapper />
            </Box>
        </Container>
    );
}

export default MapPage;

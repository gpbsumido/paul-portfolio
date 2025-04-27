"use client";

import { usePathname } from "next/navigation";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import { useLanguage } from "@/contexts/LanguageContext";
import DropdownComponent from "@/components/shared/DropdownComponent";

/**
 * A React component that renders a dropdown navigation menu for the fantasy basketball feature.
 * It dynamically generates navigation items based on predefined subpages and highlights the current selection
 * based on the current pathname.
 *
 * @component
 * @returns {JSX.Element} The rendered dropdown navigation component.
 */
export default function FantasyBasketballDropdownNav() {
    const { t } = useLanguage();

    const pathname = usePathname();
    const currentYear = new Date().getFullYear();
    const subpages = [
        {
            key: "nbaStats",
            label: t("pages.fantasy.subpages.nbaStats"),
            href: "/fantasy-bball/nba-stats",
        },
        {
            key: "league",
            label: t("pages.fantasy.subpages.league"),
            href: "/fantasy-bball/league",
        },
        {
            key: "visualization",
            label: t("pages.fantasy.subpages.visualization"),
            href: "/fantasy-bball/visualization",
        },
        {
            key: "history",
            label: t("pages.fantasy.subpages.history"),
            href: `/fantasy-bball/history/${currentYear}`,
        },
        {
            key: "matchups",
            label: t("pages.fantasy.subpages.matchups"),
            href: "/fantasy-bball/matchups",
        },
    ];
    const currentSelected = subpages.find((page) => page.href === pathname)?.key;

    return (
        <DropdownComponent
            items={subpages.map((page) => ({
                key: page.key,
                label: t(`pages.fantasy.subpages.${page.key}`),
                value: page.href,
            }))}
            currentSelected={currentSelected}
            startIcon={<SportsBasketballIcon />}
            onChange={(value) => {
                window.location.href = value as string;
            }}
        />
    );
}

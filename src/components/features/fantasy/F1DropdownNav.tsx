"use client";

import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import { useLanguage } from "@/contexts/LanguageContext";
import DropdownComponent from "@/components/shared/DropdownComponent";
import { usePathname } from "next/navigation";

/**
 * A React component that renders a dropdown navigation menu for the Fantasy F1 section.
 * It utilizes a shared `DropdownComponent` and dynamically generates menu items
 * based on the `subpages` array. Each menu item is localized using the `useLanguage` context.
 *
 * @component
 * @returns {JSX.Element} The rendered dropdown navigation component.
 */
export default function F1DropdownNav() {
    const { t } = useLanguage();

    const pathname = usePathname();
    const subpages = [
        {
            key: "drivers",
            label: t("pages.fantasy.subpages.drivers"),
            href: "/fantasy-f1/drivers",
        },
        {
            key: "constructors",
            label: t("pages.fantasy.subpages.constructors"),
            href: "/fantasy-f1/constructors",
        },
        {
            key: "schedule",
            label: t("pages.fantasy.subpages.schedule"),
            href: "/fantasy-f1/schedule",
        },
        {
            key: "qualifying",
            label: t("pages.fantasy.subpages.qualifying"),
            href: `/fantasy-f1/qualifying`,
        },
        {
            key: "fantasy-scoring",
            label: t("pages.fantasy.subpages.fantasyScoring"),
            href: `/fantasy-f1/fantasy-scoring`,
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

import { Box } from "@mui/material";
import Link from "next/link";
import React from "react";

interface HoverableSectionProps {
    id: string;
    href: string;
    icon: React.ElementType;
    label: string;
    hoveredSection: string | null;
    setHoveredSection: React.Dispatch<React.SetStateAction<string | null>>;
}

export const HoverableSection: React.FC<HoverableSectionProps> = ({
    id,
    href,
    icon: Icon,
    label,
    hoveredSection,
    setHoveredSection,
}) => {
    return (
        <Box
            id={id}
            onMouseEnter={() => setHoveredSection(id)}
            onMouseLeave={() => setHoveredSection(null)}
            sx={{
                width: "100%",
                height: "33.33%",
                background: "white",
                color: "black",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                transition:
                    "background-color 0.5s ease-in-out, color 0.5s ease-in-out",
                cursor: "pointer",
                "&:hover": {
                    background: "black",
                    color: "white",
                },
                "@keyframes bounce": {
                    "0%, 20%, 50%, 80%, 100%": {
                        transform: "translateY(0)",
                    },
                    "40%": {
                        transform: "translateY(-10px)",
                    },
                    "60%": {
                        transform: "translateY(-5px)",
                    },
                },
            }}
        >
            <Link
                href={href}
                style={{
                    fontWeight: "normal",
                    transition:
                        "transform 0.3s ease-in-out, font-weight 0.3s ease-in-out",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    fontSize: "2rem",
                    textDecoration: "none",
                    color: "inherit",
                    padding: "2rem",
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                }}
            >
                <Icon
                    sx={{
                        fontSize: "4rem",
                        marginBottom: "0.5em",
                        opacity: hoveredSection === id ? 1 : 0.7,
                        transform:
                            hoveredSection === id ? "scale(1.1)" : "scale(1)",
                        transition:
                            "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
                        color: "inherit",
                        display: "block",
                        animation:
                            hoveredSection === id
                                ? "bounce 1s infinite"
                                : "none",
                    }}
                />
                <span
                    style={{
                        transition:
                            "transform 0.3s ease-in-out, font-weight 0.3s ease-in-out",
                        transform:
                            hoveredSection === id ? "scale(1.1)" : "scale(1)",
                        fontWeight: hoveredSection === id ? "bold" : "normal",
                    }}
                >
                    {label}
                </span>
            </Link>
        </Box>
    );
};

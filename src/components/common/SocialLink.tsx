"use client";

import React from "react";
import { SocialLinkProps } from "@/types/about";

/**
 * SocialLink component for displaying social media links
 * @component
 * @param {Object} props - Component props
 * @param {string} props.href - URL for the social link
 * @param {React.ElementType} props.icon - Icon component to display
 * @param {string} props.text - Text to display next to the icon
 * @returns {JSX.Element} Social link with icon and text
 */
export default function SocialLink({
    href,
    icon: Icon,
    text,
}: SocialLinkProps): React.ReactElement {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                fontSize: "1rem",
                gap: "0.5em",
                textDecoration: "none",
                color: "inherit",
                transition: "font-weight 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.fontWeight = "bold")}
            onMouseLeave={(e) => (e.currentTarget.style.fontWeight = "normal")}
        >
            <Icon />
            {text}
        </a>
    );
}

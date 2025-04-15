"use client";

import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import { HomeButtonProps } from "@/types/designs";

/**
 * HomeButton component for navigation
 * @component
 * @param {Object} props - Component props
 * @param {() => void} props.onClick - Click handler function
 * @param {string} props.textColor - Text color
 * @param {string} props.bgColor - Background color
 * @returns {JSX.Element} Home button with icon
 */
export default function HomeButton({
    onClick,
    textColor,
    bgColor,
}: HomeButtonProps): React.ReactElement {
    return (
        <button
            onClick={onClick}
            style={{
                padding: "10px",
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "1px solid",
                background: "black",
                color: "white",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderColor: "white",
            }}
        >
            <HomeIcon
                style={{
                    fontSize: "24px",
                    height: "24px",
                    width: "24px",
                    color: "white",
                }}
            />
        </button>
    );
}

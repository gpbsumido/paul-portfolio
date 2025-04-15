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
export default function HomeButton({ onClick, textColor, bgColor }: HomeButtonProps): React.ReactElement {
    return (
        <button
            onClick={onClick}
            style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                padding: "10px",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                border: "1px solid",
                background: textColor,
                color: bgColor,
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderColor: bgColor,
            }}
        >
            <HomeIcon
                style={{
                    fontSize: "24px",
                    height: "24px",
                    width: "24px",
                    color: bgColor,
                }}
            />
        </button>
    );
} 
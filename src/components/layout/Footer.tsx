import { Box, IconButton } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import EmailIcon from "@mui/icons-material/Email";
import React from "react";

/**
 * Footer component that displays social media and contact links
 * @component
 * @description A fixed footer component that contains links to LinkedIn, GitHub, and email
 * @returns {JSX.Element} Footer component with social media and contact icons
 */
export default function Footer(): React.ReactElement {
    return (
        <Box
            sx={{
                width: "100%",
                background: "#000", // Black background
                color: "#fff", // White text
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "16px",
                position: "fixed",
                bottom: 0,
                left: 0,
            }}
        >
            <IconButton
                href="https://www.linkedin.com/in/paulsumido/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "#fff", margin: "0 8px" }}
            >
                <LinkedInIcon />
            </IconButton>
            <IconButton
                href="https://github.com/gpbsumido"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "#fff", margin: "0 8px" }}
            >
                <GitHubIcon />
            </IconButton>
            <IconButton
                href="mailto:psumido@gmail.com"
                sx={{ color: "#fff", margin: "0 8px" }}
            >
                <EmailIcon />
            </IconButton>
        </Box>
    );
}

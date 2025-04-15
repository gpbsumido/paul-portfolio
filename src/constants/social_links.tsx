import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import MailIcon from "@mui/icons-material/Mail";
import React from "react";

export const SOCIAL_LINKS = [
    {
        href: "https://github.com/gpbsumido",
        label: "GitHub",
        icon: React.createElement(GitHubIcon),
        text: "@paulsumido",
    },
    {
        href: "https://www.linkedin.com/in/paulsumido/",
        label: "LinkedIn",
        icon: React.createElement(LinkedInIcon),
        text: "@gpbsumido",
    },
    {
        href: "mailto:psumido@gmail.com",
        label: "Email",
        icon: React.createElement(MailIcon),
        text: "psumido@gmail.com",
    },
];

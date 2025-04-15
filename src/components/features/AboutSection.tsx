"use client";

import { Box, Skeleton } from "@mui/material";
import React from "react";
import Image from "next/image";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import MailIcon from "@mui/icons-material/Mail";
import PaulImg from "@/assets/paul.jpeg";
import "@/app/globals.css";
import SocialLink from "@/components/common/SocialLink";

/**
 * AboutSection component displaying personal information and social links
 * @component
 * @description A section component that displays the author's image, about text, and social media links
 * @returns {JSX.Element} About section with image, text, and social links
 */
export default function AboutSection() {
    const [clicked, setClicked] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    const socialLinks = [
        {
            href: "https://www.linkedin.com/in/paulsumido/",
            icon: LinkedInIcon,
            text: "@paulsumido",
        },
        {
            href: "https://github.com/gpbsumido",
            icon: GitHubIcon,
            text: "@gpbsumido",
        },
        {
            href: "mailto:psumido@gmail.com",
            icon: MailIcon,
            text: "psumido@gmail.com",
        },
    ];

    React.useEffect(() => {
        // Preload the profile image
        const img = new window.Image();
        img.src = PaulImg.src;
        img.onload = () => setIsLoading(false);
        img.onerror = () => setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <Box
                sx={{
                    width: { xs: "100%", md: "50vw" },
                    height: { xs: "50vh", md: "100%" },
                    background: "white",
                    color: "black",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    transition: "all 0.6s ease",
                    fontSize: { xs: "1.5rem", md: "2rem" },
                }}
            >
                <Skeleton
                    variant="rectangular"
                    width="200px"
                    height="300px"
                    sx={{ bgcolor: "grey.800" }}
                />
                <Skeleton
                    variant="text"
                    width="150px"
                    height="40px"
                    sx={{ bgcolor: "grey.800", mt: 2 }}
                />
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5em",
                        mt: 2,
                    }}
                >
                    {socialLinks.map((_, index) => (
                        <Skeleton
                            key={index}
                            variant="text"
                            width="100px"
                            height="30px"
                            sx={{ bgcolor: "grey.800" }}
                        />
                    ))}
                </Box>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                width: { xs: "100%", md: "50vw" },
                height: { xs: "50vh", md: "100%" },
                background: "white",
                color: "black",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                transition: "all 0.6s ease",
                "&:hover": {
                    background: "black",
                    color: "white",
                },
                fontSize: { xs: "1.5rem", md: "2rem" },
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    height: { xs: "10em", md: "20em" },
                    aspectRatio: "9/13",
                }}
            >
                <Image
                    src={PaulImg}
                    fill
                    alt="Picture of the author"
                    style={{
                        objectFit: "cover",
                        zIndex: 100,
                        marginBottom: "2em",
                    }}
                />
            </Box>
            <div
                className={`about-text ${clicked ? "clicked" : ""}`}
                onClick={() => setClicked(true)}
            >
                About Paul
            </div>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2em",
                    marginTop: "0.5em",
                    width: "5em"
                }}
            >
                {socialLinks.map((link, index) => (
                    <SocialLink
                        key={index}
                        href={link.href}
                        icon={link.icon}
                        text={link.text}
                    />
                ))}
            </Box>
        </Box>
    );
}

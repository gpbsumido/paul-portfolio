"use client";

import { Box, Typography, Link, Skeleton } from "@mui/material";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import "@/app/globals.css";
import SocialLink from "@/components/common/SocialLink";
import { SOCIAL_LINKS } from "@/constants/social_links";
import paulImage from "../../assets/paul.jpeg";

interface SocialLink {
    href: string;
    label: string;
    icon: React.ReactNode;
}

/**
 * AboutSection component displaying personal information and social links
 * @description A section component that displays the author's image, about text, and social media links
 * @returns {JSX.Element} About section with image, text, and social links
 */
export const AboutSection = (): React.ReactElement => {
    const [isLoading, setIsLoading] = useState(true);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        const preloadImage = async () => {
            try {
                const img = new window.Image();
                img.src = paulImage.src;
                img.onload = () => setIsLoading(false);
                img.onerror = () => setIsLoading(false);
            } catch (error) {
                console.error("Error preloading image:", error);
                setIsLoading(false);
            }
        };

        preloadImage();
    }, []);

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    p: 3,
                }}
            >
                <Skeleton
                    variant="circular"
                    width={200}
                    height={200}
                    sx={{ bgcolor: "grey.800" }}
                />
                <Skeleton
                    variant="text"
                    width="80%"
                    height={40}
                    sx={{ bgcolor: "grey.800" }}
                />
                <Skeleton
                    variant="text"
                    width="60%"
                    height={20}
                    sx={{ bgcolor: "grey.800" }}
                />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                p: 3,
                width: "50%",
                height: "50vh",
                justifyContent: "center",
                "&:hover": {
                    color: "primary.main",
                    transition: "color 0.3s ease",
                },
                margin: "auto auto",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    height: { xs: "10em", md: "20em" },
                    aspectRatio: "9/13",
                    overflow: "hidden",
                    cursor: "pointer",
                    "&:focus": {
                        outline: "2px solid #fff",
                        outlineOffset: "2px",
                    },
                }}
                tabIndex={0}
                role="button"
                aria-label="Click to see a fun animation"
                onClick={() => setClicked(!clicked)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        setClicked(!clicked);
                    }
                }}
            >
                <Image
                    src={paulImage}
                    alt="Paul Sumido"
                    fill
                    style={{
                        objectFit: "cover",
                    }}
                    priority
                    sizes="(max-width: 768px) 10em, 20em"
                    quality={90}
                    placeholder="blur"
                />
            </Box>
            <Typography
                variant="h4"
                component="h1"
                sx={{
                    color: "white",
                    textAlign: "center",
                    "&:hover": {
                        color: "primary.main",
                        transition: "color 0.3s ease",
                    },
                }}
            >
                About Paul
            </Typography>
            <Typography
                variant="body1"
                sx={{
                    color: "white",
                    textAlign: "center",
                    maxWidth: "600px",
                    "&:hover": {
                        color: "primary.main",
                        transition: "color 0.3s ease",
                    },
                }}
            >
                I&apos;m a passionate developer and designer with a love for
                creating beautiful, functional experiences.
            </Typography>
            <Box
                sx={{
                    display: "flex",
                    gap: 2,
                    mt: 2,
                }}
                role="navigation"
                aria-label="Social media links"
            >
                {(SOCIAL_LINKS as SocialLink[]).map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                            color: "white",
                            "&:hover": {
                                color: "primary.main",
                                transition: "color 0.3s ease",
                            },
                            "&:focus": {
                                outline: "2px solid #fff",
                                outlineOffset: "2px",
                            },
                        }}
                        aria-label={`Visit my ${link.label} profile`}
                    >
                        {link.icon}
                    </Link>
                ))}
            </Box>
        </Box>
    );
};

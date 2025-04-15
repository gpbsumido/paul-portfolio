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

    // Base container styles that are shared between loading and loaded states
    const containerStyles = {
        width: { xs: "100%", md: "50%" },
        minHeight: { xs: "50vh", md: "100vh" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        p: 3,
        bgcolor: "background.default",
    };

    if (isLoading) {
        return (
            <Box sx={containerStyles}>
                <Skeleton
                    variant="rectangular"
                    sx={{
                        width: { xs: "10em", md: "20em" },
                        height: { xs: "15em", md: "30em" },
                        aspectRatio: "9/13",
                        bgcolor: "grey.800",
                        borderRadius: 2,
                    }}
                />
                <Skeleton
                    variant="text"
                    sx={{
                        width: "200px",
                        height: "40px",
                        bgcolor: "grey.800",
                    }}
                />
                <Skeleton
                    variant="text"
                    sx={{
                        width: "300px",
                        height: "24px",
                        bgcolor: "grey.800",
                    }}
                />
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,
                        mt: 2,
                    }}
                >
                    {[...Array(3)].map((_, index) => (
                        <Skeleton
                            key={index}
                            variant="circular"
                            width={40}
                            height={40}
                            sx={{ bgcolor: "grey.800" }}
                        />
                    ))}
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={containerStyles}>
            <Box
                sx={{
                    position: "relative",
                    width: { xs: "10em", md: "20em" },
                    aspectRatio: "9/13",
                    overflow: "hidden",
                    cursor: "pointer",
                    borderRadius: 2,
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

"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    useTheme,
    alpha,
} from "@mui/material";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { PostCard } from "@/components/features/social-media/PostCard";
import ErrorBoundary from "@/components/layout/ErrorBoundary";

interface Post {
    id: number;
    user: {
        username: string;
        avatarUrl: string;
    };
    content: string;
    timestamp: string;
    link?: string;
    thumbnail?: string;
    type: "default" | "youtube";
}

const SocialMediaPage = () => {
    const staticPosts: Post[] = [];

    const hasFetched = useRef(false);
    const [posts, setPosts] = useState(staticPosts);

    const channel_ids = [
        "UCqbXZNwruZZU7lrDH-NaNfw", // Karen channel ID
        "UC4G10tk3AHFuyMIuD3rHOBA", // RDC World channel ID
    ];

    useEffect(() => {
        const fetchYouTubeVideos = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;

            try {
                console.log("Fetching YouTube videos...");
                const allVideoPosts: Post[] = [];

                for (const channel_id of channel_ids) {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/youtube/recent?channel_id=${channel_id}`
                    );
                    const data = await response.json();
                    console.log(`Data for channel ${channel_id}:`, data);

                    const videoPosts = data.map((video: any) => ({
                        id: video.id,
                        user: {
                            username: "Channel Name", // Replace with actual channel name if available
                            avatarUrl: "https://via.placeholder.com/150", // Replace with actual avatar URL if available
                        },
                        content: video.title,
                        timestamp: new Date(video.published).toISOString(),
                        link: video.link,
                        thumbnail: video.thumbnail,
                        type: "youtube",
                    }));

                    allVideoPosts.push(...videoPosts);
                }

                console.log("All video posts:", allVideoPosts);
                setPosts((prevPosts) => {
                    const combinedPosts = [...prevPosts, ...allVideoPosts];
                    return combinedPosts.sort(
                        (a, b) =>
                            new Date(b.timestamp).getTime() -
                            new Date(a.timestamp).getTime()
                    );
                });
            } catch (error) {
                console.error("Error fetching YouTube videos:", error);
            }
        };

        fetchYouTubeVideos();
    }, []);

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    position: "fixed",
                    top: { xs: "8px", sm: "16px" },
                    left: { xs: "8px", sm: "16px" },
                    zIndex: 9999,
                }}
            >
                <HomeButton component={Link} href="/" />
            </Box>
            <Box
                sx={{
                    position: "fixed",
                    top: { xs: "8px", sm: "16px" },
                    right: { xs: "8px", sm: "16px" },
                    zIndex: 9999,
                }}
            >
                <LanguageSwitcher />
            </Box>

            <ErrorBoundary>
                <Typography variant="h4" align="center" gutterBottom>
                    Social Media Timeline
                </Typography>
                <Box display="flex" flexDirection="column" gap={2} sx={{ pb: 2 }}>
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            user={post.user}
                            content={post.content}
                            timestamp={post.timestamp}
                            link={post.link} // Pass link if PostCard supports it
                            thumbnail={post.thumbnail} // Pass thumbnail if PostCard supports it
                            type={post.type} // Pass the type property
                        />
                    ))}
                </Box>
            </ErrorBoundary>
        </Container>
    );
};

export default SocialMediaPage;

"use client";

import { useEffect, useState } from "react";
import { Box, Container, Typography, Paper, Button, CircularProgress } from "@mui/material";
import { useLanguage } from "@/contexts/LanguageContext";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import Link from "next/link";

interface PostMedical {
    id: number;
    title: string;
    text: string;
    username: string;
}

export default function MedicalPage() {
    const { t } = useLanguage();
    const [posts, setPosts] = useState<PostMedical[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/postmedical`);
                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <Container maxWidth="lg" sx={{ py: 2, pt: { xs: 8, sm: 12 } }}>
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

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {t("pages.medical.title")}
                    </Typography>
                    <Button
                        component={Link}
                        href="/medical/create"
                        variant="contained"
                        color="primary"
                    >
                        {t("pages.medical.createPost")}
                    </Button>
                </Box>

                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                        <Typography color="error">{error}</Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {posts.map((post) => (
                            <Paper
                                key={post.id}
                                elevation={2}
                                sx={{
                                    p: 3,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1,
                                }}
                            >
                                <Typography variant="h6" component="h2">
                                    {post.title}
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    color="text.secondary"
                                    sx={{ whiteSpace: "pre-line" }}
                                >
                                    {post.text}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Posted by: {post.username}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                )}
            </Box>
        </Container>
    );
}

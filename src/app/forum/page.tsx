"use client";

import { useEffect, useState } from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    CircularProgress,
    Modal,
    TextField,
    Fab,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useLanguage } from "@/contexts/LanguageContext";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import Link from "next/link";

interface PostForum {
    id: number;
    title: string;
    text: string;
    username: string;
}

export default function ForumPage() {
    const { t } = useLanguage();
    const [posts, setPosts] = useState<PostForum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPost, setNewPost] = useState({
        title: "",
        text: "",
        username: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/postforum`
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }
                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "An error occurred"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPost((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/postforum`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newPost),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to create post");
            }
            const createdPost = await response.json();
            setPosts((prev) => [createdPost, ...prev]);
            setNewPost({ title: "", text: "", username: "" });
            handleCloseModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
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

            <Box sx={{ mb: 5 }}>
                <Typography
                    variant="h4"
                    component="h1"
                    align="center"
                    gutterBottom
                    tabIndex={0}
                >
                    {t("pages.forum.title")}
                </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {loading ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="400px"
                    >
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="400px"
                    >
                        <Typography color="error">{error}</Typography>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                    >
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
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    Posted by: {post.username}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                )}
            </Box>

            <Fab
                color="primary"
                aria-label="add"
                onClick={handleOpenModal}
                sx={{
                    position: "fixed",
                    bottom: { xs: "16px", sm: "32px" },
                    right: { xs: "16px", sm: "32px" },
                    zIndex: 9999,
                    bgcolor: (theme) =>
                        theme.palette.mode === "dark" ? "black" : "white",
                    color: (theme) =>
                        theme.palette.mode === "dark" ? "white" : "black",
                    border: "2px solid",
                    borderColor: (theme) =>
                        theme.palette.mode === "dark" ? "white" : "black",
                    "&:hover": {
                        bgcolor: (theme) =>
                            theme.palette.mode === "dark"
                                ? "grey.800"
                                : "grey.300",
                    },
                }}
            >
                <AddIcon />
            </Fab>

            {/* Create Post Modal */}
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90%", sm: "400px" },
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                    }}
                >
                    <Typography variant="h6" component="h2">
                        {t("pages.forum.createPost")}
                    </Typography>
                    <TextField
                        label={t("pages.forum.newPostTitle")}
                        name="title"
                        value={newPost.title}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <TextField
                        label={t("pages.forum.text")}
                        name="text"
                        value={newPost.text}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={4}
                    />
                    <TextField
                        label={t("pages.forum.username")}
                        name="username"
                        value={newPost.username}
                        onChange={handleInputChange}
                        fullWidth
                    />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                        }}
                    >
                        <Button
                            onClick={handleCloseModal}
                            color="secondary"
                            variant="outlined"
                        >
                            {t("pages.forum.cancel")}
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            color="primary"
                            variant="contained"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <CircularProgress size={24} />
                            ) : (
                                t("pages.forum.submit")
                            )}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Container>
    );
}

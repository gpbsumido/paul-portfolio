"use client";

import { useEffect, useState, useRef } from "react";
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
    Divider,
    Avatar,
    Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useLanguage } from "@/contexts/LanguageContext";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import Link from "next/link";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import FloatingPill from "@/components/shared/FloatingPill";
import { useAuth0 } from "@auth0/auth0-react";
import ReusableModal from "@/components/common/ReusableModal";
import { Editor } from "@tinymce/tinymce-react";
import ErrorBoundary from "@/components/layout/ErrorBoundary";

interface PostForum {
    id: number;
    title: string;
    text: string;
    username: string;
}

export default function ForumPage() {
    const { t } = useLanguage();
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
        useAuth0();
    const [posts, setPosts] = useState<PostForum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostUsername, setNewPostUsername] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Highlight,
            Image,
        ],
        content: "",
    });

    const editorRef = useRef<any>(null);

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
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewPostTitle("");
        setNewPostUsername("");
        editor?.commands.setContent("");
    };

    const handleSubmit = async () => {
        if (!editor) return;
        setIsSubmitting(true);
        try {
            const rawHtml = editor.getHTML();
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/postforum`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: newPostTitle,
                        text: rawHtml,
                        username:
                            isAuthenticated && user?.name
                                ? user.name
                                : "Anonymous",
                    }),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to create post");
            }
            const createdPost = await response.json();
            setPosts((prev) => [createdPost, ...prev]);
            handleCloseModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    function isHtmlEmpty() {
        const html = editor?.getHTML()?.trim() || "";
        return /^<p>\s*<\/p>$/.test(html);
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, py: 4 }}>
            <FloatingPill hide={isModalOpen} />

            {/* Fixed Buttons */}
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
                {/* Page Title */}
                <Box
                    sx={{
                        mb: 5,
                        textAlign: "center",
                        background: (theme) =>
                            `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{ fontWeight: 700 }}
                    >
                        {t("pages.forum.title")}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{ color: "text.secondary" }}
                    >
                        {t("pages.forum.subtitle")}
                    </Typography>
                </Box>

                {/* Posts Section */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        backgroundColor: (theme) =>
                            theme.palette.mode === "dark"
                                ? "grey.900"
                                : "grey.100",
                        p: 3,
                        borderRadius: 2,
                        boxShadow: (theme) => theme.shadows[3],
                    }}
                >
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
                        posts.map((post) => (
                            <Paper
                                key={post.id}
                                elevation={3}
                                sx={{
                                    p: 3,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    borderRadius: 2,
                                    transition: "transform 0.2s",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: (theme) => theme.shadows[6],
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: (theme) =>
                                                theme.palette.primary.main,
                                        }}
                                    >
                                        {post.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                    <Typography variant="h6" component="h2">
                                        {post.title}
                                    </Typography>
                                </Box>
                                <Divider />
                                <Box
                                    sx={{
                                        color: "text.secondary",
                                        "& p": { mb: 1 },
                                        "& h1, & h2, & h3": { mt: 2, mb: 1 },
                                    }}
                                >
                                    {parse(DOMPurify.sanitize(post.text))}
                                </Box>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ alignSelf: "flex-end" }}
                                >
                                    {t("pages.forum.postedBy")}: {post.username}
                                </Typography>
                            </Paper>
                        ))
                    )}
                </Box>

                {/* Floating Action Button */}
                <Fab
                    color="primary"
                    aria-label="add"
                    onClick={handleOpenModal}
                    sx={{
                        position: "fixed",
                        bottom: { xs: "16px", sm: "32px" },
                        right: { xs: "16px", sm: "32px" },
                        display: isModalOpen ? "none" : "flex",
                    }}
                >
                    <AddIcon />
                </Fab>

                {/* Create Post Modal */}
                <ReusableModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    title={t("pages.forum.createPost")}
                    confirmColor="primary"
                    onConfirm={handleSubmit}
                    confirmText={t("pages.forum.createPost")}
                    cancelText={t("pages.forum.cancel")}
                    cancelColor="secondary"
                    titleColor="primary.main"
                    isConfirmDisabled={
                        !newPostTitle ||
                        !editor?.getHTML() ||
                        isHtmlEmpty() ||
                        isSubmitting
                    }
                    children={
                        <>
                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={{ mb: 1, color: "text.secondary" }}
                                >
                                    {t("pages.forum.newPostTitle")}
                                </Typography>
                                <TextField
                                    name="title"
                                    value={newPostTitle}
                                    onChange={(e) =>
                                        setNewPostTitle(e.target.value)
                                    }
                                    fullWidth
                                    variant="outlined"
                                />
                            </Box>
                            <Box sx={{ mt: 3 }}>
                                <Typography
                                    variant="body2"
                                    sx={{ mb: 1, color: "text.secondary" }}
                                >
                                    {t("pages.forum.newPostContent")}
                                </Typography>
                                <Editor
                                    apiKey="your-tinymce-api-key"
                                    onInit={(evt: any, editor: any) =>
                                        (editorRef.current = editor)
                                    }
                                    initialValue=""
                                    init={{
                                        height: 300,
                                        menubar: false,
                                        plugins: [
                                            "advlist",
                                            "autolink",
                                            "lists",
                                            "link",
                                            "image",
                                            "charmap",
                                            "preview",
                                            "anchor",
                                            "searchreplace",
                                            "visualblocks",
                                            "code",
                                            "fullscreen",
                                            "insertdatetime",
                                            "media",
                                            "table",
                                            "code",
                                            "help",
                                            "wordcount",
                                        ],
                                        toolbar:
                                            "undo redo | blocks | " +
                                            "bold italic forecolor | alignleft aligncenter " +
                                            "alignright alignjustify | bullist numlist outdent indent | " +
                                            "removeformat | help",
                                        content_style:
                                            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                    }}
                                />
                            </Box>
                        </>
                    }
                />
            </ErrorBoundary>
        </Container>
    );
}

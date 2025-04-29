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
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import DOMPurify from "dompurify";
import parse from "html-react-parser"; // 👈 Add this at the top

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
            Image, // Add the image extension
        ],
        content: "",
    });

    const MenuBar = ({ editor }: { editor: any }) => {
        if (!editor) return null;

        const buttons = [
            {
                label: "H1",
                command: (editor: any) =>
                    editor.chain().toggleHeading({ level: 1 }),
                isActive: () => editor.isActive("heading", { level: 1 }),
            },
            {
                label: "H2",
                command: (editor: any) =>
                    editor.chain().toggleHeading({ level: 2 }),
                isActive: () => editor.isActive("heading", { level: 2 }),
            },
            {
                label: "H3",
                command: (editor: any) =>
                    editor.chain().toggleHeading({ level: 3 }),
                isActive: () => editor.isActive("heading", { level: 3 }),
            },
            {
                label: "Paragraph",
                command: (editor: any) => editor.chain().setParagraph(),
                isActive: () => editor.isActive("paragraph"),
            },
            {
                label: "Bold",
                command: (editor: any) => editor.chain().toggleBold(),
                isActive: () => editor.isActive("bold"),
            },
            {
                label: "Italic",
                command: (editor: any) => editor.chain().toggleItalic(),
                isActive: () => editor.isActive("italic"),
            },
            {
                label: "Strike",
                command: (editor: any) => editor.chain().toggleStrike(),
                isActive: () => editor.isActive("strike"),
            },
            {
                label: "Highlight",
                command: (editor: any) => editor.chain().toggleHighlight(),
                isActive: () => editor.isActive("highlight"),
            },
            {
                label: "Left",
                command: (editor: any) => editor.chain().setTextAlign("left"),
                isActive: () => editor.isActive({ textAlign: "left" }),
            },
            {
                label: "Center",
                command: (editor: any) => editor.chain().setTextAlign("center"),
                isActive: () => editor.isActive({ textAlign: "center" }),
            },
            {
                label: "Right",
                command: (editor: any) => editor.chain().setTextAlign("right"),
                isActive: () => editor.isActive({ textAlign: "right" }),
            },
            {
                label: "Justify",
                command: (editor: any) =>
                    editor.chain().setTextAlign("justify"),
                isActive: () => editor.isActive({ textAlign: "justify" }),
            },
        ];

        const handleButtonMouseDown =
            (commandFn: (editor: any) => any) => (event: React.MouseEvent) => {
                event.preventDefault();
                commandFn(editor).run();
            };

        return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {buttons.map(({ label, command, isActive }) => (
                    <Button
                        key={label}
                        onMouseDown={handleButtonMouseDown(command)}
                        variant={isActive() ? "contained" : "outlined"}
                        size="small"
                    >
                        {label}
                    </Button>
                ))}
            </Box>
        );
    };

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
        editor?.commands.setContent(""); // Clear the TipTap editor content
    };

    const handleSubmit = async () => {
        if (!editor) return;
        setIsSubmitting(true);
        try {
            // Get the raw HTML from the editor
            const rawHtml = editor.getHTML();

            // Parse the HTML string into a real DOM
            const parser = new DOMParser();
            const doc = parser.parseFromString(rawHtml, "text/html");

            // Remove all <img> elements
            const images = doc.querySelectorAll("img");
            images.forEach((img) => img.remove());

            // (Optional) Also remove empty <p> or <figure> tags left behind
            doc.querySelectorAll("p, figure").forEach((el) => {
                if (el.textContent?.trim() === "") {
                    el.remove();
                }
            });

            // Get the cleaned HTML
            const cleanedHtml = doc.body.innerHTML;

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/postforum`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: newPostTitle,
                        text: cleanedHtml, // Use cleaned version
                        username: newPostUsername,
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

    const handleDrop = (event: React.DragEvent) => {
        // Prevent default behavior to allow for dropping images
        event.preventDefault();

        // Check if the dropped file is an image
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = () => {
                const imageUrl = reader.result as string;
                // Insert the image into the editor at the cursor position
                editor?.chain().focus().setImage({ src: imageUrl }).run();
            };

            reader.readAsDataURL(file);
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
                    posts.map((post) => (
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
                            <Box
                                sx={{
                                    color: "text.secondary",
                                    "& p": { mb: 1 },
                                    "& h1, & h2, & h3": { mt: 2, mb: 1 },
                                }}
                            >
                                {parse(DOMPurify.sanitize(post.text))}
                            </Box>

                            <Typography variant="caption" color="text.secondary">
                                Posted by: {post.username}
                            </Typography>
                        </Paper>
                    ))
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
                        width: { xs: "90%", sm: "lg" },
                        maxHeight: "80vh",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        overflowY: "auto", // Allow scrolling if content overflows
                    }}
                >
                    <Typography variant="h6" component="h2">
                        {t("pages.forum.createPost")}
                    </Typography>

                    <TextField
                        label={t("pages.forum.newPostTitle")}
                        name="title"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        fullWidth
                    />

                    <MenuBar editor={editor} />
                    <Box
                        id="ProseMirrorDiv"
                        sx={{
                            border: "1px solid",
                            borderColor: "grey.400",
                            borderRadius: 1,
                            p: 1,
                            display: "flex", // Flexbox container
                            flexDirection: "column", // Stack children vertically
                            height: "auto", // Fixed height for the container
                            overflow: "hidden", // Hide overflow on Box
                            minHeight: "150px", // Ensure that it always has a minimum height
                            flexGrow: 1, // Allow the editor to grow
                        }}
                        onDrop={handleDrop} // Add drag-and-drop handler
                        onDragOver={(event) => event.preventDefault()} // Allow drop by preventing the default action
                    >
                        <EditorContent editor={editor} />
                    </Box>

                    <TextField
                        label={t("pages.forum.username")}
                        name="username"
                        value={newPostUsername}
                        onChange={(e) => setNewPostUsername(e.target.value)}
                        fullWidth
                    />

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ flexGrow: 1 }}
                        >
                            Disclaimer: You can drag images into the editor, but
                            they won't be saved due to storage costs.
                        </Typography>
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

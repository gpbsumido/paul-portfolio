"use client";

import { useState } from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    CircularProgress,
} from "@mui/material";
import { useLanguage } from "@/contexts/LanguageContext";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateMedicalPost() {
    const { t } = useLanguage();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        text: "",
        username: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/postmedical`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create post");
            }

            // Redirect to the main medical page after successful creation
            router.push("/medical");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Container maxWidth="lg" sx={{ py: 2 }}>
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
                <Typography
                    variant="h4"
                    component="h1"
                    align="center"
                    gutterBottom
                >
                    {t("pages.medical.createTitle")}
                </Typography>

                <Paper elevation={2} sx={{ p: 3 }}>
                    <form onSubmit={handleSubmit}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                            }}
                        >
                            <TextField
                                required
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                required
                                label="Content"
                                name="text"
                                value={formData.text}
                                onChange={handleChange}
                                multiline
                                rows={4}
                                fullWidth
                            />
                            <TextField
                                required
                                label="Your Name"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                fullWidth
                            />
                            {error && (
                                <Typography color="error" align="center">
                                    {error}
                                </Typography>
                            )}
                            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                                <Button
                                    component={Link}
                                    href="/medical"
                                    variant="outlined"
                                    color="primary"
                                    fullWidth
                                >
                                    Back
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    fullWidth
                                >
                                    {loading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        "Create Post"
                                    )}
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
}

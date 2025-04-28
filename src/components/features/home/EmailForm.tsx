"use client";

import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Card,
    CardContent,
    useTheme,
    InputLabel,
} from "@mui/material";

/**
 * EmailForm component for sending emails
 * @component
 * @description A form component that allows users to send emails through the default mail client
 * @returns {JSX.Element} Email form with fields for email, subject, and body
 */
export default function EmailForm() {
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const theme = useTheme();

    /**
     * Handles form submission by creating a mailto link
     * @description Creates a mailto link with the form data and redirects to it
     */
    const handleSubmit = (e: React.FormEvent): void => {
        e.preventDefault();
        const mailtoLink = `mailto:psumido@gmail.com?from=${encodeURIComponent(
            email
        )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };

    return (
        <Card
            elevation={3}
            sx={{
                margin: "0 auto",
                p: 2,
                borderRadius: 2,
                maxWidth: "lg",
                width: `100%`,
                boxShadow:
                    theme.palette.mode === "dark"
                        ? "0 4px 20px rgba(0, 0, 0, 0.5)"
                        : "0 4px 20px rgba(0, 0, 0, 0.1)",
            }}
        >
            <CardContent>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <Box>
                        <InputLabel shrink>Your Email</InputLabel>
                        <TextField
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            fullWidth
                            variant="outlined"
                        />
                    </Box>
                    <Box>
                        <InputLabel shrink>Subject</InputLabel>
                        <TextField
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            fullWidth
                            variant="outlined"
                        />
                    </Box>
                    <Box>
                        <InputLabel shrink>Body</InputLabel>
                        <TextField
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            required
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                        />
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{
                            padding: "10px 16px",
                            textTransform: "none",
                            fontWeight: "bold",
                        }}
                    >
                        Send Email
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}

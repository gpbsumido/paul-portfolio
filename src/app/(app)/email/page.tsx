"use client";

import EmailForm from "@/components/features/home/EmailForm";
import { useRouter } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import { Box, IconButton, Typography } from "@mui/material";
import React from "react";

/**
 * EmailPage component - Contact form page
 * @component
 * @description A page component that displays the email contact form with a home navigation button
 * @returns {JSX.Element} Email contact page with form and navigation
 */
export default function EmailPage(): React.ReactElement {
    const router = useRouter();

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                padding: "20px",
                position: "relative",
            }}
        >
            <IconButton
                onClick={() => router.push("/")}
                sx={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    width: "50px",
                    height: "50px",
                    border: "1px solid black",
                    bgcolor: "white",
                    color: "black",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        bgcolor: "black",
                        color: "white",
                    },
                }}
            >
                <HomeIcon />
            </IconButton>

            <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
                Send Me an Email!
            </Typography>

            <EmailForm />
        </Box>
    );
}

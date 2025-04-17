"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Box, Typography, Button } from "@mui/material";
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: "400px",
                        gap: 2,
                        p: 3,
                    }}
                >
                    <SentimentVeryDissatisfiedIcon 
                        sx={{ 
                            fontSize: 80,
                            color: "error.main",
                            animation: "shake 0.5s ease-in-out infinite",
                            "@keyframes shake": {
                                "0%, 100%": { transform: "rotate(0deg)" },
                                "25%": { transform: "rotate(-10deg)" },
                                "75%": { transform: "rotate(10deg)" }
                            }
                        }} 
                    />
                    <Typography variant="h5" component="h2" align="center">
                        Oops! Something went wrong
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center">
                        {this.state.error?.message || "An unexpected error occurred"}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.location.reload()}
                        sx={{ mt: 2 }}
                    >
                        Try Again
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
} 
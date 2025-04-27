"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";

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
        error: null,
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
                <Paper
                    elevation={3}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 300,
                        p: 4,
                        backgroundColor: "background.default",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        m: 10
                    }}
                >
                    <Box textAlign="center">
                        <Typography
                            variant="h4"
                            color="error"
                            fontWeight="bold"
                            gutterBottom
                        >
                            Oops! Something went wrong.
                        </Typography>
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            gutterBottom
                        >
                            {this.state.error?.message || "An unexpected error occurred."}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                                this.setState({ hasError: false, error: null })
                            }
                            sx={{ mt: 2 }}
                        >
                            Try Again
                        </Button>
                    </Box>
                </Paper>
            );
        }

        return this.props.children;
    }
}

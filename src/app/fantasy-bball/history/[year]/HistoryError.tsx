"use client";

import { Box, Typography, Button, Stack } from "@mui/material";
import { useRouter } from "next/navigation";

export default function HistoryError({ year }: { year: string }) {
    const router = useRouter();

    return (
        <Box
            id="history-error"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                px: 4,
                py: 8,
                backgroundColor: "background.default",
                color: "text.primary",
            }}
        >
            <Box
                sx={{
                    backgroundColor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                    color: "text.primary",
                    px: 6,
                    py: 8,
                    borderRadius: 3,
                    boxShadow: 4,
                    maxWidth: 450,
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{ mb: 3, fontWeight: "bold" }}
                >
                    League History - {year}
                </Typography>
                <Typography
                    variant="h6"
                    component="h2"
                    sx={{ mb: 2, fontWeight: "medium" }}
                >
                    Oops! Something went wrong.
                </Typography>
                <Typography variant="body1" sx={{ mb: 4 }}>
                    Unable to fetch league history for {year}. Please try again
                    later.
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.location.reload()}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: "medium",
                            fontSize: "1rem",
                            "&:hover": {
                                backgroundColor: "primary.dark",
                            },
                        }}
                    >
                        Retry
                    </Button>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => router.push("/fantasy-bball")}
                        sx={{
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: "medium",
                            fontSize: "1rem",
                        }}
                    >
                        Go Back
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}

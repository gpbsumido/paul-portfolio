import React from "react";
import {
    Box,
    Button,
    Modal,
    Typography,
    CircularProgress,
} from "@mui/material";

interface ReusableModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    isConfirmDisabled?: boolean;
    loading?: boolean;
    children?: React.ReactNode;
    confirmColor?: string;
    cancelColor?: string;
    titleColor?: string;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isConfirmDisabled = false,
    loading = false,
    children,
    confirmColor = "primary",
    cancelColor = "secondary",
    titleColor = "text.primary",
}) => {
    return (
        <Modal
            open={open}
            onClose={loading ? undefined : onClose}
            aria-labelledby="reusable-modal-title"
            sx={{
                zIndex: (theme) => theme.zIndex.fab + 2, // Ensure modal is above any MUI FAB
            }}
        >
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
                    gap: 3,
                    zIndex: (theme) => theme.zIndex.fab + 2, // Ensure modal is above any MUI FAB
                }}
            >
                <Typography
                    variant="h6"
                    component="h2"
                    id="upload-modal-title"
                    sx={{
                        fontWeight: "bold",
                        color: titleColor || "primary.main",
                        mb: 1,
                        fontSize: "1.5rem",
                        mx: "auto",
                    }}
                >
                    {title}
                </Typography>
                {description && (
                    <Typography variant="body2" sx={{ textAlign: "center" }}>
                        {description}
                    </Typography>
                )}
                {children}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                    }}
                >
                    <Button
                        onClick={onClose}
                        color="secondary"
                        variant="outlined"
                        disabled={loading}
                        sx={{
                            borderRadius: 50,
                            textTransform: "none",
                            px: 3,
                            borderColor: "divider",
                            color: cancelColor,
                            "&:hover": {
                                borderColor: "text.secondary",
                                bgcolor: "action.hover",
                            },
                        }}
                    >
                        {cancelText}
                    </Button>
                    {onConfirm && (
                        <Button
                            onClick={onConfirm}
                            color="primary"
                            variant="contained"
                            disabled={isConfirmDisabled || loading}
                            sx={{
                                borderRadius: 50,
                                textTransform: "none",
                                px: 3,
                                bgcolor: confirmColor,
                                boxShadow: "0px 4px 10px rgba(255, 0, 0, 0.2)",
                                "&:hover": {
                                    boxShadow:
                                        "0px 6px 14px rgba(255, 0, 0, 0.3)",
                                },
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                confirmText
                            )}
                        </Button>
                    )}
                </Box>
            </Box>
        </Modal>
    );
};

export default ReusableModal;

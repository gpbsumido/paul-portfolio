import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import SaveIcon from "@mui/icons-material/Save";
import { useState, useEffect } from "react";
import { ROTATIONS } from "@/constants/medical-journal";
import { Feedback, LearningEntry } from "@/types/medical-journal";

interface FeedbackDialogProps {
    open: boolean;
    onClose: () => void;
    selectedFeedback: Feedback | null;
    currentEntry: LearningEntry;
    onSave: (
        text: string,
        rotation: string,
        journalEntryId?: string
    ) => Promise<void>;
}

export default function FeedbackDialog({
    open,
    onClose,
    selectedFeedback,
    currentEntry,
    onSave,
}: FeedbackDialogProps) {
    const theme = useTheme();
    const [localFeedback, setLocalFeedback] = useState({
        text: "",
        rotation: "",
        journalEntryId: "",
    });

    useEffect(() => {
        if (selectedFeedback) {
            setLocalFeedback({
                text: selectedFeedback.text,
                rotation: selectedFeedback.rotation,
                journalEntryId:
                    selectedFeedback.journal_entry_id || currentEntry.id,
            });
        } else {
            setLocalFeedback({
                text: "",
                rotation: currentEntry.rotation,
                journalEntryId: currentEntry.id,
            });
        }
    }, [selectedFeedback?.id, currentEntry.id, currentEntry.rotation]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await onSave(
                localFeedback.text,
                localFeedback.rotation,
                localFeedback.journalEntryId
            );
            onClose();
        } catch (error) {
            console.error("Error saving feedback:", error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: "hidden",
                },
            }}
        >
            <DialogTitle
                component="div"
                sx={{
                    background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                    py: 2,
                    mb: 2,
                }}
            >
                <Typography
                    variant="h6"
                    component="h3"
                    sx={{ fontWeight: 600 }}
                >
                    {selectedFeedback ? "Edit Feedback" : "Add Feedback"}
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500 }}
                        >
                            Feedback
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={localFeedback.text}
                            onChange={(e) => {
                                setLocalFeedback((prev) => ({
                                    ...prev,
                                    text: e.target.value,
                                }));
                            }}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && e.ctrlKey) {
                                    handleSubmit(e);
                                }
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500 }}
                        >
                            Rotation
                        </Typography>
                        <FormControl fullWidth>
                            <Select
                                value={localFeedback.rotation}
                                onChange={(e) => {
                                    setLocalFeedback((prev) => ({
                                        ...prev,
                                        rotation: e.target.value,
                                    }));
                                }}
                            >
                                {ROTATIONS.sort().map((rotation) => (
                                    <MenuItem key={rotation} value={rotation}>
                                        {rotation}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions
                sx={{
                    p: 3,
                    background: alpha(theme.palette.background.default, 0.5),
                }}
            >
                <Button
                    onClick={onClose}
                    sx={{
                        textTransform: "none",
                        fontWeight: 500,
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    sx={{
                        textTransform: "none",
                        fontWeight: 500,
                        px: 3,
                        borderRadius: 2,
                    }}
                >
                    {selectedFeedback ? "Update" : "Add"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

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
} from "@mui/material";
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
            disableRestoreFocus
        >
            <div>
                <DialogTitle>
                    {selectedFeedback ? "Edit Feedback" : "Add Feedback"}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Feedback"
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
                            <FormControl fullWidth>
                                <InputLabel>Rotation</InputLabel>
                                <Select
                                    value={localFeedback.rotation}
                                    onChange={(e) => {
                                        setLocalFeedback((prev) => ({
                                            ...prev,
                                            rotation: e.target.value,
                                        }));
                                    }}
                                    label="Rotation"
                                >
                                    {ROTATIONS.map((rotation) => (
                                        <MenuItem
                                            key={rotation}
                                            value={rotation}
                                        >
                                            {rotation}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        variant="contained"
                        color="primary"
                    >
                        {selectedFeedback?.id ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
    );
} 
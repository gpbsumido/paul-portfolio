import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    FormControl,
    Select,
    MenuItem,
    Typography,
    Box,
    Chip,
    OutlinedInput,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import SaveIcon from "@mui/icons-material/Save";
import { LearningEntry } from "@/types/medical-journal";
import {
    CANMEDS_ROLES,
    LEARNING_OBJECTIVES_DROPDOWN,
    LOCATIONS,
    ROTATIONS,
} from "@/constants/medical-journal";
import { useLanguage } from "@/contexts/LanguageContext";

interface JournalEntryDialogProps {
    open: boolean;
    onClose: () => void;
    editingEntry: string | null;
    currentEntry: LearningEntry;
    errors: Partial<Record<keyof LearningEntry, boolean>>;
    onInputChange: (field: keyof LearningEntry, value: any) => void;
    onSave: () => void;
}

const getCanMEDSColor = (role: string) => {
    const colors: Record<string, string> = {
        "Medical Expert": "#4CAF50",
        Scholar: "#2196F3",
        Communicator: "#9C27B0",
        Professional: "#FF9800",
        Leader: "#E91E63",
        "Health Advocate": "#00BCD4",
        Collaborator: "#795548",
    };
    return colors[role] || "#000000";
};

export default function JournalEntryDialog({
    open,
    onClose,
    editingEntry,
    currentEntry,
    errors,
    onInputChange,
    onSave,
}: JournalEntryDialogProps) {
    const theme = useTheme();
    const { t } = useLanguage();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            disableRestoreFocus
            disableAutoFocus
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
                    {editingEntry
                        ? t("medicalJournal.editEntryTitle")
                        : t("medicalJournal.addNewEntryTitle")}
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500 }}
                        >
                            {t("medicalJournal.dateLabel")}
                        </Typography>
                        <TextField
                            fullWidth
                            type="date"
                            value={currentEntry.date}
                            onChange={(e) =>
                                onInputChange("date", e.target.value)
                            }
                            error={!!errors.date}
                            helperText={
                                errors.date
                                    ? t("medicalJournal.requiredFieldError")
                                    : ""
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500 }}
                        >
                            {t("medicalJournal.rotationLabel")}
                        </Typography>
                        <FormControl fullWidth error={!!errors.rotation}>
                            <Select
                                value={currentEntry.rotation}
                                onChange={(e) =>
                                    onInputChange("rotation", e.target.value)
                                }
                            >
                                {ROTATIONS.sort().map((rotation) => (
                                    <MenuItem key={rotation} value={rotation}>
                                        {rotation}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.rotation && (
                                <Typography variant="caption" color="error">
                                    {t("medicalJournal.requiredFieldError")}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500 }}
                        >
                            {t("medicalJournal.locationLabel")}
                        </Typography>
                        <FormControl fullWidth error={!!errors.location}>
                            <Select
                                value={currentEntry.location}
                                onChange={(e) =>
                                    onInputChange("location", e.target.value)
                                }
                            >
                                {LOCATIONS.sort().map((location) => (
                                    <MenuItem key={location} value={location}>
                                        {location}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.location && (
                                <Typography variant="caption" color="error">
                                    {t("medicalJournal.requiredFieldError")}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500 }}
                        >
                            {t("medicalJournal.canmedsRolesLabel")}
                        </Typography>
                        <FormControl fullWidth>
                            <Select
                                multiple
                                value={currentEntry.canmedsRoles || []}
                                onChange={(e) =>
                                    onInputChange(
                                        "canmedsRoles",
                                        e.target.value
                                    )
                                }
                                input={<OutlinedInput />}
                                renderValue={(selected) => (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 0.5,
                                        }}
                                    >
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={value}
                                                size="small"
                                                sx={{
                                                    backgroundColor: alpha(
                                                        getCanMEDSColor(value),
                                                        0.1
                                                    ),
                                                    color: getCanMEDSColor(
                                                        value
                                                    ),
                                                    fontWeight: 500,
                                                }}
                                            />
                                        ))}
                                    </Box>
                                )}
                            >
                                {CANMEDS_ROLES.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500 }}
                        >
                            {t("medicalJournal.patientSettingLabel")}
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            value={currentEntry.patientSetting}
                            onChange={(e) =>
                                onInputChange("patientSetting", e.target.value)
                            }
                            error={!!errors.patientSetting}
                            helperText={
                                errors.patientSetting
                                    ? t("medicalJournal.requiredFieldError")
                                    : ""
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500 }}
                        >
                            {t("medicalJournal.interactionLabel")}
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={currentEntry.interaction}
                            onChange={(e) =>
                                onInputChange("interaction", e.target.value)
                            }
                            error={!!errors.interaction}
                            helperText={
                                errors.interaction
                                    ? t("medicalJournal.requiredFieldError")
                                    : ""
                            }
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500 }}
                        >
                            {t("medicalJournal.hospitalLabel")}
                        </Typography>
                        <TextField
                            fullWidth
                            value={currentEntry.hospital || ""}
                            onChange={(e) =>
                                onInputChange("hospital", e.target.value)
                            }
                            placeholder={t(
                                "medicalJournal.hospitalPlaceholder"
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500 }}
                        >
                            {t("medicalJournal.doctorLabel")}
                        </Typography>
                        <TextField
                            fullWidth
                            value={currentEntry.doctor || ""}
                            onChange={(e) =>
                                onInputChange("doctor", e.target.value)
                            }
                            placeholder={t("medicalJournal.doctorPlaceholder")}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500 }}
                        >
                            {t("medicalJournal.learningobjectivesLabel")}
                        </Typography>
                        <FormControl fullWidth>
                            <Select
                                multiple
                                value={currentEntry.learningObjectives || []}
                                onChange={(e) =>
                                    onInputChange(
                                        "learningObjectives",
                                        e.target.value
                                    )
                                }
                                input={<OutlinedInput />}
                                renderValue={(selected) => (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: 0.5,
                                        }}
                                    >
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={value}
                                                size="small"
                                                sx={{
                                                    backgroundColor: alpha(
                                                        theme.palette.info.main,
                                                        0.1
                                                    ),
                                                    color: theme.palette.info
                                                        .main,
                                                    fontWeight: 500,
                                                }}
                                            />
                                        ))}
                                    </Box>
                                )}
                            >
                                {LEARNING_OBJECTIVES_DROPDOWN.map(
                                    (objective) => (
                                        <MenuItem
                                            key={objective}
                                            value={objective}
                                        >
                                            {objective}
                                        </MenuItem>
                                    )
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500 }}
                        >
                            What I Did Well
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={currentEntry.whatIDidWell || ""}
                            onChange={(e) =>
                                onInputChange("whatIDidWell", e.target.value)
                            }
                            placeholder="Enter what you did well..."
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            variant="body2"
                            sx={{ mb: 1, fontWeight: 500 }}
                        >
                            What I Could Improve
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={currentEntry.whatICouldImprove || ""}
                            onChange={(e) =>
                                onInputChange(
                                    "whatICouldImprove",
                                    e.target.value
                                )
                            }
                            placeholder="Enter what you could improve..."
                        />
                    </Grid>
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
                            value={currentEntry.feedback?.[0]?.text || ""}
                            onChange={(e) => {
                                const text = e.target.value;
                                if (text.trim()) {
                                    onInputChange("feedback", [
                                        {
                                            text: text,
                                            rotation: currentEntry.rotation,
                                        },
                                    ]);
                                } else {
                                    onInputChange("feedback", []);
                                }
                            }}
                            placeholder="Enter feedback for this entry..."
                        />
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
                    {t("medicalJournal.cancelButton")}
                </Button>
                <Button
                    onClick={onSave}
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
                    {editingEntry
                        ? t("medicalJournal.saveChangesButton")
                        : t("medicalJournal.addEntryButton")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

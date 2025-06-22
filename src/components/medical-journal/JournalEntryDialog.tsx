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
    Alert,
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
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth0 } from "@auth0/auth0-react";

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

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

    const { getAccessTokenSilently } = useAuth0();

    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [listeningField, setListeningField] = useState<string | null>(null);
    const [speechError, setSpeechError] = useState<string | null>(null);
    const recognitionRef = useRef<any>(null);
    const isInitializedRef = useRef(false);
    const [listeningStates, setListeningStates] = useState<
        Record<string, boolean>
    >({});

    // Check if SpeechRecognition API is supported
    const isSpeechRecognitionSupported = useCallback(() => {
        return (
            typeof window !== "undefined" &&
            ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
        );
    }, []);

    // Initialize speech recognition instance
    const initializeSpeechRecognition = useCallback(() => {
        if (!isSpeechRecognitionSupported() || isInitializedRef.current) {
            return false;
        }

        try {
            // Clean up any existing instance
            if (recognitionRef.current) {
                recognitionRef.current.stop();
                recognitionRef.current = null;
            }

            recognitionRef.current = new (window.SpeechRecognition ||
                window.webkitSpeechRecognition)();
            
            recognitionRef.current.lang = "en-US";
            recognitionRef.current.interimResults = true;
            recognitionRef.current.continuous = true;

            recognitionRef.current.onresult = (event: Event) => {
                const speechEvent = event as any;
                let newTranscript = "";
                for (
                    let i = speechEvent.resultIndex;
                    i < speechEvent.results.length;
                    i++
                ) {
                    const result = speechEvent.results[i];
                    if (result.isFinal) {
                        newTranscript += result[0].transcript;
                    }
                }
                if (newTranscript && listeningField) {
                    // Immediately append to the correct field and clear transcript
                    if (listeningField === "feedback") {
                        onInputChange("feedback", [
                            {
                                text:
                                    (currentEntry.feedback?.[0]?.text || "") +
                                    newTranscript,
                                rotation: currentEntry.rotation,
                            },
                        ]);
                    } else {
                        const prev = (currentEntry[
                            listeningField as keyof LearningEntry
                        ] || "") as string;
                        onInputChange(
                            listeningField as keyof LearningEntry,
                            prev + newTranscript
                        );
                    }
                    setTranscript("");
                } else if (!listeningField && newTranscript) {
                    setTranscript((prev) => prev + newTranscript);
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                setSpeechError(`Speech recognition error: ${event.error}`);
                setIsListening(false);
                setListeningStates({});
                setListeningField(null);
            };

            recognitionRef.current.onend = () => {
                if (isListening) {
                    console.log("Speech recognition restarted");
                    try {
                        recognitionRef.current?.start();
                    } catch (error) {
                        console.error("Failed to restart speech recognition:", error);
                        setIsListening(false);
                        setListeningStates({});
                        setListeningField(null);
                    }
                } else {
                    console.log("Speech recognition ended");
                    setIsListening(false);
                }
            };

            isInitializedRef.current = true;
            return true;
        } catch (error) {
            console.error("Failed to initialize speech recognition:", error);
            setSpeechError("Failed to initialize speech recognition");
            return false;
        }
    }, [isSpeechRecognitionSupported, listeningField, currentEntry, onInputChange, isListening]);

    // Check microphone permissions
    useEffect(() => {
        if (!isSpeechRecognitionSupported()) {
            setSpeechError("Speech Recognition API not supported in this browser");
            return;
        }

        if (typeof navigator !== "undefined" && navigator.permissions) {
            navigator.permissions
                .query({ name: "microphone" as PermissionName })
                .then((permissionStatus) => {
                    if (permissionStatus.state === "denied") {
                        setSpeechError("Microphone access is denied. Please enable it in your browser settings.");
                    }
                })
                .catch((error) => {
                    console.error("Error checking microphone permissions:", error);
                });
        }
    }, [isSpeechRecognitionSupported]);

    // Initialize speech recognition when dialog opens
    useEffect(() => {
        if (open && !isInitializedRef.current) {
            initializeSpeechRecognition();
        }
    }, [open, initializeSpeechRecognition]);

    // Cleanup speech recognition when dialog closes or component unmounts
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (error) {
                    console.error("Error stopping speech recognition:", error);
                }
                recognitionRef.current = null;
            }
            isInitializedRef.current = false;
            setIsListening(false);
            setListeningStates({});
            setListeningField(null);
        };
    }, []);

    const startListening = useCallback(() => {
        if (!recognitionRef.current || !isInitializedRef.current) {
            if (!initializeSpeechRecognition()) {
                return;
            }
        }

        try {
            recognitionRef.current.start();
            setIsListening(true);
            setSpeechError(null);
        } catch (error) {
            console.error("Failed to start speech recognition:", error);
            setSpeechError("Failed to start speech recognition");
        }
    }, [initializeSpeechRecognition]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (error) {
                console.error("Error stopping speech recognition:", error);
            }
        }
        setIsListening(false);
    }, []);

    const handleVoiceInputToggle = useCallback((field: string) => {
        if (listeningStates[field]) {
            stopListening();
            setListeningStates((prev) => ({ ...prev, [field]: false }));
            setTranscript("");
            setListeningField(null);
        } else {
            // Stop any current listening
            stopListening();
            setListeningStates({});
            setListeningField(null);
            
            // Start listening for the new field
            setListeningStates((prev) => ({ ...prev, [field]: true }));
            setListeningField(field);
            startListening();
        }
    }, [listeningStates, stopListening, startListening]);

    const summarizeWithOpenAI = async (
        text: string | null | undefined,
        listeningField: keyof LearningEntry
    ) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
                },
            });

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || ""}/api/chatgpt/summarize`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        text,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add feedback.");
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            } else if (!data.reply) {
                throw new Error("No reply from OpenAI.");
            }

            if (listeningField === "feedback") {
                onInputChange("feedback", [
                    {
                        text: data.reply,
                        rotation: currentEntry.rotation,
                    },
                ]);
            } else if (listeningField) {
                onInputChange(listeningField, data.reply);
            }
        } catch (error) {
            console.error(error);
        }
    };

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
            
            {speechError && (
                <Alert 
                    severity="error" 
                    sx={{ mx: 3, mb: 2 }}
                    onClose={() => setSpeechError(null)}
                >
                    {speechError}
                </Alert>
            )}
            
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
                            value={
                                isListening &&
                                listeningField === "patientSetting"
                                    ? (currentEntry.patientSetting || "") +
                                      transcript
                                    : currentEntry.patientSetting
                            }
                            onChange={(e) => {
                                onInputChange("patientSetting", e.target.value);
                                if (
                                    isListening &&
                                    listeningField === "patientSetting"
                                ) {
                                    setTranscript("");
                                }
                            }}
                            error={!!errors.patientSetting}
                            helperText={
                                errors.patientSetting
                                    ? t("medicalJournal.requiredFieldError")
                                    : ""
                            }
                            // disabled={isListening && listeningField === "patientSetting"}
                        />
                        <Button
                            onClick={() =>
                                handleVoiceInputToggle("patientSetting")
                            }
                            variant="outlined"
                            color={
                                isListening &&
                                listeningField === "patientSetting"
                                    ? "secondary"
                                    : "primary"
                            }
                            sx={{ mt: 1 }}
                        >
                            {isListening && listeningField === "patientSetting"
                                ? "🛑 Stop"
                                : "🎤 Speak"}
                        </Button>
                        <Button
                            onClick={() =>
                                summarizeWithOpenAI(
                                    currentEntry.patientSetting,
                                    "patientSetting"
                                )
                            }
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 1, ml: 1 }}
                        >
                            Summarize
                        </Button>
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
                            value={
                                isListening && listeningField === "interaction"
                                    ? (currentEntry.interaction || "") +
                                      transcript
                                    : currentEntry.interaction
                            }
                            onChange={(e) => {
                                onInputChange("interaction", e.target.value);
                                if (
                                    isListening &&
                                    listeningField === "interaction"
                                ) {
                                    setTranscript("");
                                }
                            }}
                            error={!!errors.interaction}
                            helperText={
                                errors.interaction
                                    ? t("medicalJournal.requiredFieldError")
                                    : ""
                            }
                            // disabled={isListening && listeningField === "interaction"}
                        />
                        <Button
                            onClick={() =>
                                handleVoiceInputToggle("interaction")
                            }
                            variant="outlined"
                            color={
                                isListening && listeningField === "interaction"
                                    ? "secondary"
                                    : "primary"
                            }
                            sx={{ mt: 1 }}
                        >
                            {isListening && listeningField === "interaction"
                                ? "🛑 Stop"
                                : "🎤 Speak"}
                        </Button>
                        <Button
                            onClick={() =>
                                summarizeWithOpenAI(
                                    currentEntry.interaction,
                                    "interaction"
                                )
                            }
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 1, ml: 1 }}
                        >
                            Summarize
                        </Button>
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
                            value={
                                isListening && listeningField === "whatIDidWell"
                                    ? (currentEntry.whatIDidWell || "") +
                                      transcript
                                    : currentEntry.whatIDidWell
                            }
                            onChange={(e) => {
                                onInputChange("whatIDidWell", e.target.value);
                                if (
                                    isListening &&
                                    listeningField === "whatIDidWell"
                                ) {
                                    setTranscript("");
                                }
                            }}
                            placeholder="Enter what you did well..."
                            // disabled={isListening && listeningField === "whatIDidWell"}
                        />
                        <Button
                            onClick={() =>
                                handleVoiceInputToggle("whatIDidWell")
                            }
                            variant="outlined"
                            color={
                                isListening && listeningField === "whatIDidWell"
                                    ? "secondary"
                                    : "primary"
                            }
                            sx={{ mt: 1 }}
                        >
                            {isListening && listeningField === "whatIDidWell"
                                ? "🛑 Stop"
                                : "🎤 Speak"}
                        </Button>
                        <Button
                            onClick={() =>
                                summarizeWithOpenAI(
                                    currentEntry.whatIDidWell,
                                    "whatIDidWell"
                                )
                            }
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 1, ml: 1 }}
                        >
                            Summarize
                        </Button>
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
                            value={
                                isListening &&
                                listeningField === "whatICouldImprove"
                                    ? (currentEntry.whatICouldImprove || "") +
                                      transcript
                                    : currentEntry.whatICouldImprove
                            }
                            onChange={(e) => {
                                onInputChange(
                                    "whatICouldImprove",
                                    e.target.value
                                );
                                if (
                                    isListening &&
                                    listeningField === "whatICouldImprove"
                                ) {
                                    setTranscript("");
                                }
                            }}
                            placeholder="Enter what you could improve..."
                            // disabled={isListening && listeningField === "whatICouldImprove"}
                        />
                        <Button
                            onClick={() =>
                                handleVoiceInputToggle("whatICouldImprove")
                            }
                            variant="outlined"
                            color={
                                isListening &&
                                listeningField === "whatICouldImprove"
                                    ? "secondary"
                                    : "primary"
                            }
                            sx={{ mt: 1 }}
                        >
                            {isListening &&
                            listeningField === "whatICouldImprove"
                                ? "🛑 Stop"
                                : "🎤 Speak"}
                        </Button>
                        <Button
                            onClick={() =>
                                summarizeWithOpenAI(
                                    currentEntry.whatICouldImprove,
                                    "whatICouldImprove"
                                )
                            }
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 1, ml: 1 }}
                        >
                            Summarize
                        </Button>
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
                            value={
                                isListening && listeningField === "feedback"
                                    ? (currentEntry.feedback?.[0]?.text || "") +
                                      transcript
                                    : currentEntry.feedback?.[0]?.text || ""
                            }
                            onChange={(e) => {
                                const text = e.target.value;
                                if (
                                    isListening &&
                                    listeningField === "feedback"
                                ) {
                                    setTranscript("");
                                }
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
                            // disabled={isListening && listeningField === "feedback"}
                        />
                        <Button
                            onClick={() => handleVoiceInputToggle("feedback")}
                            variant="outlined"
                            color={
                                isListening && listeningField === "feedback"
                                    ? "secondary"
                                    : "primary"
                            }
                            sx={{ mt: 1 }}
                        >
                            {isListening && listeningField === "feedback"
                                ? "🛑 Stop"
                                : "🎤 Speak"}
                        </Button>
                        <Button
                            onClick={() =>
                                summarizeWithOpenAI(
                                    currentEntry.feedback?.[0]?.text,
                                    "feedback"
                                )
                            }
                            variant="outlined"
                            color="primary"
                            sx={{ mt: 1, ml: 1 }}
                        >
                            Summarize
                        </Button>
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

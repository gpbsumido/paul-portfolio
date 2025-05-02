"use client";

import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Grid,
    FormControl,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    OutlinedInput,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useTheme,
    alpha,
    Divider,
    Tab,
    Tabs,
    Fade,
    Badge,
    Pagination,
    InputLabel,
} from "@mui/material";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect, useRef, useMemo } from "react";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TimelineIcon from "@mui/icons-material/Timeline";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SchoolIcon from "@mui/icons-material/School";
import Alert from "@mui/material/Alert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FeedbackIcon from "@mui/icons-material/Feedback";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ChecklistIcon from "@mui/icons-material/Checklist";

import { useAuth0 } from "@auth0/auth0-react";
import FloatingPill from "@/components/shared/FloatingPill";
import React from "react";
import DropdownComponent from "@/components/shared/DropdownComponent";

interface Feedback {
    id: string;
    text: string;
    rotation: string;
    journal_entry_id?: string;
    journal?: {
        id: string;
        patientSetting: string;
        interaction: string;
        canmedsRoles: string[];
        learningObjectives: string[];
        rotation: string;
        date: string;
        location: string;
        hospital?: string;
        doctor?: string;
        whatIDidWell?: string;
        whatICouldImprove?: string;
    };
}

interface LearningEntry {
    id: string;
    patientSetting: string;
    interaction: string;
    canmedsRoles: string[];
    learningObjectives: string[];
    rotation: string;
    date: string;
    location: string;
    hospital?: string;
    doctor?: string;
    whatIDidWell?: string;
    whatICouldImprove?: string;
    feedback?: Feedback[]; // Change feedback to be an array of Feedback objects
}

const CANMEDS_ROLES = [
    "Medical Expert",
    "Scholar",
    "Communicator",
    "Professional",
    "Leader",
    "Health Advocate",
    "Collaborator",
];

const LEARNING_OBJECTIVES = [
    {
        category: "Objectives of Clerkship Reflections",
        objectives: [
            "1. Promote Self-Awareness",
            "   • Understand your emotions, biases, and values in patient care",
            "   • Identify how personal beliefs influence your clinical behavior",
            "",
            "2. Enhance Clinical Reasoning",
            "   • Reflect on diagnostic and therapeutic decisions",
            "   • Analyze what went well or what could have been improved",
            "",
            "3. Support Professional Identity Formation",
            "   • Explore how experiences are shaping you as a future doctor",
            "   • Reflect on how you embody roles like communicator, collaborator, advocate",
            "",
            "4. Develop Empathy & Patient-Centered Thinking",
            "   • Consider patient perspectives, values, and lived experience",
            "   • Reflect on your communication, especially in difficult or emotional cases",
            "",
            "5. Integrate Feedback and Learning",
            "   • Reflect on feedback received and how it informed your development",
            "   • Identify learning goals or knowledge gaps for future improvement",
        ],
    },
    {
        category: "Techniques for Effective Reflection",
        objectives: [
            "1. Gibbs Reflective Cycle",
            "   • Description – What happened?",
            "   • Feelings – What were you thinking/feeling?",
            "   • Evaluation – What was good/bad?",
            "   • Analysis – Why did it happen that way?",
            "   • Conclusion – What did you learn?",
            "   • Action Plan – What will you do differently next time?",
            "",
            "2. The DIEP Model",
            "   • Describe the experience",
            "   • Interpret what it means",
            "   • Evaluate its significance to your development",
            "   • Plan how you'll apply the insight",
            "",
            "3. Free-Writing or Journaling",
            "   • More informal but can be deeply introspective",
            "   • Often useful right after emotional or challenging cases",
            "",
            "4. CanMEDS or ACGME Role-Based Reflection",
            "   • Align your reflection with roles like 'Scholar', 'Communicator'",
            "   • Some schools require or recommend mapping reflections to these roles",
        ],
    },
    {
        category: "Best Practices",
        objectives: [
            "• Focus on one meaningful encounter rather than a vague overview",
            "• Be honest — it's about insight, not perfection",
            "• Include both emotional and cognitive elements",
            "• Tie your reflection to actionable learning or professional growth",
            "• Avoid patient identifiers — maintain confidentiality",
        ],
    },
];


const LEARNING_OBJECTIVES_DROPDOWN = [
    "Appropriate consideration of broader differential diagnoses",
    "Suggest rule out/ rule in investigations and management",
    "Develop systematic approach to common presentations",
    "Recognize critical vs non-critical patients",
    "Perform focused history and physical examination",
    "Document patient encounters accurately",
    "Develop and implement management plans",
    "Follow-up on investigation results",
    "Clear communication with patients and families",
    "Effective handover to other healthcare providers",
    "Appropriate consultation with specialists",
    "Documentation of clinical reasoning",
]

//todo: move to a db table somewhere
const ROTATIONS = [
    "Emergency Medicine",
    "Internal Medicine - MTU",
    "Internal Medicine - Selective",
    "General Surgery",
    "Pediatrics",
    "Obstetrics/Gynecology",
    "Psychiatry",
    "Family Medicine - Rural",
    "Family Medicine - Urban",
    "Vascular Surgery",
    "Plastic Surgery",
    "Anasthesia",
    "NICU",
    "Elective",
    "Neurology",
];

const LOCATIONS = [
    "Emergency Department",
    "Inpatient Ward",
    "Outpatient Clinic",
    "Operating Room",
    "Intensive Care Unit",
    "Other",
    "Admissions",
];

const FeedbackDialog = ({
    open,
    onClose,
    selectedFeedback,
    currentEntry,
    onSave,
}: {
    open: boolean;
    onClose: () => void;
    selectedFeedback: Feedback | null;
    currentEntry: LearningEntry;
    onSave: (text: string, rotation: string, journalEntryId?: string) => Promise<void>;
}) => {
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
                journalEntryId: selectedFeedback.journal_entry_id || currentEntry.id,
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
                                    setLocalFeedback(prev => ({
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
                                        setLocalFeedback(prev => ({
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
};

export default function MedicalJournalPage() {
    const theme = useTheme();
    const {
        user,
        isAuthenticated,
        isLoading,
        loginWithRedirect,
        logout,
        getAccessTokenSilently,
    } = useAuth0();

    const { t } = useLanguage();
    const [entries, setEntries] = useState<LearningEntry[]>([]);
    const [currentEntry, setCurrentEntry] = useState<LearningEntry>({
        id: "",
        patientSetting: "",
        interaction: "",
        canmedsRoles: [],
        learningObjectives: [],
        rotation: "",
        date: new Date().toISOString().split("T")[0],
        location: "",
        hospital: "",
        doctor: "",
        whatIDidWell: "",
        whatICouldImprove: "",
        feedback: [],
    });
    const [editingEntry, setEditingEntry] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [errors, setErrors] = useState<{
        [key in keyof LearningEntry]?: boolean;
    }>({});

    // Update activeTab when authentication status changes
    useEffect(() => {
        if (!isLoading) {
            setActiveTab(isAuthenticated ? 1 : 0);
        }
    }, [isAuthenticated, isLoading]);

    const [sortField, setSortField] = useState<keyof LearningEntry>("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [filters, setFilters] = useState<{
        rotation?: string;
        location?: string;
        hospital?: string;
        doctor?: string;
    }>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

    const [feedbackPage, setFeedbackPage] = useState(1);
    const [feedbackLimit, setFeedbackLimit] = useState(5);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);

    const [feedbackSortField, setFeedbackSortField] = useState<keyof Feedback>("text");
    const [feedbackSortOrder, setFeedbackSortOrder] = useState<"asc" | "desc">("desc");
    const [feedbackRotationFilter, setFeedbackRotationFilter] = useState<string>("");

    const [feedbackTotalCount, setFeedbackTotalCount] = useState<number>(0);

    const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);
    const [expandedFeedbackText, setExpandedFeedbackText] = useState<string | null>(null);
    const [needsTruncation, setNeedsTruncation] = useState<{ [key: string]: boolean }>({});
    const resizeTimeoutRef = useRef<NodeJS.Timeout>();

    // Memoize filtered and sorted entries to prevent unnecessary recalculations
    const filteredAndSortedEntries = useMemo(() => 
        entries
            .filter((entry) => {
                if (filters.rotation && entry.rotation !== filters.rotation) return false;
                if (filters.location && entry.location !== filters.location) return false;
                if (filters.hospital && entry.hospital !== filters.hospital) return false;
                if (filters.doctor && entry.doctor !== filters.doctor) return false;
                return true;
            })
            .sort((a, b) => {
                const aValue = a[sortField] || "";
                const bValue = b[sortField] || "";

                if (Array.isArray(aValue) && Array.isArray(bValue)) {
                    const aString = aValue.join(", ");
                    const bString = bValue.join(", ");
                    return sortOrder === "asc" ? aString.localeCompare(bString) : bString.localeCompare(aString);
                }

                if (typeof aValue === "string" && typeof bValue === "string") {
                    return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }

                if (sortField === "date") {
                    const aDate = new Date(typeof aValue === "string" ? aValue : "").getTime();
                    const bDate = new Date(typeof bValue === "string" ? bValue : "").getTime();
                    return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
                }

                return sortOrder === "asc" ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? -1 : 1);
            }),
        [entries, filters, sortField, sortOrder]
    );

    // Memoize filtered and sorted feedbacks
    const filteredAndSortedFeedbacks = useMemo(() => 
        feedbacks
            .filter((feedback) => {
                if (feedbackRotationFilter && feedback.rotation !== feedbackRotationFilter) return false;
                return true;
            })
            .sort((a, b) => {
                const aValue = a[feedbackSortField] || "";
                const bValue = b[feedbackSortField] || "";

                if (typeof aValue === "string" && typeof bValue === "string") {
                    return feedbackSortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                return 0;
            }),
        [feedbacks, feedbackRotationFilter, feedbackSortField, feedbackSortOrder]
    );

    // Memoize paginated entries
    const paginatedEntries = useMemo(() => 
        filteredAndSortedEntries.slice((page - 1) * limit, page * limit),
        [filteredAndSortedEntries, page, limit]
    );

    // Memoize paginated feedbacks
    const paginatedFeedbacks = useMemo(() => 
        filteredAndSortedFeedbacks.slice((feedbackPage - 1) * feedbackLimit, feedbackPage * feedbackLimit),
        [filteredAndSortedFeedbacks, feedbackPage, feedbackLimit]
    );

    // Fetch data only when necessary
    useEffect(() => {
        if (isLoading || !isAuthenticated || !user?.email_verified) return;

        const fetchData = async () => {
            await handleFetchEntries();
            await handleFetchFeedback(feedbackPage, feedbackLimit, feedbackRotationFilter);
        };

        fetchData();
    }, [isLoading, isAuthenticated, user?.email_verified]);

    // Handle window resize with debounce
    useEffect(() => {
        const handleResize = () => {
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
            resizeTimeoutRef.current = setTimeout(() => {
                const tableCell = document.querySelector('.feedback-text-cell');
                if (!tableCell) return;
                
                const containerWidth = tableCell.clientWidth - 40;
                filteredAndSortedFeedbacks.forEach(feedback => {
                    measureTextHeight(feedback.text, feedback.id, containerWidth);
                });
            }, 100);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, [filteredAndSortedFeedbacks]);

    const handleSort = (field: keyof LearningEntry) => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const handleInputChange = (field: keyof LearningEntry, value: any) => {
        setCurrentEntry((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const validateFields = (): boolean => {
        const newErrors: { [key in keyof LearningEntry]?: boolean } = {};
        if (!currentEntry.date) newErrors.date = true;
        if (!currentEntry.rotation) newErrors.rotation = true;
        if (!currentEntry.location) newErrors.location = true;
        if (!currentEntry.patientSetting) newErrors.patientSetting = true;
        if (!currentEntry.interaction) newErrors.interaction = true;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFetchEntries = async () => {
        try {
            setIsFetching(true);

            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
                },
            });

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || ""}/api/med-journal/entries?page=${page}&limit=${limit}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch entries.");
            }

            const data = await response.json();
            if (data.success) {
                // The API already formats the entries with feedback
                setEntries(data.entries);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch entries."
            );
        } finally {
            setIsFetching(false);
        }
    };

    const handleSaveEntry = async () => {
        try {
            if (!validateFields()) return;

            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
                },
            });

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || ""}/api/med-journal/save-entry`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        ...currentEntry,
                        date: new Date().toISOString(),
                        whatIDidWell: currentEntry.whatIDidWell,
                        whatICouldImprove: currentEntry.whatICouldImprove,
                        feedbackText: currentEntry.feedback?.[0]?.text || "",
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to save the entry.");
            }

            const data = await response.json();
            if (data.success) {
                const savedEntry = data.entry;

                // Ensure feedback is properly formatted
                if (savedEntry.feedback) {
                    savedEntry.feedback = savedEntry.feedback.map((f: any) => ({
                        id: f.id,
                        text: f.text,
                        rotation: f.rotation,
                        journal_entry_id: f.journal_entry_id,
                    }));
                }

                if (editingEntry) {
                    setEntries((prev) =>
                        prev.map((entry) =>
                            entry.id === editingEntry ? savedEntry : entry
                        )
                    );
                    setEditingEntry(null);
                } else {
                    setEntries((prev) => [...prev, savedEntry]);
                }

                // If there was feedback added, refresh the feedback list
                if (currentEntry.feedback?.[0]?.text) {
                    await handleFetchFeedback(
                        feedbackPage,
                        feedbackLimit,
                        feedbackRotationFilter
                    );
                }

                setCurrentEntry({
                    id: "",
                    patientSetting: "",
                    interaction: "",
                    canmedsRoles: [],
                    learningObjectives: [],
                    rotation: "",
                    date: new Date().toISOString().split("T")[0],
                    location: "",
                    hospital: "",
                    doctor: "",
                    whatIDidWell: "",
                    whatICouldImprove: "",
                    feedback: [],
                });
                setIsEditDialogOpen(false);
                setErrorMessage(null);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to save the entry."
            );
        }
    };

    const handleDeleteEntry = async (id: string) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
                },
            });

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || ""}/api/med-journal/delete-entry/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Failed to delete the entry."
                );
            }

            const data = await response.json();
            if (data.success) {
                setEntries((prev) => prev.filter((entry) => entry.id !== id));
                setErrorMessage(null);
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to delete the entry."
            );
        }
    };

    const handleEditEntry = async (id: string) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
                },
            });

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || ""}/api/med-journal/edit-entry/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch the entry for editing.");
            }

            const data = await response.json();
            const entry = data.entry;

            setCurrentEntry({
                id: entry.id || "",
                patientSetting: entry.patientSetting || "",
                interaction: entry.interaction || "",
                canmedsRoles: entry.canmedsRoles || [],
                learningObjectives: entry.learningObjectives || [],
                rotation: entry.rotation || "",
                date: entry.date
                    ? new Date(entry.date).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0],
                location: entry.location || "",
                hospital: entry.hospital || "",
                doctor: entry.doctor || "",
                whatIDidWell: entry.whatIDidWell || "",
                whatICouldImprove: entry.whatICouldImprove || "",
                feedback: entry.feedback || [], // Include feedback in the edited entry
            });

            setEditingEntry(entry.id);
            setIsEditDialogOpen(true);
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to fetch the entry for editing.");
        }
    };

    const handleFetchFeedback = async (
        page: number,
        limit: number,
        rotation?: string
    ) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
                },
            });

            const queryParams = new URLSearchParams({
                page: String(page),
                limit: String(limit),
            });
            if (rotation) queryParams.append("rotation", rotation);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || ""}/api/feedback?${queryParams.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch feedback.");
            }

            const data = await response.json();
            if (data.success) {
                setFeedbacks(data.feedback);

                const totalCount =
                    typeof data.totalCount === "number"
                        ? data.totalCount
                        : data.feedback.length;
                setFeedbackTotalCount(totalCount);

                // Ensure page is within valid range
                const totalPages = Math.ceil(totalCount / limit);
                setFeedbackPage((prev) =>
                    Math.min(prev, Math.max(1, totalPages))
                );
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to fetch feedback."
            );
        }
    };

    const handleAddFeedback = async (
        text: string,
        rotation: string,
        journalEntryId?: string
    ) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
                },
            });

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || ""}/api/feedback`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        text,
                        rotation,
                        journal_entry_id: journalEntryId,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add feedback.");
            }

            const data = await response.json();
            if (data.success) {
                setFeedbacks((prev) => [...prev, data.feedback]);

                // If feedback is linked to a journal entry, update the entry's feedback
                if (journalEntryId) {
                    setEntries((prev) =>
                        prev.map((entry) => {
                            if (entry.id === journalEntryId) {
                                return {
                                    ...entry,
                                    feedback: [
                                        ...(entry.feedback || []),
                                        data.feedback,
                                    ],
                                };
                            }
                            return entry;
                        })
                    );
                }
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to add feedback."
            );
        }
    };

    const handleUpdateFeedback = async (
        id: string,
        text: string,
        rotation: string,
        journalEntryId?: string
    ) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
                },
            });

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || ""}/api/feedback/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        text,
                        rotation,
                        journal_entry_id: journalEntryId,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Failed to update feedback."
                );
            }

            const data = await response.json();
            if (data.success) {
                setFeedbacks((prev) =>
                    prev.map((feedback) =>
                        feedback.id === id ? data.feedback : feedback
                    )
                );

                // Update the feedback in the associated journal entry if it exists
                if (journalEntryId) {
                    setEntries((prev) =>
                        prev.map((entry) => {
                            if (entry.id === journalEntryId) {
                                return {
                                    ...entry,
                                    feedback: entry.feedback?.map((f) =>
                                        f.id === id ? data.feedback : f
                                    ) || [data.feedback],
                                };
                            }
                            return entry;
                        })
                    );
                }
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to update feedback."
            );
        }
    };

    const handleDeleteFeedback = async (id: string) => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
                },
            });

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || ""}/api/feedback/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error || "Failed to delete feedback."
                );
            }

            const data = await response.json();
            if (data.success) {
                // Remove feedback from the feedbacks list
                setFeedbacks((prev) =>
                    prev.filter((feedback) => feedback.id !== id)
                );

                // Remove feedback from any associated journal entries
                setEntries((prev) =>
                    prev.map((entry) => {
                        if (entry.feedback) {
                            return {
                                ...entry,
                                feedback: entry.feedback.filter(
                                    (f) => f.id !== id
                                ),
                            };
                        }
                        return entry;
                    })
                );
            }
        } catch (error) {
            console.error(error);
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to delete feedback."
            );
        }
    };

    const handleFeedbackSort = (field: keyof Feedback) => {
        if (feedbackSortField === field) {
            setFeedbackSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setFeedbackSortField(field);
            setFeedbackSortOrder("asc");
        }
    };

    const measureTextHeight = (text: string, id: string, containerWidth: number) => {
        const element = document.createElement('div');
        element.style.width = `${containerWidth}px`;
        element.style.visibility = 'hidden';
        element.style.position = 'absolute';
        element.style.whiteSpace = 'pre-wrap';
        element.style.fontSize = '14px';
        element.style.lineHeight = '1.5';
        element.style.padding = '0';
        element.style.margin = '0';
        element.textContent = text;
        document.body.appendChild(element);
        const height = element.offsetHeight;
        document.body.removeChild(element);
        setNeedsTruncation(prev => ({
            ...prev,
            [id]: height > 4.5 * 14 // 3 lines * 1.5 line-height * 14px font size
        }));
    };

    const updateMeasurements = () => {
        const tableCell = document.querySelector('.feedback-text-cell');
        if (!tableCell) return;
        
        const containerWidth = tableCell.clientWidth - 40; // Account for padding and expand button
        filteredAndSortedFeedbacks.forEach(feedback => {
            measureTextHeight(feedback.text, feedback.id, containerWidth);
        });
    };

    useEffect(() => {
        updateMeasurements();
    }, [filteredAndSortedFeedbacks]);

    useEffect(() => {
        const handleResize = () => {
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
            resizeTimeoutRef.current = setTimeout(updateMeasurements, 100);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, [filteredAndSortedFeedbacks]);

    useEffect(() => {
        if (isLoading || !isAuthenticated || !user?.email_verified) return;

        const fetchData = async () => {
            await handleFetchEntries();
            await handleFetchFeedback(
                feedbackPage,
                feedbackLimit,
                feedbackRotationFilter
            );
        };

        fetchData();
    }, [isLoading, isAuthenticated, user?.email_verified]);

    useEffect(() => {
        if (isLoading || !isAuthenticated || !user?.email_verified) return;
        handleFetchEntries();
    }, [page, limit, isLoading, isAuthenticated, user?.email_verified]);

    useEffect(() => {
        if (isLoading || !isAuthenticated || !user?.email_verified) return;
        handleFetchFeedback(
            feedbackPage,
            feedbackLimit,
            feedbackRotationFilter
        );
    }, [
        feedbackPage,
        feedbackLimit,
        feedbackRotationFilter,
        isLoading,
        isAuthenticated,
        user?.email_verified,
    ]);

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setEditingEntry(null);
        setCurrentEntry({
            id: "",
            patientSetting: "",
            interaction: "",
            canmedsRoles: [],
            learningObjectives: [],
            rotation: "",
            date: new Date().toISOString().split("T")[0],
            location: "",
            hospital: "",
            doctor: "",
            whatIDidWell: "",
            whatICouldImprove: "",
            feedback: [], // Reset feedback field
        });
    };

    const getCanMEDSColor = (role: string) => {
        const colors: { [key: string]: string } = {
            "Medical Expert": theme.palette.primary.main,
            Scholar: theme.palette.secondary.main,
            Communicator: "#4CAF50",
            Professional: "#9C27B0",
            Leader: "#FF9800",
            "Health Advocate": "#E91E63",
            Collaborator: "#00BCD4",
        };
        return colors[role] || theme.palette.grey[500];
    };

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleTabChange = (
        _: React.ChangeEvent<unknown>,
        newValue: number
    ) => {
        setActiveTab(newValue);
    };

    const toggleRowExpansion = (id: string) => {
        setExpandedRow((prev) => (prev === id ? null : id));
    };

    const handleSaveFeedback = async (text: string, rotation: string, journalEntryId?: string) => {
        if (selectedFeedback?.id) {
            await handleUpdateFeedback(selectedFeedback.id, text, rotation, journalEntryId);
        } else {
            await handleAddFeedback(text, rotation, journalEntryId);
        }
    };

    return (
        <Container maxWidth="lg">
            {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMessage}
                </Alert>
            )}
            <FloatingPill />
            <Box
                sx={{
                    position: "fixed",
                    top: { xs: "8px", sm: "16px" },
                    right: { xs: "8px", sm: "16px" },
                    zIndex: 9999,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "48px",
                }}
            >
                <LanguageSwitcher />
            </Box>
            <Box
                sx={{
                    position: "fixed",
                    top: { xs: "8px", sm: "16px" },
                    left: { xs: "8px", sm: "16px" },
                    zIndex: 9999,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "48px",
                }}
            >
                <HomeButton component={Link} href="/" />
            </Box>
            <Box
                sx={{
                    mt: 8,
                    mb: 4,
                    background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                    borderRadius: 2,
                    p: 4,
                    boxShadow: theme.shadows[1],
                }}
            >
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    align="center"
                    sx={{
                        fontWeight: 700,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        minHeight: "3rem", // Ensure consistent height
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {t("medicalJournal.title")}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            "& .MuiTab-root": {
                                minWidth: 120,
                                fontWeight: 600,
                            },
                            flexWrap: "wrap",
                            maxWidth: "100%",
                            "& .MuiTabs-flexContainer": {
                                flexWrap: "wrap",
                                gap: 1,
                            },
                            "& .MuiTabs-indicator": {
                                display: "none"
                            },
                            "& .Mui-selected": {
                                color: theme.palette.primary.main,
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                borderRadius: 1,
                            }
                        }}
                    >
                        <Tab
                            icon={<AssignmentIcon />}
                            label={t("medicalJournal.objectivesTitle")}
                            iconPosition="start"
                        />
                        {isAuthenticated && user && (
                            <Tab
                                icon={<TimelineIcon />}
                                label={t("medicalJournal.encountersTitle")}
                                iconPosition="start"
                            />
                        )}
                        {isAuthenticated && user && (
                            <Tab
                                icon={<FeedbackIcon />}
                                label="Feedback"
                                iconPosition="start"
                            />
                        )}
                    </Tabs>
                </Box>
                {!isAuthenticated && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 2,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 500,
                                color: theme.palette.text.secondary,
                            }}
                        >
                            {t("medicalJournal.loginPrompt")}
                        </Typography>
                    </Box>
                )}
            </Box>
            <Fade in={activeTab === 0}>
                <Box sx={{ display: activeTab === 0 ? "block" : "none", mb: 4 }}>
                    {/* Learning Objectives Section */}
                    <Grid container spacing={3}>
                        {LEARNING_OBJECTIVES.map((category, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        transition: "transform 0.2s",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: theme.shadows[8],
                                        },
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                            height: "100%",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                mb: 2,
                                                minHeight: {
                                                    xs: "3rem",
                                                    sm: "4rem",
                                                },
                                                gap: 2,
                                            }}
                                        >
                                            {index === 0 && (
                                                <PsychologyIcon
                                                    sx={{
                                                        mr: 1,
                                                        color: theme.palette.primary.main,
                                                        fontSize: "2rem",
                                                    }}
                                                />
                                            )}
                                            {index === 1 && (
                                                <AutoStoriesIcon
                                                    sx={{
                                                        mr: 1,
                                                        color: theme.palette.secondary.main,
                                                        fontSize: "2rem",
                                                    }}
                                                />
                                            )}
                                            {index === 2 && (
                                                <ChecklistIcon
                                                    sx={{
                                                        mr: 1,
                                                        color: theme.palette.success.main,
                                                        fontSize: "2rem",
                                                    }}
                                                />
                                            )}
                                            <Typography
                                                variant="h6"
                                                component="h2"
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: "1.25rem",
                                                    flex: 1,
                                                    display: "flex",
                                                    alignItems: "center",
                                                }}
                                            >
                                                {category.category}
                                            </Typography>
                                        </Box>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box
                                            component="ul"
                                            sx={{
                                                pl: 2,
                                                m: 0,
                                                listStyle: "none",
                                                flexGrow: 1,
                                            }}
                                        >
                                            {category.objectives.map(
                                                (objective, objIndex) => (
                                                    <Box
                                                        component="li"
                                                        key={objIndex}
                                                        sx={{
                                                            mb: 1.5,
                                                            color: theme.palette.text.secondary,
                                                            fontSize: "0.875rem",
                                                            ...(objective.startsWith("1.") || objective.startsWith("2.") || objective.startsWith("3.") || objective.startsWith("4.") || objective.startsWith("5.") ? {
                                                                color: theme.palette.text.primary,
                                                                fontWeight: 600,
                                                                fontSize: "1rem",
                                                                mt: 2,
                                                            } : {}),
                                                            ...(objective === "" ? {
                                                                mb: 0.5,
                                                            } : {}),
                                                            ...(objective.startsWith("   •") ? {
                                                                pl: 2,
                                                            } : {}),
                                                        }}
                                                    >
                                                        {objective}
                                                    </Box>
                                                )
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Fade>

            <Fade in={activeTab === 1}>
                <Box sx={{ display: activeTab === 1 ? "block" : "none" }}>
                    {/* Entries Table */}
                    <Card
                        sx={{
                            mb: 4,
                            overflow: "hidden",
                            boxShadow: theme.shadows[3],
                        }}
                    >
                        <Box
                            sx={{
                                p: 2,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                gap: 2,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 600,
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {t("medicalJournal.clinicalEncountersTitle")}
                            </Typography>

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 500,
                                        color: theme.palette.text.secondary,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: {
                                            xs: undefined,
                                            md: 3,
                                        },
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {t("medicalJournal.reflectionNote")}
                                </Typography>
                            </Box>
                            <Tooltip
                                title={t("medicalJournal.addEntryTooltip")}
                            >
                                <IconButton
                                    color="primary"
                                    onClick={() => setIsEditDialogOpen(true)}
                                    sx={{
                                        borderRadius: 2,
                                        flexShrink: 0,
                                    }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <TableContainer sx={{ overflowX: "auto" }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            sx={{
                                                cursor: "pointer",
                                                whiteSpace: "nowrap",
                                            }} // Reduced width
                                            onClick={() => handleSort("date")}
                                        >
                                            {t("medicalJournal.dateColumn")}{" "}
                                            {sortField === "date" &&
                                                (sortOrder === "asc"
                                                    ? "↑"
                                                    : "↓")}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                cursor: "pointer",
                                                whiteSpace: "nowrap",
                                            }} // Reduced width
                                            onClick={() =>
                                                handleSort("rotation")
                                            }
                                        >
                                            {t("medicalJournal.rotationColumn")}{" "}
                                            {sortField === "rotation" &&
                                                (sortOrder === "asc"
                                                    ? "↑"
                                                    : "↓")}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                cursor: "pointer",
                                                minWidth: 140,
                                            }} // Reduced width
                                            onClick={() =>
                                                handleSort("patientSetting")
                                            }
                                        >
                                            {t(
                                                "medicalJournal.patientSettingColumn"
                                            )}{" "}
                                            {sortField === "patientSetting" &&
                                                (sortOrder === "asc"
                                                    ? "↑"
                                                    : "↓")}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                cursor: "pointer",
                                                minWidth: 140,
                                            }} // Reduced width
                                            onClick={() =>
                                                handleSort("interaction")
                                            }
                                        >
                                            {t(
                                                "medicalJournal.interactionColumn"
                                            )}{" "}
                                            {sortField === "interaction" &&
                                                (sortOrder === "asc"
                                                    ? "↑"
                                                    : "↓")}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                cursor: "pointer",
                                                whiteSpace: "nowrap",
                                            }} // Reduced width
                                            onClick={() =>
                                                handleSort("hospital")
                                            }
                                        >
                                            {t("medicalJournal.hospitalColumn")}{" "}
                                            {sortField === "hospital" &&
                                                (sortOrder === "asc"
                                                    ? "↑"
                                                    : "↓")}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                cursor: "pointer",
                                                whiteSpace: "nowrap",
                                            }} // Reduced width
                                            onClick={() => handleSort("doctor")}
                                        >
                                            {t("medicalJournal.doctorColumn")}{" "}
                                            {sortField === "doctor" &&
                                                (sortOrder === "asc"
                                                    ? "↑"
                                                    : "↓")}
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                cursor: "pointer",
                                                minWidth: 180,
                                            }} // Reduced width
                                            onClick={() =>
                                                handleSort("canmedsRoles")
                                            }
                                        >
                                            {t(
                                                "medicalJournal.canmedsRolesColumn"
                                            )}{" "}
                                            {sortField === "canmedsRoles" &&
                                                (sortOrder === "asc"
                                                    ? "↑"
                                                    : "↓")}
                                        </TableCell>
                                        <TableCell
                                            align="right"
                                            sx={{ whiteSpace: "nowrap" }}
                                        >
                                            {t("medicalJournal.actionsColumn")}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {paginatedEntries.map((entry) => (
                                        <React.Fragment key={entry.id}>
                                            <TableRow
                                                key={`entry-${entry.id}`}
                                                sx={{
                                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                                    "&:hover": {
                                                        backgroundColor: alpha(
                                                            theme.palette
                                                                .primary.main,
                                                            0.04
                                                        ),
                                                    },
                                                }}
                                            >
                                                <TableCell
                                                    sx={{
                                                        verticalAlign: "middle",
                                                    }}
                                                >
                                                    {new Date(
                                                        entry.date
                                                    ).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        verticalAlign: "middle",
                                                    }}
                                                >
                                                    <Chip
                                                        label={entry.rotation}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor:
                                                                alpha(
                                                                    theme
                                                                        .palette
                                                                        .primary
                                                                        .main,
                                                                    0.1
                                                                ),
                                                            color: theme.palette
                                                                .primary.main,
                                                            fontWeight: 500,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        verticalAlign: "middle",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            maxWidth: 200,
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            display:
                                                                "-webkit-box",
                                                            WebkitLineClamp: 5,
                                                            WebkitBoxOrient:
                                                                "vertical",
                                                        }}
                                                    >
                                                        {entry.patientSetting ||
                                                            "N/A"}
                                                    </Box>
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        verticalAlign: "middle",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            maxWidth: 200,
                                                            overflow: "hidden",
                                                            textOverflow:
                                                                "ellipsis",
                                                            display:
                                                                "-webkit-box",
                                                            WebkitLineClamp: 5,
                                                            WebkitBoxOrient:
                                                                "vertical",
                                                        }}
                                                    >
                                                        {entry.interaction ||
                                                            "N/A"}
                                                    </Box>
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        verticalAlign: "middle",
                                                    }}
                                                >
                                                    {entry.hospital || "N/A"}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        verticalAlign: "middle",
                                                    }}
                                                >
                                                    {entry.doctor || "N/A"}
                                                </TableCell>
                                                <TableCell
                                                    sx={{
                                                        verticalAlign: "middle",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                            flexWrap: "wrap",
                                                            gap: 0.5,
                                                        }}
                                                    >
                                                        {entry.canmedsRoles
                                                            ?.length > 0
                                                            ? entry.canmedsRoles.map(
                                                                  (role) => (
                                                                      <Chip
                                                                          key={
                                                                              role
                                                                          }
                                                                          label={
                                                                              role
                                                                          }
                                                                          size="small"
                                                                          sx={{
                                                                              backgroundColor:
                                                                                  alpha(
                                                                                      getCanMEDSColor(
                                                                                          role
                                                                                      ),
                                                                                      0.1
                                                                                  ),
                                                                              color: getCanMEDSColor(
                                                                                  role
                                                                              ),
                                                                              fontWeight: 500,
                                                                          }}
                                                                      />
                                                                  )
                                                              )
                                                            : "N/A"}
                                                    </Box>
                                                </TableCell>
                                                <TableCell
                                                    align="right"
                                                    sx={{
                                                        verticalAlign: "middle",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                            gap: 1,
                                                            justifyContent:
                                                                "flex-end",
                                                        }}
                                                    >
                                                        <Tooltip
                                                            title={t(
                                                                "medicalJournal.editEntryTooltip"
                                                            )}
                                                        >
                                                            <IconButton
                                                                onClick={() =>
                                                                    handleEditEntry(
                                                                        entry.id
                                                                    )
                                                                }
                                                                size="small"
                                                                sx={{
                                                                    color: theme
                                                                        .palette
                                                                        .primary
                                                                        .main,
                                                                    "&:hover": {
                                                                        backgroundColor:
                                                                            alpha(
                                                                                theme
                                                                                    .palette
                                                                                    .primary
                                                                                    .main,
                                                                                0.1
                                                                            ),
                                                                    },
                                                                }}
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip
                                                            title={t(
                                                                "medicalJournal.deleteEntryTooltip"
                                                            )}
                                                        >
                                                            <IconButton
                                                                onClick={() =>
                                                                    handleDeleteEntry(
                                                                        entry.id
                                                                    )
                                                                }
                                                                size="small"
                                                                sx={{
                                                                    color: theme
                                                                        .palette
                                                                        .error
                                                                        .main,
                                                                    "&:hover": {
                                                                        backgroundColor:
                                                                            alpha(
                                                                                theme
                                                                                    .palette
                                                                                    .error
                                                                                    .main,
                                                                                0.1
                                                                            ),
                                                                    },
                                                                }}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                toggleRowExpansion(
                                                                    entry.id
                                                                )
                                                            }
                                                        >
                                                            {expandedRow ===
                                                            entry.id ? (
                                                                <KeyboardArrowUpIcon />
                                                            ) : (
                                                                <KeyboardArrowDownIcon />
                                                            )}
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                            {expandedRow === entry.id && (
                                                <TableRow
                                                    key={`expanded-${entry.id}`}
                                                >
                                                    <TableCell
                                                        colSpan={8}
                                                        sx={{
                                                            backgroundColor:
                                                                alpha(
                                                                    theme
                                                                        .palette
                                                                        .primary
                                                                        .main,
                                                                    0.05
                                                                ),
                                                            p: 2,
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 500,
                                                                mb: 1,
                                                            }}
                                                        >
                                                            <strong>
                                                                Patient Setting:
                                                            </strong>{" "}
                                                            {entry.patientSetting ||
                                                                "N/A"}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 500,
                                                                mb: 1,
                                                            }}
                                                        >
                                                            <strong>
                                                                Interaction:
                                                            </strong>{" "}
                                                            {entry.interaction ||
                                                                "N/A"}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 500,
                                                                mb: 1,
                                                            }}
                                                        >
                                                            <strong>
                                                                Hospital:
                                                            </strong>{" "}
                                                            {entry.hospital ||
                                                                "N/A"}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 500,
                                                                mb: 1,
                                                            }}
                                                        >
                                                            <strong>
                                                                Doctor:
                                                            </strong>{" "}
                                                            {entry.doctor ||
                                                                "N/A"}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 500,
                                                                mb: 1,
                                                            }}
                                                        >
                                                            <strong>
                                                                CanMEDS Roles:
                                                            </strong>{" "}
                                                            {entry.canmedsRoles?.join(
                                                                ", "
                                                            ) || "N/A"}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 500,
                                                                mb: 1,
                                                            }}
                                                        >
                                                            <strong>
                                                                Learning
                                                                Objectives:
                                                            </strong>{" "}
                                                            {entry.learningObjectives?.join(
                                                                ", "
                                                            ) || "N/A"}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 500,
                                                                mb: 1,
                                                            }}
                                                        >
                                                            <strong>
                                                                What I Did Well:
                                                            </strong>{" "}
                                                            {entry.whatIDidWell ||
                                                                "N/A"}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 500,
                                                                mb: 1,
                                                            }}
                                                        >
                                                            <strong>
                                                                What I Could
                                                                Improve:
                                                            </strong>{" "}
                                                            {entry.whatICouldImprove ||
                                                                "N/A"}
                                                        </Typography>
                                                        {entry.feedback && (
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    fontWeight: 500,
                                                                    mb: 1,
                                                                    mt: 2,
                                                                }}
                                                            >
                                                                <strong>
                                                                    Feedback:
                                                                </strong>{" "}
                                                                {entry.feedback
                                                                    .map(
                                                                        (f) =>
                                                                            f.text
                                                                    )
                                                                    .join(", ")}
                                                            </Typography>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center", // Center the pagination
                                    mt: 2,
                                }}
                            >
                                <Pagination
                                    count={Math.ceil(
                                        filteredAndSortedEntries.length / limit
                                    )}
                                    page={page}
                                    onChange={handlePageChange}
                                    color="primary"
                                />
                            </Box>
                        </TableContainer>
                    </Card>
                </Box>
            </Fade>

            <Fade in={activeTab === 2}>
                <Box sx={{ display: activeTab === 2 ? "block" : "none" }}>
                    <Card sx={{ mb: 4 }}>
                        <Box sx={{ p: 2 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    mb: 2,
                                    flexWrap: "wrap",
                                    gap: 2,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 600,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Feedback
                                </Typography>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 2,
                                    }}
                                >
                                    <DropdownComponent
                                        title="Filter by Rotation"
                                        titleLocation="left"
                                        currentSelected={feedbackRotationFilter}
                                        items={[
                                            { label: "- No Filter -", value: "", key: "no-filter" },
                                            ...ROTATIONS.map((rotation) => ({
                                                label: rotation,
                                                value: rotation,
                                                key: rotation,
                                            }))
                                        ]}
                                        onChange={setFeedbackRotationFilter}
                                    />
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => {
                                            setSelectedFeedback(null);
                                            setIsFeedbackDialogOpen(true);
                                        }}
                                    >
                                        Add Feedback
                                    </Button>
                                </Box>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                sx={{ 
                                                    cursor: "pointer",
                                                    width: "70%"
                                                }}
                                                onClick={() => handleFeedbackSort("text")}
                                            >
                                                Feedback{" "}
                                                {feedbackSortField === "text" &&
                                                    (feedbackSortOrder === "asc" ? "↑" : "↓")}
                                            </TableCell>
                                            <TableCell
                                                sx={{ 
                                                    cursor: "pointer",
                                                    width: "15%",
                                                    whiteSpace: "nowrap"
                                                }}
                                                onClick={() => handleFeedbackSort("rotation")}
                                            >
                                                Rotation{" "}
                                                {feedbackSortField === "rotation" &&
                                                    (feedbackSortOrder === "asc" ? "↑" : "↓")}
                                            </TableCell>
                                            <TableCell
                                                sx={{ 
                                                    width: "15%",
                                                    whiteSpace: "nowrap"
                                                }}
                                            >
                                                Actions
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredAndSortedFeedbacks.map((feedback) => (
                                            <React.Fragment key={feedback.id}>
                                                <TableRow
                                                    hover
                                                    sx={{ 
                                                        '&:hover': {
                                                            backgroundColor: alpha(theme.palette.action.hover, 0.04)
                                                        }
                                                    }}
                                                >
                                                    <TableCell className="feedback-text-cell">
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Typography
                                                                sx={{
                                                                    display: "-webkit-box",
                                                                    WebkitLineClamp: expandedFeedbackText === feedback.id ? undefined : 3,
                                                                    WebkitBoxOrient: "vertical",
                                                                    overflow: "hidden",
                                                                    flex: 1,
                                                                }}
                                                            >
                                                                {feedback.text}
                                                            </Typography>
                                                            {needsTruncation[feedback.id] && (
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setExpandedFeedbackText(expandedFeedbackText === feedback.id ? null : feedback.id);
                                                                    }}
                                                                    sx={{
                                                                        transform: expandedFeedbackText === feedback.id ? 'rotate(180deg)' : 'none',
                                                                        transition: 'transform 0.2s',
                                                                        p: 0.5,
                                                                    }}
                                                                >
                                                                    <KeyboardArrowDownIcon fontSize="small" />
                                                                </IconButton>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography
                                                            sx={{
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis"
                                                            }}
                                                        >
                                                            {feedback.rotation}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                gap: 1,
                                                                alignItems: "center",
                                                                justifyContent: "flex-start"
                                                            }}
                                                        >
                                                            <IconButton
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedFeedback(feedback);
                                                                    setIsFeedbackDialogOpen(true);
                                                                }}
                                                                size="small"
                                                            >
                                                                <EditIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteFeedback(feedback.id);
                                                                }}
                                                                size="small"
                                                                color="error"
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                            {feedback.journal && (
                                                                <IconButton
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setExpandedFeedback(expandedFeedback === feedback.id ? null : feedback.id);
                                                                    }}
                                                                    size="small"
                                                                    sx={{
                                                                        transform: expandedFeedback === feedback.id ? 'rotate(180deg)' : 'none',
                                                                        transition: 'transform 0.2s',
                                                                    }}
                                                                >
                                                                    <KeyboardArrowDownIcon />
                                                                </IconButton>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                                {expandedFeedback === feedback.id && feedback.journal && (
                                                    <TableRow>
                                                        <TableCell colSpan={3} sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                                                            <Box sx={{ pl: 2 }}>
                                                                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                                                                    Associated Journal Entry
                                                                </Typography>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={12} sm={6}>
                                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                                            <strong>Date:</strong> {new Date(feedback.journal.date).toLocaleDateString()}
                                                                        </Typography>
                                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                                            <strong>Rotation:</strong> {feedback.journal.rotation}
                                                                        </Typography>
                                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                                            <strong>Location:</strong> {feedback.journal.location}
                                                                        </Typography>
                                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                                            <strong>Hospital:</strong> {feedback.journal.hospital || "N/A"}
                                                                        </Typography>
                                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                                            <strong>Doctor:</strong> {feedback.journal.doctor || "N/A"}
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={6}>
                                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                                            <strong>Patient Setting:</strong> {feedback.journal.patientSetting}
                                                                        </Typography>
                                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                                            <strong>Interaction:</strong> {feedback.journal.interaction}
                                                                        </Typography>
                                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                                            <strong>CanMEDS Roles:</strong> {feedback.journal.canmedsRoles.join(", ")}
                                                                        </Typography>
                                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                                            <strong>Learning Objectives:</strong> {feedback.journal.learningObjectives.join(", ")}
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                                            <strong>What I Did Well:</strong> {feedback.journal.whatIDidWell || "N/A"}
                                                                        </Typography>
                                                                        <Typography variant="body2" sx={{ mb: 1 }}>
                                                                            <strong>What I Could Improve:</strong> {feedback.journal.whatICouldImprove || "N/A"}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    mt: 2,
                                }}
                            >
                                <Pagination
                                    count={Math.max(
                                        1,
                                        Math.ceil(feedbackTotalCount / feedbackLimit)
                                    )}
                                    page={Math.min(
                                        feedbackPage,
                                        Math.max(
                                            1,
                                            Math.ceil(feedbackTotalCount / feedbackLimit)
                                        )
                                    )}
                                    onChange={(_, value) => {
                                        setFeedbackPage(value);
                                        handleFetchFeedback(
                                            value,
                                            feedbackLimit,
                                            feedbackRotationFilter
                                        );
                                    }}
                                    showFirstButton
                                    showLastButton
                                    siblingCount={1}
                                    boundaryCount={1}
                                    color="primary"
                                    size="large"
                                    variant="outlined"
                                    shape="rounded"
                                />
                            </Box>
                        </Box>
                    </Card>
                </Box>
            </Fade>

            {/* Edit Dialog */}
            <Dialog
                open={isEditDialogOpen}
                onClose={handleCloseEditDialog}
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
                                    handleInputChange("date", e.target.value)
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
                                        handleInputChange(
                                            "rotation",
                                            e.target.value
                                        )
                                    }
                                >
                                    {ROTATIONS.sort().map((rotation) => (
                                        <MenuItem
                                            key={rotation}
                                            value={rotation}
                                        >
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
                                        handleInputChange(
                                            "location",
                                            e.target.value
                                        )
                                    }
                                >
                                    {LOCATIONS.sort().map((location) => (
                                        <MenuItem
                                            key={location}
                                            value={location}
                                        >
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
                                        handleInputChange(
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
                                                            getCanMEDSColor(
                                                                value
                                                            ),
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
                                    handleInputChange(
                                        "patientSetting",
                                        e.target.value
                                    )
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
                                    handleInputChange(
                                        "interaction",
                                        e.target.value
                                    )
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
                                    handleInputChange(
                                        "hospital",
                                        e.target.value
                                    )
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
                                    handleInputChange("doctor", e.target.value)
                                }
                                placeholder={t(
                                    "medicalJournal.doctorPlaceholder"
                                )}
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
                                    value={
                                        currentEntry.learningObjectives || []
                                    }
                                    onChange={(e) =>
                                        handleInputChange(
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
                                                            theme.palette.info
                                                                .main,
                                                            0.1
                                                        ),
                                                        color: theme.palette
                                                            .info.main,
                                                        fontWeight: 500,
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {LEARNING_OBJECTIVES_DROPDOWN.map((objective) =>(
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
                                    handleInputChange(
                                        "whatIDidWell",
                                        e.target.value
                                    )
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
                                    handleInputChange(
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
                                        handleInputChange("feedback", [
                                            {
                                                text: text,
                                                rotation: currentEntry.rotation,
                                            },
                                        ]);
                                    } else {
                                        handleInputChange("feedback", []);
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
                        background: alpha(
                            theme.palette.background.default,
                            0.5
                        ),
                    }}
                >
                    <Button
                        onClick={handleCloseEditDialog}
                        sx={{
                            textTransform: "none",
                            fontWeight: 500,
                        }}
                    >
                        {t("medicalJournal.cancelButton")}
                    </Button>
                    <Button
                        onClick={handleSaveEntry}
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
            <FeedbackDialog
                open={isFeedbackDialogOpen}
                onClose={() => {
                    setIsFeedbackDialogOpen(false);
                    setSelectedFeedback(null);
                }}
                selectedFeedback={selectedFeedback}
                currentEntry={currentEntry}
                onSave={handleSaveFeedback}
            />
        </Container>
    );
}

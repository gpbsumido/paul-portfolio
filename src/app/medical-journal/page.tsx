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
} from "@mui/material";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TimelineIcon from "@mui/icons-material/Timeline";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SchoolIcon from "@mui/icons-material/School";
import Alert from "@mui/material/Alert";

import { useAuth0 } from "@auth0/auth0-react";

interface LearningEntry {
    id: string;
    patientsetting: string;
    interaction: string;
    canmedsroles: string[];
    learningObjectives: string[];
    rotation: string;
    date: string;
    location: string;
    hospital?: string; // Optional property
    doctor?: string; // Optional property
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
        category: "Approach to Cardinal EM Presentations",
        objectives: [
            "Appropriate consideration of broader differential diagnoses",
            "Suggest rule out/ rule in investigations and management",
            "Develop systematic approach to common presentations",
            "Recognize critical vs non-critical patients",
        ],
    },
    {
        category: "Clinical Skills",
        objectives: [
            "Perform focused history and physical examination",
            "Document patient encounters accurately",
            "Develop and implement management plans",
            "Follow-up on investigation results",
        ],
    },
    {
        category: "Communication",
        objectives: [
            "Clear communication with patients and families",
            "Effective handover to other healthcare providers",
            "Appropriate consultation with specialists",
            "Documentation of clinical reasoning",
        ],
    },
];

const ROTATIONS = [
    "Emergency Medicine",
    "Internal Medicine",
    "Surgery",
    "Pediatrics",
    "Obstetrics/Gynecology",
    "Psychiatry",
    "Family Medicine",
];

const LOCATIONS = [
    "Emergency Department",
    "Inpatient Ward",
    "Outpatient Clinic",
    "Operating Room",
    "Intensive Care Unit",
    "Other",
];

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
        patientsetting: "",
        interaction: "",
        canmedsroles: [],
        learningObjectives: [],
        rotation: "",
        date: new Date().toISOString().split("T")[0],
        location: "",
        hospital: "",
        doctor: "",
    });
    const [editingEntry, setEditingEntry] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [errors, setErrors] = useState<{
        [key in keyof LearningEntry]?: boolean;
    }>({});

    const [sortField, setSortField] = useState<keyof LearningEntry>("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [filters, setFilters] = useState<{
        rotation?: string;
        location?: string;
    }>({});
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isFetching, setIsFetching] = useState(false);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const handleSort = (field: keyof LearningEntry) => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    const handleFilterChange = (field: keyof typeof filters, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value || undefined,
        }));
    };

    const filteredAndSortedEntries = entries
        .filter((entry) => {
            if (filters.rotation && entry.rotation !== filters.rotation)
                return false;
            if (filters.location && entry.location !== filters.location)
                return false;
            return true;
        })
        .sort((a, b) => {
            const aValue = a[sortField] || "";
            const bValue = b[sortField] || "";
            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? -1 : 1;
            }
        });

    const paginatedEntries = filteredAndSortedEntries.slice(
        (page - 1) * limit,
        page * limit
    );

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
        if (!currentEntry.patientsetting) newErrors.patientsetting = true;
        if (!currentEntry.interaction) newErrors.interaction = true;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
                    body: JSON.stringify(currentEntry),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to save the entry.");
            }

            const data = await response.json();
            const savedEntry = data.entry;

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

            setCurrentEntry({
                id: "",
                patientsetting: "",
                interaction: "",
                canmedsroles: [],
                learningObjectives: [],
                rotation: "",
                date: new Date().toISOString().split("T")[0],
                location: "",
                hospital: "",
                doctor: "",
            });
            setIsEditDialogOpen(false);
            setErrorMessage(null);
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to save the entry.");
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
                throw new Error("Failed to delete the entry.");
            }

            setEntries((prev) => prev.filter((entry) => entry.id !== id));
            setErrorMessage(null);
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to delete the entry.");
        }
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
                throw new Error("Failed to fetch entries.");
            }

            const data = await response.json();
            setEntries(data.entries);
            setErrorMessage(null);
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to fetch entries.");
        } finally {
            setIsFetching(false);
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
                patientsetting: entry.patientsetting || "",
                interaction: entry.interaction || "",
                canmedsroles: entry.canmedsroles || [],
                learningObjectives: entry.learningobjectives || [],
                rotation: entry.rotation || "",
                date: entry.date
                    ? new Date(entry.date).toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0],
                location: entry.location || "",
                hospital: entry.hospital || "",
                doctor: entry.doctor || "",
            });

            setEditingEntry(entry.id);
            setIsEditDialogOpen(true);
        } catch (error) {
            console.error(error);
            setErrorMessage("Failed to fetch the entry for editing.");
        }
    };

    useEffect(() => {
        //require logged in and verified user
        if (isLoading || !isAuthenticated || !user?.email_verified) return;
        handleFetchEntries();
    }, [page, limit, isLoading, isAuthenticated, user?.email_verified]);

    const handleCloseEditDialog = () => {
        setIsEditDialogOpen(false);
        setEditingEntry(null);
        setCurrentEntry({
            id: "",
            patientsetting: "",
            interaction: "",
            canmedsroles: [],
            learningObjectives: [],
            rotation: "",
            date: new Date().toISOString().split("T")[0],
            location: "",
            hospital: "",
            doctor: "",
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

    return (
        <Container maxWidth="lg">
            {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errorMessage}
                </Alert>
            )}

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
                {!isLoading && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 4,
                        }}
                    >
                        {isAuthenticated ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 2,
                                    alignItems: "center",
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 500,
                                        color: theme.palette.text.primary,
                                    }}
                                >
                                    {t("medicalJournal.welcomeMessage")}{" "}
                                    {user?.name ||
                                        t("medicalJournal.userFallback")}
                                    !
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() =>
                                        logout({
                                            logoutParams: {
                                                returnTo: `${window.location.origin}/medical-journal`,
                                            },
                                        })
                                    }
                                    sx={{
                                        textTransform: "none",
                                        fontWeight: 500,
                                        borderRadius: 2,
                                    }}
                                >
                                    {t("medicalJournal.logoutButton")}
                                </Button>
                            </Box>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>
                                    loginWithRedirect({
                                        appState: {
                                            returnTo: "/medical-journal",
                                        },
                                        authorizationParams: {
                                            audience:
                                                process.env
                                                    .NEXT_PUBLIC_AUTH0_AUDIENCE,
                                            prompt: "consent",
                                        },
                                    })
                                }
                                sx={{
                                    textTransform: "none",
                                    fontWeight: 500,
                                    borderRadius: 2,
                                    px: 3,
                                }}
                            >
                                {t("medicalJournal.loginButton")}
                            </Button>
                        )}
                    </Box>
                )}
            </Box>

            <Fade in={activeTab === 0}>
                <Box sx={{ display: activeTab === 0 ? "block" : "none" }}>
                    {/* Learning Objectives Section */}
                    <Grid container spacing={3}>
                        {LEARNING_OBJECTIVES.map((category, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        transition: "transform 0.2s",
                                        "&:hover": {
                                            transform: "translateY(-4px)",
                                            boxShadow: theme.shadows[8],
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                mb: 2,
                                            }}
                                        >
                                            {index === 0 && (
                                                <LocalHospitalIcon
                                                    sx={{
                                                        mr: 1,
                                                        color: theme.palette
                                                            .primary.main,
                                                    }}
                                                />
                                            )}
                                            {index === 1 && (
                                                <SchoolIcon
                                                    sx={{
                                                        mr: 1,
                                                        color: theme.palette
                                                            .secondary.main,
                                                    }}
                                                />
                                            )}
                                            {index === 2 && (
                                                <AssignmentIcon
                                                    sx={{
                                                        mr: 1,
                                                        color: theme.palette
                                                            .success.main,
                                                    }}
                                                />
                                            )}
                                            <Typography
                                                variant="h6"
                                                component="h2"
                                                sx={{ fontWeight: 600 }}
                                            >
                                                {t(
                                                    `medicalJournal.category.${category.category}`
                                                )}
                                            </Typography>
                                        </Box>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box
                                            component="ul"
                                            sx={{ pl: 2, m: 0 }}
                                        >
                                            {category.objectives.map(
                                                (objective, objIndex) => (
                                                    <Box
                                                        component="li"
                                                        key={objIndex}
                                                        sx={{
                                                            mb: 1.5,
                                                            color: theme.palette
                                                                .text.secondary,
                                                        }}
                                                    >
                                                        {t(
                                                            `medicalJournal.objective.${objective}`
                                                        )}
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
                                gap: 5,
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 600, whiteSpace: "nowrap" }}
                            >
                                {t("medicalJournal.clinicalEncountersTitle")}
                            </Typography>

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
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
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
                                    }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <TableContainer sx={{ overflowX: "auto" }}>
                            {" "}
                            <Table>
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            borderBottom: `2px solid ${theme.palette.divider}`,
                                        }}
                                    >
                                        <TableCell
                                            sx={{
                                                cursor: "pointer",
                                                whiteSpace: "nowrap",
                                            }}
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
                                            }}
                                        >
                                            {t("medicalJournal.rotationColumn")}{" "}
                                            {sortField === "rotation" &&
                                                (sortOrder === "asc"
                                                    ? "↑"
                                                    : "↓")}
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 200 }}>
                                            {" "}
                                            {t(
                                                "medicalJournal.patientSettingColumn"
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 200 }}>
                                            {" "}
                                            {t(
                                                "medicalJournal.interactionColumn"
                                            )}
                                        </TableCell>
                                        <TableCell
                                            sx={{ whiteSpace: "nowrap" }}
                                        >
                                            {t("medicalJournal.hospitalColumn")}
                                        </TableCell>
                                        <TableCell
                                            sx={{ whiteSpace: "nowrap" }}
                                        >
                                            {t("medicalJournal.doctorColumn")}
                                        </TableCell>
                                        <TableCell sx={{ minWidth: 250 }}>
                                            {" "}
                                            {t(
                                                "medicalJournal.canmedsRolesColumn"
                                            )}
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
                                        <TableRow
                                            key={entry.id}
                                            sx={{
                                                borderBottom: `1px solid ${theme.palette.divider}`,
                                                "&:hover": {
                                                    backgroundColor: alpha(
                                                        theme.palette.primary
                                                            .main,
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
                                                        backgroundColor: alpha(
                                                            theme.palette
                                                                .primary.main,
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
                                                    height: "100%",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 5,
                                                        WebkitBoxOrient:
                                                            "vertical",
                                                        whiteSpace: "normal",
                                                    }}
                                                >
                                                    {entry.patientsetting ||
                                                        "N/A"}{" "}
                                                </Box>
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    verticalAlign: "middle",
                                                    height: "100%",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 5,
                                                        WebkitBoxOrient:
                                                            "vertical",
                                                        whiteSpace: "normal",
                                                    }}
                                                >
                                                    {entry.interaction ||
                                                        "N/A"}{" "}
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
                                                    WebkitBoxOrient: "vertical",
                                                    whiteSpace: "normal",
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: 0.5,
                                                    }}
                                                >
                                                    {entry.canmedsroles
                                                        ?.length > 0
                                                        ? entry.canmedsroles.map(
                                                              (role) => (
                                                                  <Chip
                                                                      key={role}
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
                                                        : "N/A"}{" "}
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
                                                                    .error.main,
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
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
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
                                    {ROTATIONS.map((rotation) => (
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
                                    {LOCATIONS.map((location) => (
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
                                    value={currentEntry.canmedsroles || []}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "canmedsroles",
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
                                value={currentEntry.patientsetting}
                                onChange={(e) =>
                                    handleInputChange(
                                        "patientsetting",
                                        e.target.value
                                    )
                                }
                                error={!!errors.patientsetting}
                                helperText={
                                    errors.patientsetting
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
                                {t("medicalJournal.learningObjectivesLabel")}
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
                                    {LEARNING_OBJECTIVES.map((category) =>
                                        category.objectives.map((objective) => (
                                            <MenuItem
                                                key={objective}
                                                value={objective}
                                            >
                                                {objective}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
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
        </Container>
    );
}

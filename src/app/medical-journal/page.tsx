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
    InputLabel,
    Select,
    MenuItem,
    Paper,
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
} from "@mui/material";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TimelineIcon from "@mui/icons-material/Timeline";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import SchoolIcon from "@mui/icons-material/School";
import DropdownComponent from "@/components/shared/DropdownComponent";

interface LearningEntry {
    id: string;
    patientSetting: string;
    interaction: string;
    canmedsRoles: string[];
    learningObjectives: string[];
    rotation: string;
    date: string;
    location: string;
    hospital?: string; // Optional property
    doctor?: string;   // Optional property
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
        ]
    },
    {
        category: "Clinical Skills",
        objectives: [
            "Perform focused history and physical examination",
            "Document patient encounters accurately",
            "Develop and implement management plans",
            "Follow-up on investigation results",
        ]
    },
    {
        category: "Communication",
        objectives: [
            "Clear communication with patients and families",
            "Effective handover to other healthcare providers",
            "Appropriate consultation with specialists",
            "Documentation of clinical reasoning",
        ]
    }
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
        hospital: "", // Reset hospital
        doctor: "",   // Reset doctor
    });
    const [editingEntry, setEditingEntry] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [errors, setErrors] = useState<{ [key in keyof LearningEntry]?: boolean }>({});

    const [sortField, setSortField] = useState<keyof LearningEntry>("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [filters, setFilters] = useState<{ rotation?: string; location?: string }>({});

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
            if (filters.rotation && entry.rotation !== filters.rotation) return false;
            if (filters.location && entry.location !== filters.location) return false;
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

    const handleInputChange = (field: keyof LearningEntry, value: any) => {
        setCurrentEntry(prev => ({
            ...prev,
            [field]: value
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

    const handleSaveEntry = () => {
        if (!validateFields()) return;
        if (editingEntry) {
            setEntries(prev => prev.map(entry =>
                entry.id === editingEntry ? { ...currentEntry } : entry
            ));
            setEditingEntry(null);
        } else {
            const newEntry = {
                ...currentEntry,
                id: Date.now().toString()
            };
            setEntries(prev => [...prev, newEntry]);
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
            hospital: "", // Reset hospital
            doctor: "",   // Reset doctor
        });
        setIsEditDialogOpen(false);
    };

    const handleDeleteEntry = (id: string) => {
        setEntries(prev => prev.filter(entry => entry.id !== id));
    };

    const handleEditEntry = (entry: LearningEntry) => {
        setCurrentEntry(entry);
        setEditingEntry(entry.id);
        setIsEditDialogOpen(true);
    };

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
            hospital: "", // Reset hospital
            doctor: "",   // Reset doctor
        });
    };

    const getCanMEDSColor = (role: string) => {
        const colors: { [key: string]: string } = {
            "Medical Expert": theme.palette.primary.main,
            "Scholar": theme.palette.secondary.main,
            "Communicator": "#4CAF50",
            "Professional": "#9C27B0",
            "Leader": "#FF9800",
            "Health Advocate": "#E91E63",
            "Collaborator": "#00BCD4",
        };
        return colors[role] || theme.palette.grey[500];
    };

    return (
        <Container maxWidth="lg">
            {/* Fixed Language Switcher and Home Button */}
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

            <Box sx={{
                mt: 8,
                mb: 4,
                background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                borderRadius: 2,
                p: 4,
                boxShadow: theme.shadows[1]
            }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    align="center"
                    sx={{
                        fontWeight: 700,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}
                >
                    Learning Objectives in EM
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Tabs
                        value={activeTab}
                        onChange={(_, newValue) => setActiveTab(newValue)}
                        sx={{
                            '& .MuiTab-root': {
                                minWidth: 120,
                                fontWeight: 600,
                            }
                        }}
                    >
                        <Tab
                            icon={<AssignmentIcon />}
                            label="Objectives"
                            iconPosition="start"
                        />
                        <Tab
                            icon={<TimelineIcon />}
                            label="Encounters"
                            iconPosition="start"
                        />
                    </Tabs>
                </Box>
            </Box>

            <Fade in={activeTab === 0}>
                <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
                    {/* Learning Objectives Section */}
                    <Grid container spacing={3}>
                        {LEARNING_OBJECTIVES.map((category, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: theme.shadows[8]
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            {index === 0 && <LocalHospitalIcon sx={{ mr: 1, color: theme.palette.primary.main }} />}
                                            {index === 1 && <SchoolIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />}
                                            {index === 2 && <AssignmentIcon sx={{ mr: 1, color: theme.palette.success.main }} />}
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {category.category}
                                            </Typography>
                                        </Box>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box component="ul" sx={{ pl: 2, m: 0 }}>
                                            {category.objectives.map((objective, objIndex) => (
                                                <Box
                                                    component="li"
                                                    key={objIndex}
                                                    sx={{
                                                        mb: 1.5,
                                                        color: theme.palette.text.secondary
                                                    }}
                                                >
                                                    {objective}
                                                </Box>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Fade>

            <Fade in={activeTab === 1}>
                <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
                    {/* Entries Table */}
                    <Card
                        sx={{
                            mb: 4,
                            overflow: 'hidden',
                            boxShadow: theme.shadows[3]
                        }}
                    >
                        <Box
                            sx={{
                                p: 2,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                                borderBottom: `1px solid ${theme.palette.divider}`
                            }}
                        >
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Clinical Encounters
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => setIsEditDialogOpen(true)}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    px: 3
                                }}
                            >
                                Add Entry
                            </Button>
                        </Box>
                        <TableContainer>
                            <Box sx={{ p: 2, display: "flex", gap: 2 }}>
                                <Box sx={{ display: "flex", flexDirection: "column", minWidth: 200 }}>
                                    <FormControl size="small">
                                        <DropdownComponent
                                            currentSelected={filters.rotation || ""}
                                            onChange={(value) => handleFilterChange("rotation", value)}
                                            items={[
                                                { key: "all", label: "All", value: "" },
                                                ...ROTATIONS.map((rotation) => ({ key: rotation, label: rotation, value: rotation }))
                                            ]}
                                            title="Rotation"
                                            titleLocation="left"
                                        />
                                    </FormControl>
                                </Box>
                                <Box sx={{ display: "flex", flexDirection: "column", minWidth: 200 }}>
                                    <FormControl size="small">
                                        <DropdownComponent
                                            currentSelected={filters.location || ""}
                                            onChange={(value) => handleFilterChange("location", value)}
                                            items={[
                                                { key: "all", label: "All", value: "" },
                                                ...LOCATIONS.map((location) => ({ key: location, label: location, value: location }))
                                            ]}
                                            title="Location"
                                            titleLocation="left"
                                        />
                                    </FormControl>
                                </Box>
                            </Box>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell onClick={() => handleSort("date")} sx={{ cursor: "pointer" }}>
                                            Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                                        </TableCell>
                                        <TableCell onClick={() => handleSort("rotation")} sx={{ cursor: "pointer" }}>
                                            Rotation {sortField === "rotation" && (sortOrder === "asc" ? "↑" : "↓")}
                                        </TableCell>
                                        <TableCell>Patient/Setting</TableCell>
                                        <TableCell>Interaction</TableCell>
                                        <TableCell>Hospital</TableCell>
                                        <TableCell>Doctor</TableCell>
                                        <TableCell>CanMEDS Roles</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredAndSortedEntries.map((entry) => (
                                        <TableRow
                                            key={entry.id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: alpha(theme.palette.primary.main, 0.04)
                                                }
                                            }}
                                        >
                                            <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={entry.rotation}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                                        color: theme.palette.primary.main,
                                                        fontWeight: 500
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell>{entry.patientSetting}</TableCell>
                                            <TableCell>{entry.interaction}</TableCell>
                                            <TableCell>{entry.hospital || "N/A"}</TableCell>
                                            <TableCell>{entry.doctor || "N/A"}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {entry.canmedsRoles.map((role) => (
                                                        <Chip
                                                            key={role}
                                                            label={role}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: alpha(getCanMEDSColor(role), 0.1),
                                                                color: getCanMEDSColor(role),
                                                                fontWeight: 500
                                                            }}
                                                        />
                                                    ))}
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                    <Tooltip title="Edit Entry">
                                                        <IconButton
                                                            onClick={() => handleEditEntry(entry)}
                                                            size="small"
                                                            sx={{
                                                                color: theme.palette.primary.main,
                                                                '&:hover': {
                                                                    backgroundColor: alpha(theme.palette.primary.main, 0.1)
                                                                }
                                                            }}
                                                        >
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Delete Entry">
                                                        <IconButton
                                                            onClick={() => handleDeleteEntry(entry.id)}
                                                            size="small"
                                                            sx={{
                                                                color: theme.palette.error.main,
                                                                '&:hover': {
                                                                    backgroundColor: alpha(theme.palette.error.main, 0.1)
                                                                }
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
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{
                    background: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                    py: 2,
                    mb: 2
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {editingEntry ? "Edit Entry" : "Add New Entry"}
                    </Typography>
                </DialogTitle>
                <DialogContent sx={{ pt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                Date
                            </Typography>
                            <TextField
                                fullWidth
                                type="date"
                                value={currentEntry.date}
                                onChange={(e) => handleInputChange("date", e.target.value)}
                                error={!!errors.date}
                                helperText={errors.date ? "This field is required" : ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                Rotation
                            </Typography>
                            <FormControl fullWidth error={!!errors.rotation}>
                                <Select
                                    value={currentEntry.rotation}
                                    onChange={(e) => handleInputChange("rotation", e.target.value)}
                                >
                                    {ROTATIONS.map((rotation) => (
                                        <MenuItem key={rotation} value={rotation}>
                                            {rotation}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.rotation && (
                                    <Typography variant="caption" color="error">
                                        This field is required
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                Location
                            </Typography>
                            <FormControl fullWidth error={!!errors.location}>
                                <Select
                                    value={currentEntry.location}
                                    onChange={(e) => handleInputChange("location", e.target.value)}
                                >
                                    {LOCATIONS.map((location) => (
                                        <MenuItem key={location} value={location}>
                                            {location}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.location && (
                                    <Typography variant="caption" color="error">
                                        This field is required
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                CanMEDS Roles
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    multiple
                                    value={currentEntry.canmedsRoles}
                                    onChange={(e) => handleInputChange("canmedsRoles", e.target.value)}
                                    input={<OutlinedInput />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: alpha(getCanMEDSColor(value), 0.1),
                                                        color: getCanMEDSColor(value),
                                                        fontWeight: 500
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
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                Patient/Setting
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                value={currentEntry.patientSetting}
                                onChange={(e) => handleInputChange("patientSetting", e.target.value)}
                                error={!!errors.patientSetting}
                                helperText={errors.patientSetting ? "This field is required" : ""}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                Interaction
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                value={currentEntry.interaction}
                                onChange={(e) => handleInputChange("interaction", e.target.value)}
                                error={!!errors.interaction}
                                helperText={errors.interaction ? "This field is required" : ""}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                Hospital
                            </Typography>
                            <TextField
                                fullWidth
                                value={currentEntry.hospital || ""}
                                onChange={(e) => handleInputChange("hospital", e.target.value)}
                                placeholder="Enter hospital name"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                Doctor
                            </Typography>
                            <TextField
                                fullWidth
                                value={currentEntry.doctor || ""}
                                onChange={(e) => handleInputChange("doctor", e.target.value)}
                                placeholder="Enter doctor's name"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                                Learning Objectives
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    multiple
                                    value={currentEntry.learningObjectives}
                                    onChange={(e) => handleInputChange("learningObjectives", e.target.value)}
                                    input={<OutlinedInput />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip
                                                    key={value}
                                                    label={value}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: alpha(theme.palette.info.main, 0.1),
                                                        color: theme.palette.info.main,
                                                        fontWeight: 500
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {LEARNING_OBJECTIVES.map((category) => (
                                        category.objectives.map((objective) => (
                                            <MenuItem key={objective} value={objective}>
                                                {objective}
                                            </MenuItem>
                                        ))
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3, background: alpha(theme.palette.background.default, 0.5) }}>
                    <Button
                        onClick={handleCloseEditDialog}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveEntry}
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        sx={{
                            textTransform: 'none',
                            fontWeight: 500,
                            px: 3,
                            borderRadius: 2
                        }}
                    >
                        {editingEntry ? "Save Changes" : "Add Entry"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
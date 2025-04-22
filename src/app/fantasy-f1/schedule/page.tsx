'use client';

import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Skeleton,
    Box,
    Card,
    CardContent,
    CardHeader,
    Collapse,
    IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import F1DropdownNav from '@/components/features/fantasy/F1DropdownNav';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Event {
    RoundNumber: number;
    Country: string;
    Location: string;
    OfficialEventName: string;
    EventDate: string;
    EventName: string;
    EventFormat: string;
    Session1: string;
    Session1Date: string | null;
    Session2: string;
    Session2Date: string | null;
    Session3: string;
    Session3Date: string | null;
    Session4: string;
    Session4Date: string | null;
    Session5: string;
    Session5Date: string | null;
}

const SchedulePage = () => {
    const theme = useTheme();
    const [schedule, setSchedule] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [season, setSeason] = useState<string>(new Date().getFullYear().toString());
    const [availableYears, setAvailableYears] = useState<string[]>([]);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => (1950 + i).toString());
        setAvailableYears(years.reverse());
    }, []);

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/f1/schedule/${season}`);
                const data = await response.json();
                setSchedule(data);
            } catch (error) {
                console.error('Error fetching schedule:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedule();
    }, [season]);

    const handleRowExpand = (roundNumber: number) => {
        setExpandedRow(expandedRow === roundNumber ? null : roundNumber);
    };

    return (
        <Container sx={{ gap: 2, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <F1DropdownNav />
            </Box>
            <Card elevation={3} sx={{ mb: 3 }}>
                <CardHeader
                    title={`F1 Season Schedule ${season ? `(${season})` : ''}`}
                    sx={{
                        textAlign: 'center',
                        '& .MuiCardHeader-title': {
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                        },
                    }}
                />
                <CardContent>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="year-selector-label">Select Year</InputLabel>
                        <Select
                            labelId="year-selector-label"
                            value={season}
                            onChange={(e) => setSeason(e.target.value)}
                            label="Select Year"
                        >
                            {availableYears.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>
            <TableContainer
                component={Paper}
                elevation={3}
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'white',
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    color={theme.palette.mode === 'dark' ? 'grey.300' : 'text.primary'}
                                >
                                    Round
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    color={theme.palette.mode === 'dark' ? 'grey.300' : 'text.primary'}
                                >
                                    Event Name
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    color={theme.palette.mode === 'dark' ? 'grey.300' : 'text.primary'}
                                >
                                    Location
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                    color={theme.palette.mode === 'dark' ? 'grey.300' : 'text.primary'}
                                >
                                    Date
                                </Typography>
                            </TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading
                            ? Array.from({ length: 10 }).map((_, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Skeleton variant="text" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="circular" width={24} height={24} />
                                    </TableCell>
                                </TableRow>
                            ))
                            : schedule.map((event) => (
                                <React.Fragment key={event.RoundNumber}>
                                    <TableRow>
                                        <TableCell>{event.RoundNumber}</TableCell>
                                        <TableCell>{event.EventName}</TableCell>
                                        <TableCell>{`${event.Location}, ${event.Country}`}</TableCell>
                                        <TableCell>{new Date(event.EventDate).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() => handleRowExpand(event.RoundNumber)}
                                                aria-label="expand row"
                                            >
                                                <ExpandMoreIcon
                                                    sx={{
                                                        transform:
                                                            expandedRow === event.RoundNumber
                                                                ? 'rotate(180deg)'
                                                                : 'rotate(0deg)',
                                                        transition: 'transform 0.2s',
                                                    }}
                                                />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={5} sx={{ p: 0 }}>
                                            <Collapse
                                                in={expandedRow === event.RoundNumber}
                                                timeout="auto"
                                                unmountOnExit
                                            >
                                                <Box
                                                    sx={{
                                                        p: 2,
                                                        backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight="bold"
                                                        color={theme.palette.mode === 'dark' ? 'grey.300' : 'text.primary'}
                                                    >
                                                        Sessions
                                                    </Typography>
                                                    <ul>
                                                        {event.Session1 && (
                                                            <li>
                                                                {event.Session1}: {new Date(event.Session1Date!).toLocaleString()}
                                                            </li>
                                                        )}
                                                        {event.Session2 && (
                                                            <li>
                                                                {event.Session2}: {new Date(event.Session2Date!).toLocaleString()}
                                                            </li>
                                                        )}
                                                        {event.Session3 && (
                                                            <li>
                                                                {event.Session3}: {new Date(event.Session3Date!).toLocaleString()}
                                                            </li>
                                                        )}
                                                        {event.Session4 && event.Session4Date && (
                                                            <li>
                                                                {event.Session4}: {new Date(event.Session4Date).toLocaleString()}
                                                            </li>
                                                        )}
                                                        {event.Session5 && event.Session5Date && (
                                                            <li>
                                                                {event.Session5}: {new Date(event.Session5Date).toLocaleString()}
                                                            </li>
                                                        )}
                                                    </ul>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                    </TableBody >
                </Table >
            </TableContainer >
        </Container >
    );
};

export default SchedulePage;

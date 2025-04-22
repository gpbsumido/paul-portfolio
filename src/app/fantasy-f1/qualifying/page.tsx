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
} from '@mui/material';
import F1DropdownNav from '@/components/features/fantasy/F1DropdownNav';

interface QualifyingResult {
    position: string;
    Driver: {
        driverId: string;
        givenName: string;
        familyName: string;
    };
    Constructor: {
        name: string;
    };
    Q1: string;
    Q2?: string;
    Q3?: string;
}

const QualifyingPage = () => {
    const [qualifyingResults, setQualifyingResults] = useState<QualifyingResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [season, setSeason] = useState<string>(new Date().getFullYear().toString());
    const [round, setRound] = useState<string>('1');
    const [availableRounds, setAvailableRounds] = useState<string[]>([]);
    const [availableYears, setAvailableYears] = useState<string[]>([]);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => (1950 + i).toString());
        setAvailableYears(years.reverse());
    }, []);

    useEffect(() => {
        const fetchRounds = async () => {
            try {
                const response = await fetch(`http://ergast.com/api/f1/${season}.json`);
                const data = await response.json();
                const rounds = data.MRData.RaceTable.Races.map((race: any) => race.round);
                setAvailableRounds(rounds);
            } catch (error) {
                console.error('Error fetching rounds:', error);
            }
        };

        fetchRounds();
    }, [season]);

    useEffect(() => {
        const fetchQualifyingResults = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://ergast.com/api/f1/${season}/${round}/qualifying.json`);
                const data = await response.json();
                const results = data.MRData.RaceTable.Races[0]?.QualifyingResults || [];
                setQualifyingResults(results);
            } catch (error) {
                console.error('Error fetching qualifying results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQualifyingResults();
    }, [season, round]);

    return (
        <Container sx={{ gap: 2, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <F1DropdownNav />
            </Box>
            <Card elevation={3} sx={{ mb: 3 }}>
                <CardHeader
                    title={`F1 Qualifying Results ${season ? `(${season})` : ''} - Round ${round}`}
                    titleTypography={{ variant: 'h5', align: 'center' }}
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
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="round-selector-label">Select Round</InputLabel>
                        <Select
                            labelId="round-selector-label"
                            value={round}
                            onChange={(e) => setRound(e.target.value)}
                            label="Select Round"
                        >
                            {availableRounds.map((round) => (
                                <MenuItem key={round} value={round}>
                                    Round {round}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </CardContent>
            </Card>
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Position
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Driver
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Constructor
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Q1
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Q2
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Q3
                                </Typography>
                            </TableCell>
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
                                        <Skeleton variant="text" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton variant="text" />
                                    </TableCell>
                                </TableRow>
                            ))
                            : qualifyingResults.map((result) => (
                                <TableRow key={result.Driver.driverId}>
                                    <TableCell>{result.position}</TableCell>
                                    <TableCell>{`${result.Driver.givenName} ${result.Driver.familyName}`}</TableCell>
                                    <TableCell>{result.Constructor.name}</TableCell>
                                    <TableCell>{result.Q1}</TableCell>
                                    <TableCell>{result.Q2 || 'N/A'}</TableCell>
                                    <TableCell>{result.Q3 || 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default QualifyingPage;

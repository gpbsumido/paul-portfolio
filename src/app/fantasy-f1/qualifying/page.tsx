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
    useTheme,
} from '@mui/material';
import F1DropdownNav from '@/components/features/fantasy/F1DropdownNav';
import { HomeButton } from '@/components/common/HomeButton';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import Link from 'next/link';
import DropdownComponent from '@/components/shared/DropdownComponent';

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

    const theme = useTheme();
    const [qualifyingResults, setQualifyingResults] = useState<QualifyingResult[]>([]);
    const [loading, setLoading] = useState(true);
    const currentYear = new Date().getFullYear();
    const [season, setSeason] = useState<string>((currentYear - 1).toString());
    const [round, setRound] = useState<string>('1');
    const [availableRounds, setAvailableRounds] = useState<string[]>([]);
    const [availableYears, setAvailableYears] = useState<string[]>([]);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => (1950 + i).toString());
        setAvailableYears(years.reverse().slice(1, years.length - 1));
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
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden',
                py: 4,
                margin: 'auto',
            }}
            maxWidth={'lg'}
        >
            <Box
                sx={{
                    position: "fixed",
                    top: { xs: "8px", sm: "16px" },
                    left: { xs: "8px", sm: "16px" },
                    zIndex: 9999,
                }}
            >
                <HomeButton component={Link} href="/" />
            </Box>
            <Box
                sx={{
                    position: "fixed",
                    top: { xs: "8px", sm: "16px" },
                    right: { xs: "8px", sm: "16px" },
                    zIndex: 9999,
                }}
            >
                <LanguageSwitcher />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                <F1DropdownNav />
            </Box>
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                <Card elevation={3} sx={{ mb: 3, minHeight: 'fit-content' }}>
                    <CardHeader
                        title={`F1 Qualifying Results ${season ? `(${season})` : ''} - Round ${round}`}
                        sx={{
                            textAlign: 'center',
                            '& .MuiCardHeader-title': {
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <CardContent sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                        <DropdownComponent
                            title="Year"
                            items={availableYears.map((yr) => ({
                                key: yr,
                                label: yr,
                                value: yr,
                            }))}
                            currentSelected={season}
                            onChange={(value) => setSeason(value as string)}
                            titleLocation="left"
                            minWidth={'8em'}
                        />
                        <DropdownComponent
                            title="Round"
                            items={availableRounds.map((round) => ({
                                key: round,
                                label: round,
                                value: round,
                            }))}
                            currentSelected={round}
                            onChange={(value) => setRound(value as string)}
                            titleLocation="left"
                            minWidth={'8em'}
                        />
                    </CardContent>
                </Card>
                <TableContainer
                    component={Paper}
                    elevation={3}
                    sx={{
                        borderRadius: 2,
                        boxShadow: 2,
                        overflow: 'auto',
                        backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'white',
                    }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow
                                sx={{
                                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
                                }}
                            >
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
                                    <TableRow
                                        key={result.Driver.driverId}
                                        sx={{
                                            backgroundColor:
                                                theme.palette.mode === "dark"
                                                    ? theme.palette.grey[900]
                                                    : theme.palette.grey[50],
                                            '&:hover': {
                                                backgroundColor:
                                                    theme.palette.mode === 'dark'
                                                        ? 'rgba(255, 255, 255, 0.1)'
                                                        : 'rgba(0, 0, 0, 0.08)',
                                            },
                                        }}
                                    >
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
        </Box>
    );
};

export default QualifyingPage;

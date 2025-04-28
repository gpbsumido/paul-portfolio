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
    Box,
    Card,
    CardContent,
    CardHeader,
    Collapse,
    IconButton,
    Skeleton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import F1DropdownNav from '@/components/features/fantasy/F1DropdownNav';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { HomeButton } from '@/components/common/HomeButton';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import Link from 'next/link';
import DropdownComponent from '@/components/shared/DropdownComponent';

interface Event {
    event: {
        name: string;
        year: number;
        round: number;
        date: string;
    };
    points: Record<
        string,
        {
            total: number;
            qualifying: {
                points: number;
                breakdown: Record<string, number>;
            };
            race: {
                points: number;
                breakdown: Record<string, number>;
            };
        }
    >;
}

const FantasyScoringPage = () => {
    const theme = useTheme();
    const [data, setData] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedDriver, setExpandedDriver] = useState<string | null>(null);
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());
    const [round, setRound] = useState<string>('');
    const [availableYears, setAvailableYears] = useState<string[]>([]);
    const [availableRounds, setAvailableRounds] = useState<string[]>([]);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => (1950 + i).toString());
        setAvailableYears(years.reverse());
    }, []);

    useEffect(() => {
        const fetchRounds = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/f1/schedule/${year}`);
                const data = await response.json();
                const rounds = data.map((event: { RoundNumber: number }) => event.RoundNumber.toString());
                setAvailableRounds(rounds);

                const latestRound = data
                    .filter((event: { EventDate: string }) => new Date(event.EventDate) <= new Date())
                    .reduce((latest: { EventDate: string | number | Date; RoundNumber: number } | null, event: { RoundNumber: number; EventDate: string }) => {
                        return !latest || new Date(event.EventDate) > new Date(latest.EventDate) ? event : latest;
                    }, null);

                if (latestRound) {
                    setRound(latestRound.RoundNumber.toString());
                } else if (rounds.length > 0) {
                    setRound(rounds[0]); // Default to the first round if no latest round is found
                }
            } catch (error) {
                console.error('Error fetching rounds:', error);
            }
        };

        fetchRounds();
    }, [year]);

    useEffect(() => {
        const fetchScoringData = async () => {
            if (!round) return; // Ensure round is set before fetching data
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fantasy/points/${year}/${round}`);
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error('Error fetching scoring data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchScoringData();
    }, [year, round]);

    const handleRowExpand = (driver: string) => {
        setExpandedDriver(expandedDriver === driver ? null : driver);
    };

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
                <Card elevation={3} sx={{ mb: 3, p: 2, height: 'fit-content' }}>
                    <CardHeader
                        title={`Fantasy Scoring - ${data?.event?.name || 'Loading...'}`}
                        subheader={`Round ${data?.event?.round || ''} - ${data?.event?.date || ''}`}
                        sx={{
                            textAlign: 'center',
                            '& .MuiCardHeader-title': {
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                            },
                            '& .MuiCardHeader-subheader': {
                                fontSize: '1rem',
                                color: theme.palette.text.secondary,
                            },
                        }}
                    />
                    <Typography variant="body2" color="textSecondary" align="center">
                        Disclaimer: Data may load slowly or fail to load due to rate-limited APIs.
                    </Typography>
                    <CardContent sx={{ height: 'fit-content' }}>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                            <DropdownComponent
                                items={availableYears.map((yr) => ({
                                    key: yr,
                                    label: yr,
                                    value: yr,
                                }))}
                                currentSelected={year}
                                onChange={(value) => setYear(value as string)}
                                title="Year:"
                                titleLocation="left"
                            />
                            <DropdownComponent
                                items={availableRounds.map((rnd) => ({
                                    key: rnd,
                                    label: `Round ${rnd}`,
                                    value: rnd,
                                }))}
                                currentSelected={round}
                                onChange={(value) => setRound(value as string)}
                                title="Round:"
                                titleLocation="left"
                            />
                        </Box>
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
                        maxHeight: 'calc(100vh - 30em)',
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
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        color={theme.palette.mode === 'dark' ? 'grey.300' : 'text.primary'}
                                    >
                                        Driver
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        color={theme.palette.mode === 'dark' ? 'grey.300' : 'text.primary'}
                                    >
                                        Total Points
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        color={theme.palette.mode === 'dark' ? 'grey.300' : 'text.primary'}
                                    >
                                        Qualifying Points
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        color={theme.palette.mode === 'dark' ? 'grey.300' : 'text.primary'}
                                    >
                                        Race Points
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
                                : Object.entries(data?.points || {})
                                    .sort(([, a], [, b]) => b.total - a.total)
                                    .map(([driver, details]) => (
                                        <React.Fragment key={driver}>
                                            <TableRow
                                                sx={{
                                                    '&:nth-of-type(odd)': {
                                                        backgroundColor:
                                                            theme.palette.mode === 'dark'
                                                                ? 'rgba(255, 255, 255, 0.05)'
                                                                : 'rgba(0, 0, 0, 0.04)',
                                                    },
                                                    '&:hover': {
                                                        backgroundColor:
                                                            theme.palette.mode === 'dark'
                                                                ? 'rgba(255, 255, 255, 0.1)'
                                                                : 'rgba(0, 0, 0, 0.08)',
                                                    },
                                                }}
                                            >
                                                <TableCell>{driver}</TableCell>
                                                <TableCell>{details.total}</TableCell>
                                                <TableCell>{details.qualifying.points}</TableCell>
                                                <TableCell>{details.race.points}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => handleRowExpand(driver)}
                                                        aria-label="expand row"
                                                    >
                                                        <ExpandMoreIcon
                                                            sx={{
                                                                transform:
                                                                    expandedDriver === driver
                                                                        ? 'rotate(180deg)'
                                                                        : 'rotate(0deg)',
                                                                transition: 'transform 0.2s',
                                                            }}
                                                        />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
                                                    <Collapse
                                                        in={expandedDriver === driver}
                                                        timeout="auto"
                                                        unmountOnExit
                                                    >
                                                        <Box
                                                            sx={{
                                                                p: 3,
                                                                backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                                                                borderTop: `1px solid ${theme.palette.divider}`,
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="h6"
                                                                fontWeight="bold"
                                                                color={theme.palette.mode === 'dark' ? 'grey.300' : 'text.primary'}
                                                                gutterBottom
                                                            >
                                                                Qualifying Breakdown
                                                            </Typography>
                                                            <Box
                                                                component="ul"
                                                                sx={{
                                                                    listStyle: 'none',
                                                                    m: 0,
                                                                    p: 0,
                                                                    pl: 2,
                                                                }}
                                                            >
                                                                {Object.entries(details.qualifying.breakdown).map(
                                                                    ([key, value]) => (
                                                                        <Box
                                                                            component="li"
                                                                            key={key}
                                                                            sx={{
                                                                                display: 'flex',
                                                                                justifyContent: 'space-between',
                                                                                py: 0.5,
                                                                            }}
                                                                        >
                                                                            <Typography
                                                                                variant="body2"
                                                                                color={theme.palette.text.secondary}
                                                                            >
                                                                                {key}
                                                                            </Typography>
                                                                            <Typography
                                                                                variant="body2"
                                                                                fontWeight="bold"
                                                                            >
                                                                                {value}
                                                                            </Typography>
                                                                        </Box>
                                                                    )
                                                                )}
                                                            </Box>
                                                            <Typography
                                                                variant="h6"
                                                                fontWeight="bold"
                                                                color={theme.palette.mode === 'dark' ? 'grey.300' : 'text.primary'}
                                                                gutterBottom
                                                                sx={{ mt: 3 }}
                                                            >
                                                                Race Breakdown
                                                            </Typography>
                                                            <Box
                                                                component="ul"
                                                                sx={{
                                                                    listStyle: 'none',
                                                                    m: 0,
                                                                    p: 0,
                                                                    pl: 2,
                                                                }}
                                                            >
                                                                {Object.entries(details.race.breakdown).map(
                                                                    ([key, value]) => (
                                                                        <Box
                                                                            component="li"
                                                                            key={key}
                                                                            sx={{
                                                                                display: 'flex',
                                                                                justifyContent: 'space-between',
                                                                                py: 0.5,
                                                                            }}
                                                                        >
                                                                            <Typography
                                                                                variant="body2"
                                                                                color={theme.palette.text.secondary}
                                                                            >
                                                                                {key}
                                                                            </Typography>
                                                                            <Typography
                                                                                variant="body2"
                                                                                fontWeight="bold"
                                                                            >
                                                                                {value}
                                                                            </Typography>
                                                                        </Box>
                                                                    )
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
};

export default FantasyScoringPage;

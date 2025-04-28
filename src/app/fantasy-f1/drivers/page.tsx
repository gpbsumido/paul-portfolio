'use client';

import React, { useEffect, useState, useCallback } from 'react';
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
import ReactECharts from 'echarts-for-react';
import F1DropdownNav from '@/components/features/fantasy/F1DropdownNav';
import { HomeButton } from '@/components/common/HomeButton';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import Link from 'next/link';

interface Driver {
    name: string;
    points: number;
}

interface RaceResult {
    driver: string;
    name: string;
    points: number;
}

interface DriverPointsPerRace {
    round: number;
    race_name: string;
    results: RaceResult[];
}

const DriverStandingsPage = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [season, setSeason] = useState<string>(new Date().getFullYear().toString());
    const [availableYears, setAvailableYears] = useState<string[]>([]);
    const [pointsPerRace, setPointsPerRace] = useState<DriverPointsPerRace[]>([]);
    const [graphLoading, setGraphLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(true); // New state to track combined loading

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => (1950 + i).toString());
        setAvailableYears(years.reverse());
    }, []);

    const fetchF1Data = useCallback(async () => {
        try {
            const url =
                season === new Date().getFullYear().toString()
                    ? `${process.env.NEXT_PUBLIC_API_URL}/api/f1/driver-points/${season}`
                    : `https://ergast.com/api/f1/${season}/driverStandings.json`;

            const response = await fetch(url);
            const data = await response.json();

            const standings =
                season === new Date().getFullYear().toString()
                    ? data.results
                    : (data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || []).map((driver: any) => ({
                        name: `${driver.Driver.givenName} ${driver.Driver.familyName}`,
                        points: parseFloat(driver.points),
                    }));

            return standings;
        } catch (error) {
            console.error('Error fetching F1 data:', error);
            return [];
        }
    }, [season]);

    const fetchPointsPerRace = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/f1/driver-points-per-race/${season}`);
            const data = await response.json();
            return Array.isArray(data.results) ? data.results : [];
        } catch (error) {
            console.error('Error fetching points per race:', error);
            return [];
        }
    }, [season]);

    useEffect(() => {
        const fetchData = async () => {
            setDataLoading(true); // Start combined loading
            setLoading(true);
            setGraphLoading(true);

            setDrivers([]); // Clear drivers state to avoid showing stale data
            setPointsPerRace([]); // Clear pointsPerRace state to avoid stale graph data

            const [standings, points] = await Promise.all([fetchF1Data(), fetchPointsPerRace()]);

            setDrivers(standings);
            setPointsPerRace(points);

            setLoading(false);
            setGraphLoading(false);
            setDataLoading(false); // End combined loading
        };

        fetchData();
    }, [season, fetchF1Data, fetchPointsPerRace]);

    const chartOptions = {
        title: {
            text: 'Cumulative Points Progression Per Race',
            left: 'center',
        },
        tooltip: {
            trigger: 'axis',
            formatter: (params: any) => {
                const raceIndex = params[0]?.dataIndex; // Get the index of the race
                const raceName = pointsPerRace[raceIndex]?.race_name || 'Unknown Race'; // Get the race name
                let tooltipContent = `<strong>${raceName}</strong><br/>`;
                params
                    .sort((a: any, b: any) => b.value - a.value) // Sort by points in descending order
                    .forEach((item: any) => {
                        tooltipContent += `${item.marker} ${item.seriesName}: ${item.value}<br/>`;
                    });
                return tooltipContent;
            },
        },
        legend: {
            orient: 'vertical', // Set legend orientation to vertical
            right: 10, // Position legend on the right side
            top: 'middle', // Center the legend vertically
            type: 'scroll', // Enable scrolling for legends if there are too many items
        },
        grid: {
            top: 60, // Adjust top margin to make space for the title
            bottom: 50, // Adjust bottom margin for better spacing
            left: 50,
            right: 150, // Increased right margin to add more space between the graph and the legend
        },
        xAxis: {
            type: 'category',
            data: pointsPerRace.map((race) => race.round), // Use race numbers (round) for x-axis labels
        },
        yAxis: {
            type: 'value',
        },
        series: drivers.map((driver) => {
            let cumulativePoints = 0; // Track cumulative points
            return {
                name: driver.name,
                type: 'line',
                data: pointsPerRace.map((race) => {
                    if (!race.results || race.results.length === 0) {
                        return cumulativePoints; // No change if results are empty
                    }
                    const driverResult = race.results.find((result) => [result.driver, result.name].includes(driver.name));
                    cumulativePoints += driverResult ? driverResult.points : 0; // Add points to cumulative total
                    return cumulativePoints;
                }),
                smooth: true,
            };
        }),
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
            <Card elevation={3} sx={{ mb: 3, flexShrink: 0 }}>
                <CardHeader
                    title={`F1 Driver Standings ${season ? `(${season})` : ''}`}
                    sx={{
                        textAlign: 'center',
                        '& .MuiCardHeader-title': {
                            fontSize: '1.5rem',
                            fontWeight: 'bold',
                        },
                    }}
                />
                <CardContent sx={{ pb: 4 }}>
                    <FormControl fullWidth>
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
            <Box sx={{ my: 5, flexShrink: 0 }}> {/* Ensure the graph does not overlap */}
                {dataLoading ? (
                    <Skeleton variant="rectangular" height={400} />
                ) : (
                    <ReactECharts option={chartOptions} style={{ height: 400 }} />
                )}
            </Box>
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
                                    Points
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {dataLoading
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
                                </TableRow>
                            ))
                            : drivers.map((driver, index) => (
                                <TableRow key={driver.name}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{driver.name}</TableCell>
                                    <TableCell>{driver.points}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DriverStandingsPage;

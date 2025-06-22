"use client";

import React, { useEffect, useState } from "react";
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
    alpha,
} from "@mui/material";
import F1DropdownNav from "@/components/features/fantasy/F1DropdownNav";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import Link from "next/link";
import DropdownComponent from "@/components/shared/DropdownComponent";
import { useLanguage } from "@/contexts/LanguageContext";
import ErrorBoundary from "@/components/layout/ErrorBoundary";

interface Constructor {
    constructorId: string;
    name: string;
    nationality: string;
    points: string;
    position: string;
    wins: string;
}

const ConstructorStandingsPage = () => {
    const [constructors, setConstructors] = useState<Constructor[]>([]);
    const [loading, setLoading] = useState(true);
    const currentYear = new Date().getFullYear();
    const [season, setSeason] = useState<string>((currentYear - 1).toString());
    const [availableYears, setAvailableYears] = useState<string[]>([]);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) =>
            (1950 + i).toString()
        );
        setAvailableYears(years.reverse().slice(1, years.length - 1));
    }, []);

    useEffect(() => {
        const fetchConstructorData = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://ergast.com/api/f1/${season}/constructorStandings.json`
                );
                if (!response.ok) throw new Error("Ergast API failed");
                const data = await response.json();
                const standings =
                    data.MRData.StandingsTable.StandingsLists[0]
                        ?.ConstructorStandings || [];
                setConstructors(
                    standings.map((constructor: any) => ({
                        constructorId: constructor.Constructor.constructorId,
                        name: constructor.Constructor.name,
                        nationality: constructor.Constructor.nationality,
                        points: constructor.points,
                        position: constructor.position,
                        wins: constructor.wins,
                    }))
                );
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConstructorData();
    }, [season]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                overflow: "hidden",
                py: 4,
                margin: "auto",
            }}
            maxWidth={"lg"}
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
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                <ErrorBoundary>
                    <Card elevation={3} sx={{ mb: 3 }}>
                        <CardHeader
                            title={`F1 Constructor Standings ${season ? `(${season})` : ""}`}
                            sx={{
                                textAlign: "center",
                                "& .MuiCardHeader-title": {
                                    fontSize: "1.5rem",
                                    fontWeight: "bold",
                                },
                            }}
                        />
                        <CardContent
                            sx={{ display: "flex", justifyContent: "center" }}
                        >
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
                                minWidth={"8em"}
                            />
                        </CardContent>
                    </Card>
                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                        >
                                            Position
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                        >
                                            Constructor
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                        >
                                            Nationality
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                        >
                                            Points
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                        >
                                            Wins
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
                                          </TableRow>
                                      ))
                                    : constructors.map((constructor) => (
                                          <TableRow key={constructor.constructorId}>
                                              <TableCell>
                                                  {constructor.position}
                                              </TableCell>
                                              <TableCell>
                                                  {constructor.name}
                                              </TableCell>
                                              <TableCell>
                                                  {constructor.nationality}
                                              </TableCell>
                                              <TableCell>
                                                  {constructor.points}
                                              </TableCell>
                                              <TableCell>
                                                  {constructor.wins}
                                              </TableCell>
                                          </TableRow>
                                      ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </ErrorBoundary>
            </Container>
        </Box>
    );
};

export default ConstructorStandingsPage;

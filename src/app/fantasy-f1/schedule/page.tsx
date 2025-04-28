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
    Collapse,
    IconButton,
    Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import F1DropdownNav from "@/components/features/fantasy/F1DropdownNav";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { HomeButton } from "@/components/common/HomeButton";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import DropdownComponent from "@/components/shared/DropdownComponent";

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
    const { t } = useLanguage();
    const [schedule, setSchedule] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [season, setSeason] = useState<string>(
        new Date().getFullYear().toString()
    );
    const [availableYears, setAvailableYears] = useState<string[]>([]);
    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) =>
            (1950 + i).toString()
        );
        setAvailableYears(years.reverse());
    }, []);

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/f1/schedule/${season}`
                );
                if (!response.ok) {
                    throw new Error(
                        `Error fetching schedule: ${response.statusText}`
                    );
                }
                const data = await response.json();
                setSchedule(data);
            } catch (error) {
                console.error("Error fetching schedule:", error);
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
                    flex: "1 1 auto",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                <Card elevation={3} sx={{ mb: 3, flexShrink: 0 }}>
                    <CardHeader
                        title={`F1 Season Schedule ${season ? `(${season})` : ""}`}
                        sx={{
                            textAlign: "center",
                            "& .MuiCardHeader-title": {
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                            },
                        }}
                    />
                    <CardContent>
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            align="center"
                        >
                            Disclaimer: Data may load slowly or fail to load due
                            to rate-limited APIs.
                        </Typography>
                    </CardContent>
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
                <TableContainer
                    component={Paper}
                    elevation={3}
                    sx={{
                        flex: "1 1 auto",
                        borderRadius: 2,
                        boxShadow: 2,
                        overflow: "auto",
                        backgroundColor:
                            theme.palette.mode === "dark"
                                ? "grey.900"
                                : "white",
                    }}
                >
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow
                                sx={{
                                    backgroundColor:
                                        theme.palette.mode === "dark"
                                            ? "grey.800"
                                            : "grey.200",
                                }}
                            >
                                <TableCell>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        color={
                                            theme.palette.mode === "dark"
                                                ? "grey.300"
                                                : "text.primary"
                                        }
                                    >
                                        Round
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        color={
                                            theme.palette.mode === "dark"
                                                ? "grey.300"
                                                : "text.primary"
                                        }
                                    >
                                        Event Name
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        color={
                                            theme.palette.mode === "dark"
                                                ? "grey.300"
                                                : "text.primary"
                                        }
                                    >
                                        Location
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        color={
                                            theme.palette.mode === "dark"
                                                ? "grey.300"
                                                : "text.primary"
                                        }
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
                                              <Skeleton
                                                  variant="circular"
                                                  width={24}
                                                  height={24}
                                              />
                                          </TableCell>
                                      </TableRow>
                                  ))
                                : schedule?.map((event) => (
                                      <React.Fragment key={event.RoundNumber}>
                                          <TableRow>
                                              <TableCell>
                                                  {event.RoundNumber}
                                              </TableCell>
                                              <TableCell>
                                                  {event.EventName}
                                              </TableCell>
                                              <TableCell>{`${event.Location}, ${event.Country}`}</TableCell>
                                              <TableCell>
                                                  {new Date(
                                                      event.EventDate
                                                  ).toLocaleDateString()}
                                              </TableCell>
                                              <TableCell>
                                                  <IconButton
                                                      onClick={() =>
                                                          handleRowExpand(
                                                              event.RoundNumber
                                                          )
                                                      }
                                                      aria-label="expand row"
                                                  >
                                                      <ExpandMoreIcon
                                                          sx={{
                                                              transform:
                                                                  expandedRow ===
                                                                  event.RoundNumber
                                                                      ? "rotate(180deg)"
                                                                      : "rotate(0deg)",
                                                              transition:
                                                                  "transform 0.2s",
                                                          }}
                                                      />
                                                  </IconButton>
                                              </TableCell>
                                          </TableRow>
                                          <TableRow>
                                              <TableCell
                                                  colSpan={5}
                                                  sx={{ p: 0 }}
                                              >
                                                  <Collapse
                                                      in={
                                                          expandedRow ===
                                                          event.RoundNumber
                                                      }
                                                      timeout="auto"
                                                      unmountOnExit
                                                  >
                                                      <Box
                                                          sx={{
                                                              p: 2,
                                                              backgroundColor:
                                                                  theme.palette
                                                                      .mode ===
                                                                  "dark"
                                                                      ? "grey.800"
                                                                      : "grey.100",
                                                          }}
                                                      >
                                                          <Typography
                                                              variant="subtitle1"
                                                              fontWeight="bold"
                                                              color={
                                                                  theme.palette
                                                                      .mode ===
                                                                  "dark"
                                                                      ? "grey.300"
                                                                      : "text.primary"
                                                              }
                                                          >
                                                              Sessions
                                                          </Typography>
                                                          <ul>
                                                              {event.Session1 && (
                                                                  <li>
                                                                      {
                                                                          event.Session1
                                                                      }
                                                                      :{" "}
                                                                      {new Date(
                                                                          event.Session1Date!
                                                                      ).toLocaleString()}
                                                                  </li>
                                                              )}
                                                              {event.Session2 && (
                                                                  <li>
                                                                      {
                                                                          event.Session2
                                                                      }
                                                                      :{" "}
                                                                      {new Date(
                                                                          event.Session2Date!
                                                                      ).toLocaleString()}
                                                                  </li>
                                                              )}
                                                              {event.Session3 && (
                                                                  <li>
                                                                      {
                                                                          event.Session3
                                                                      }
                                                                      :{" "}
                                                                      {new Date(
                                                                          event.Session3Date!
                                                                      ).toLocaleString()}
                                                                  </li>
                                                              )}
                                                              {event.Session4 &&
                                                                  event.Session4Date && (
                                                                      <li>
                                                                          {
                                                                              event.Session4
                                                                          }
                                                                          :{" "}
                                                                          {new Date(
                                                                              event.Session4Date
                                                                          ).toLocaleString()}
                                                                      </li>
                                                                  )}
                                                              {event.Session5 &&
                                                                  event.Session5Date && (
                                                                      <li>
                                                                          {
                                                                              event.Session5
                                                                          }
                                                                          :{" "}
                                                                          {new Date(
                                                                              event.Session5Date
                                                                          ).toLocaleString()}
                                                                      </li>
                                                                  )}
                                                          </ul>
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

export default SchedulePage;

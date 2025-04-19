import { useEffect, useState } from "react";
import { getRoute, RouteDetails } from "@/utils/getRoute";
import {
    Box,
    Button,
    ButtonGroup,
    Typography,
    Alert,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Paper,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import ClearIcon from "@mui/icons-material/Clear";
import TurnRightIcon from "@mui/icons-material/TurnRight";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import { RouteManagerProps } from "@/types/maps";

/**
 * Component for managing and displaying routes on a map.
 *
 * @param {RouteManagerProps} props - The properties for the RouteManager component.
 * @param {maplibregl.Map} props.map - The MapLibre GL map instance used for route planning.
 *
 * @returns {JSX.Element} The RouteManager component.
 *
 * @remarks
 * This component allows users to plan routes by selecting start and end points on a map.
 * It supports three travel modes: driving, walking, and cycling. The component fetches
 * route details, displays turn-by-turn directions, and renders the route on the map.
 *
 * @example
 * ```tsx
 * import { RouteManager } from "@/components/features/routes/RouteManager";
 * import maplibregl from "maplibre-gl";
 *
 * const map = new maplibregl.Map({  map initialization options  });
 *
 * <RouteManager map={map} />;
 * ```
 *
 * @component
 *
 * @property {RouteDetails | null} routeDetails - The details of the current route, including geometry, distance, and duration.
 * @property {"driving" | "walking" | "cycling"} mode - The current travel mode for the route.
 * @property {[number, number][]} markers - The list of markers representing start and end points of the route.
 * @property {string | null} error - Error message if route fetching fails.
 * @property {boolean} isPlanning - Indicates whether the user is in route planning mode.
 *
 * @function fetchRoute - Fetches the route details based on the selected markers and travel mode.
 * @function clearRoute - Clears the current route, markers, and error state.
 * @function startPlanning - Initiates the route planning process.
 * @function formatDuration - Formats a duration in seconds into a human-readable string.
 * @function formatDistance - Formats a distance in meters into a human-readable string.
 *
 * @dependencies
 * - `@mui/material` for UI components.
 * - `@mui/icons-material` for icons.
 * - `maplibregl` for map interactions.
 * - `getRoute` utility for fetching route data.
 */
export function RouteManager({ map }: RouteManagerProps) {
    const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);
    const [mode, setMode] = useState<"driving" | "walking" | "cycling">(
        "driving"
    );
    const [markers, setMarkers] = useState<[number, number][]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isPlanning, setIsPlanning] = useState(false);

    useEffect(() => {
        if (!map || !isPlanning) return;

        const handleClick = (e: maplibregl.MapMouseEvent) => {
            const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];

            setMarkers((prev) => {
                if (prev.length >= 2) {
                    return [coords];
                }
                return [...prev, coords];
            });

            // If we've added the second point, stop planning mode
            if (markers.length === 1) {
                setIsPlanning(false);
            }
        };

        map.on("click", handleClick);
        return () => {
            map.off("click", handleClick);
        };
    }, [map, isPlanning, markers.length]);

    useEffect(() => {
        if (markers.length === 2) {
            fetchRoute();
        }
    }, [markers, mode]);

    useEffect(() => {
        if (!map || !routeDetails) return;

        const sourceId = "route";
        const layerId = "route-layer";

        if (map.getSource(sourceId)) {
            (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(
                routeDetails.geometry
            );
        } else {
            map.addSource(sourceId, {
                type: "geojson",
                data: routeDetails.geometry,
            });

            map.addLayer({
                id: layerId,
                type: "line",
                source: sourceId,
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color":
                        mode === "driving"
                            ? "#3b82f6"
                            : mode === "walking"
                              ? "#10b981"
                              : "#8b5cf6",
                    "line-width": 4,
                },
            });
        }

        return () => {
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
            }
            if (map.getSource(sourceId)) {
                map.removeSource(sourceId);
            }
        };
    }, [map, routeDetails, mode]);

    const fetchRoute = async () => {
        if (markers.length !== 2) return;
        setError(null);

        try {
            const routeData = await getRoute({
                start: markers[0],
                end: markers[1],
                mode,
            });
            setRouteDetails(routeData);
        } catch (error) {
            console.error("Error fetching route:", error);
            setError("Failed to fetch route. Please try again.");
        }
    };

    const clearRoute = () => {
        setRouteDetails(null);
        setMarkers([]);
        setError(null);
        setIsPlanning(false);
    };

    const startPlanning = () => {
        clearRoute();
        setIsPlanning(true);
    };

    const formatDuration = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) {
            return `${hours}h ${minutes}min`;
        }
        return `${minutes}min`;
    };

    const formatDistance = (meters: number): string => {
        if (meters >= 1000) {
            return `${(meters / 1000).toFixed(1)}km`;
        }
        return `${Math.round(meters)}m`;
    };

    return (
        <Box
            sx={{
                height: "fit-content", // Ensure it takes the full height of its parent
                overflow: "hidden", // Prevent scrolling for the entire component
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {isPlanning &&
                        markers.length === 0 &&
                        "Click on the map to set your starting point"}
                    {isPlanning &&
                        markers.length === 1 &&
                        "Now click to set your destination"}
                    {!isPlanning &&
                        markers.length === 2 &&
                        "Route created! Change travel mode or clear to start over"}
                </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
                {!isPlanning && markers.length === 0 ? (
                    <Button
                        variant="contained"
                        onClick={startPlanning}
                        startIcon={<AddLocationIcon />}
                    >
                        Plan Route
                    </Button>
                ) : (
                    <>
                        <ButtonGroup variant="contained" size="small">
                            <Button
                                onClick={() => setMode("driving")}
                                variant={
                                    mode === "driving"
                                        ? "contained"
                                        : "outlined"
                                }
                                startIcon={<DirectionsCarIcon />}
                            >
                                Drive
                            </Button>
                            <Button
                                onClick={() => setMode("walking")}
                                variant={
                                    mode === "walking"
                                        ? "contained"
                                        : "outlined"
                                }
                                startIcon={<DirectionsWalkIcon />}
                            >
                                Walk
                            </Button>
                            <Button
                                onClick={() => setMode("cycling")}
                                variant={
                                    mode === "cycling"
                                        ? "contained"
                                        : "outlined"
                                }
                                startIcon={<DirectionsBikeIcon />}
                            >
                                Bike
                            </Button>
                        </ButtonGroup>

                        <Button
                            variant="outlined"
                            onClick={clearRoute}
                            startIcon={<ClearIcon />}
                            color="error"
                        >
                            Clear
                        </Button>
                    </>
                )}
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {routeDetails && (
                <Paper
                    id="routeDetails"
                    variant="outlined"
                    sx={{
                        flex: 1, // Allow it to take up remaining space
                        overflow: "auto", // Enable scrolling within this section if needed
                    }}
                >
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Route Summary
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Distance: {formatDistance(routeDetails.distance)} •
                            Duration: {formatDuration(routeDetails.duration)}
                        </Typography>
                    </Box>

                    <Typography variant="subtitle1" gutterBottom>
                        Turn-by-turn Directions
                    </Typography>
                    <List>
                        {routeDetails.steps.map((step, index) => (
                            <Box key={index}>
                                <ListItem>
                                    <ListItemIcon>
                                        <TurnRightIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={step.instruction}
                                        secondary={
                                            <>
                                                {step.name &&
                                                    `On ${step.name} • `}
                                                {formatDistance(step.distance)}{" "}
                                                •{" "}
                                                {formatDuration(step.duration)}
                                            </>
                                        }
                                    />
                                </ListItem>
                                {index < routeDetails.steps.length - 1 && (
                                    <Divider />
                                )}
                            </Box>
                        ))}
                    </List>
                </Paper>
            )}
        </Box>
    );
}

"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box, Typography } from "@mui/material";
import { ApiMarker, CustomMarker, MapContentProps } from "@/types/maps";
import { MapControls } from "./controls/MapControls";
import { CurrentLocationMarker } from "../markers/CurrentLocationMarker";
import { MapMarker } from "../markers/MapMarker";
import { MarkerForm } from "../forms/MarkerForm";
import { LocationsTable } from "../tables/LocationsTable";
import { RouteManager } from "../routes/RouteManager";
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function MapContent({ location }: MapContentProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [mounted, setMounted] = useState(false);
    const [markers, setMarkers] = useState<CustomMarker[]>([]);
    const [newMarkerPosition, setNewMarkerPosition] = useState<
        [number, number] | null
    >(null);
    const [newMarkerText, setNewMarkerText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deletingMarkerId, setDeletingMarkerId] = useState<string | null>(
        null
    );
    const [isCurrentLocationForm, setIsCurrentLocationForm] = useState(false);
    const [showCurrentLocation, setShowCurrentLocation] = useState(true);

    const handleDeleteMarker = async (markerId: string) => {
        setDeletingMarkerId(markerId);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/markers/${markerId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete marker");
            }

            setMarkers((prev) =>
                prev.filter((marker) => marker.id !== markerId)
            );
        } catch (err) {
            console.error("Error deleting marker:", err);
        } finally {
            setDeletingMarkerId(null);
        }
    };

    const loadMarkers = async () => {
        try {
            console.log("Fetching markers from API...");
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/markers`
            );

            if (!response.ok) {
                throw new Error("Failed to load markers");
            }

            const apiMarkers: ApiMarker[] = await response.json();
            console.log("Received markers from API:", apiMarkers);

            const convertedMarkers: CustomMarker[] = apiMarkers.map(
                (marker) => ({
                    id: marker.id,
                    lngLat: [
                        typeof marker.longitude === "string"
                            ? parseFloat(marker.longitude)
                            : marker.longitude,
                        typeof marker.latitude === "string"
                            ? parseFloat(marker.latitude)
                            : marker.latitude,
                    ] as [number, number],
                    text: marker.text,
                })
            );

            console.log("Converted markers:", convertedMarkers);
            setMarkers(convertedMarkers);
        } catch (err) {
            console.error("Error loading markers:", err);
            if (err instanceof Error) {
                console.error("Error details:", err.message);
            }
        }
    };

    const handleSaveMarker = async () => {
        if (!newMarkerPosition || !newMarkerText.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/markers`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        latitude: newMarkerPosition[1],
                        longitude: newMarkerPosition[0],
                        text: newMarkerText.trim(),
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to save marker");
            }

            const savedMarker = await response.json();
            setMarkers((prev) => [
                ...prev,
                {
                    id: savedMarker.id,
                    lngLat: newMarkerPosition,
                    text: savedMarker.text,
                },
            ]);
            await loadMarkers();

            setNewMarkerPosition(null);
            setNewMarkerText("");
            setIsCurrentLocationForm(false);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "An error occurred while saving the marker"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!mounted) {
            setMounted(true);
            return;
        }

        if (map.current) return;

        if (mapContainer.current) {
            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: "https://tiles.stadiamaps.com/styles/alidade_smooth.json",
                center: [location.lng, location.lat],
                zoom: 13,
            });

            map.current.addControl(
                new maplibregl.NavigationControl(),
                "top-right"
            );

            // Load markers after map is loaded
            map.current.on("load", () => {
                console.log("Map loaded, loading markers...");
                loadMarkers();
            });

            const style = document.createElement("style");
            style.textContent = `
                .maplibregl-marker[style*="z-index: 1000"] {
                    z-index: 1000 !important;
                }
                .current-location-popup {
                    z-index: 1001 !important;
                }
                .maplibregl-popup {
                    z-index: 1002 !important;
                }
                .maplibregl-ctrl-top-left {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    z-index: 1;
                }
                .maplibregl-ctrl-group {
                    margin: 10px;
                }
                .maplibregl-ctrl-group:hover {
                    box-shadow: 0 0 0 2px rgba(0,0,0,.2);
                }
                .custom-popup {
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                }
                .custom-popup .maplibregl-popup-content {
                    padding: 0;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .popup-content {
                    min-width: 200px;
                    padding: 16px;
                }
                .popup-title {
                    margin: 0 0 12px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                }
                .popup-coordinates {
                    margin-bottom: 12px;
                }
                .popup-coordinates p {
                    margin: 4px 0;
                    font-size: 14px;
                    color: #666;
                }
                .coordinate-label {
                    font-weight: 500;
                    color: #333;
                    margin-right: 8px;
                }
                .popup-actions {
                    padding: 8px 16px;
                    display: flex;
                    justify-content: flex-end;
                }
                .delete-button, .save-button {
                    text-transform: none;
                    font-weight: 500;
                    padding: 6px 16px;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background-color 0.2s ease;
                }
                .delete-button {
                    background-color: #ff4444;
                    color: white;
                }
                .delete-button:hover {
                    background-color: #ff3333;
                }
                .save-button {
                    background-color: #4287f5;
                    color: white;
                }
                .save-button:hover {
                    background-color: #3270d4;
                }
                .maplibregl-popup-close-button {
                    font-size: 16px;
                    padding: 4px 8px;
                }
            `;
            document.head.appendChild(style);

            map.current.on("click", (e) => {
                const target = e.originalEvent.target as HTMLElement;
                if (target.closest(".maplibregl-marker")) {
                    return;
                }
                setNewMarkerPosition([e.lngLat.lng, e.lngLat.lat]);
            });

            const handleDeleteEvent = (e: CustomEvent) => {
                handleDeleteMarker(e.detail);
            };

            const handleSaveCurrentLocation = (e: CustomEvent) => {
                setNewMarkerPosition([e.detail.lng, e.detail.lat]);
                setIsCurrentLocationForm(true);
            };

            window.addEventListener(
                "deleteMarker",
                handleDeleteEvent as EventListener
            );
            window.addEventListener(
                "saveCurrentLocation",
                handleSaveCurrentLocation as EventListener
            );

            return () => {
                window.removeEventListener(
                    "deleteMarker",
                    handleDeleteEvent as EventListener
                );
                window.removeEventListener(
                    "saveCurrentLocation",
                    handleSaveCurrentLocation as EventListener
                );
            };
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [mounted, location]);

    // Load markers when component mounts and when markers are updated
    useEffect(() => {
        if (mounted && map.current) {
            console.log(
                "Component mounted or markers updated, loading markers..."
            );
            loadMarkers();
        }
    }, [mounted]);

    // Reload markers after successful save
    useEffect(() => {
        if (!loading && !error && mounted && map.current) {
            console.log("Save completed, reloading markers...");
            loadMarkers();
        }
    }, [loading, error]);

    if (!mounted) {
        return null;
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ position: "relative", height: "45vh" }}>
                <div
                    ref={mapContainer}
                    style={{ width: "100%", height: "100%" }}
                />
                <MapControls
                    showCurrentLocation={showCurrentLocation}
                    setShowCurrentLocation={setShowCurrentLocation}
                />
                {showCurrentLocation && (
                    <CurrentLocationMarker
                        lngLat={[location.lng, location.lat]}
                        onSave={() => setIsCurrentLocationForm(true)}
                        map={map.current}
                    />
                )}
                {markers.map((marker) => (
                    <MapMarker
                        key={marker.id}
                        lngLat={marker.lngLat}
                        text={marker.text}
                        id={marker.id}
                        onDelete={handleDeleteMarker}
                        deletingMarkerId={deletingMarkerId}
                        map={map.current}
                    />
                ))}
                <MarkerForm
                    position={newMarkerPosition}
                    text={newMarkerText}
                    isCurrentLocationForm={isCurrentLocationForm}
                    error={error}
                    loading={loading}
                    onTextChange={setNewMarkerText}
                    onCancel={() => {
                        setNewMarkerPosition(null);
                        setNewMarkerText("");
                        setError(null);
                        setIsCurrentLocationForm(false);
                    }}
                    onSave={handleSaveMarker}
                />
            </Box>
            <Box
                id="maps-data"
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 2,
                    p: 2,
                    height: "40vh",
                }}
            >
                <Box
                    id="locations-box"
                    sx={{
                        flex: 1,
                        backgroundColor: "background.paper",
                        borderRadius: 1,
                        boxShadow: 1,
                        p: 2,
                        height: "100%",
                        display: "flex", // Ensure the child fills the parent's height
                        flexDirection: "column",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                        }}
                    >
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                whiteSpace: "nowrap",
                            }}
                        >
                            Saved Locations
                        </Typography>
                        <InfoIcon
                            fontSize="small"
                            sx={{ mr: 1 }}
                            data-tooltip-id="info-tooltip"
                            data-tooltip-content="Click on the map to add a marker. Use the form to save it or cancel. You can also delete saved markers from the table below."
                        />
                        <ReactTooltip id="info-tooltip" place="top" />
                    </Box>
                    <Box sx={{ height: "100%", overflow: "auto" }}>
                        {/* Ensure LocationsTable fills the remaining height */}
                        <LocationsTable
                            locations={markers.map((marker) => ({
                                id: marker.id,
                                text: marker.text,
                                latitude: marker.lngLat[1],
                                longitude: marker.lngLat[0],
                            }))}
                            onDelete={handleDeleteMarker}
                            deletingMarkerId={deletingMarkerId}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        flex: 1,
                        height: "100%",
                        overflow: "auto",
                        backgroundColor: "background.paper",
                        borderRadius: 1,
                        boxShadow: 1,
                        p: 2,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            mb: 2,
                        }}
                    >
                        <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                                whiteSpace: "nowrap",
                            }}
                        >
                            Route Planner
                        </Typography>
                        <InfoIcon
                            fontSize="small"
                            sx={{ mr: 1 }}
                            data-tooltip-id="route-tooltip"
                            data-tooltip-content="Click 'Plan Route' to start. Select two points on the map to create a route. You can change the travel mode or clear the route to start over."
                        />
                        <ReactTooltip id="route-tooltip" place="top" />
                    </Box>
                    {map.current && <RouteManager map={map.current} />}
                </Box>
            </Box>
        </Box>
    );
}

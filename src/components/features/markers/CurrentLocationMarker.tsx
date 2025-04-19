import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { CurrentLocationMarkerProps } from "@/types/maps";

/**
 * A React component that renders a custom marker on a MapLibre map at the specified coordinates.
 * The marker includes a popup displaying the current location's latitude and longitude,
 * and optionally a "Save Location" button that triggers a custom event.
 *
 * @param {Object} props - The properties for the CurrentLocationMarker component.
 * @param {[number, number]} props.lngLat - The longitude and latitude coordinates for the marker.
 * @param {boolean} [props.onSave] - A flag indicating whether to display the "Save Location" button in the popup.
 * @param {maplibregl.Map | null} props.map - The MapLibre map instance to which the marker will be added.
 *
 * @returns {null} This component does not render any visible React elements.
 */
export function CurrentLocationMarker({
    lngLat,
    onSave,
    map,
}: CurrentLocationMarkerProps) {
    const markerRef = useRef<maplibregl.Marker | null>(null);

    useEffect(() => {
        if (!map) return;

        // Remove existing marker if it exists
        if (markerRef.current) {
            markerRef.current.remove();
        }

        // Create new marker
        const marker = new maplibregl.Marker({
            color: "#FF0000",
            element: (() => {
                const el = document.createElement("div");
                el.className = "maplibregl-marker";
                el.style.zIndex = "1000";
                el.style.width = "20px";
                el.style.height = "20px";
                el.style.backgroundColor = "#FF0000";
                el.style.borderRadius = "50%";
                el.style.border = "2px solid white";
                el.style.boxShadow = "0 0 0 2px rgba(0,0,0,.1)";
                return el;
            })(),
        })
            .setLngLat(lngLat)
            .setPopup(
                new maplibregl.Popup({
                    offset: 25,
                    className: "custom-popup current-location-popup",
                }).setHTML(`
                        <div class="popup-content">
                            <h6 class="popup-title">Current Location:</h6>
                            <div class="popup-coordinates">
                                <p><span class="coordinate-label">Latitude:</span> ${lngLat[1].toFixed(6)}</p>
                                <p><span class="coordinate-label">Longitude:</span> ${lngLat[0].toFixed(6)}</p>
                            </div>
                            ${
                                onSave
                                    ? `
                                <div class="popup-actions">
                                    <button 
                                        class="save-button"
                                        onclick="window.dispatchEvent(new CustomEvent('saveCurrentLocation', { detail: { lat: ${lngLat[1]}, lng: ${lngLat[0]} } }))"
                                    >
                                        Save Location
                                    </button>
                                </div>
                            `
                                    : ""
                            }
                        </div>
                    `)
            );

        // Add marker to map
        marker.addTo(map);
        markerRef.current = marker;

        return () => {
            if (markerRef.current) {
                markerRef.current.remove();
                markerRef.current = null;
            }
        };
    }, [map, lngLat, onSave]);

    return null;
}

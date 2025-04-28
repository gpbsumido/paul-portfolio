import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { MapMarkerProps } from "@/types/maps";

/**
 * A React component that renders a marker on a MapLibre map with an associated popup.
 * The marker displays a custom icon and shows a popup with details and a delete button
 * when clicked. The delete button triggers a callback function passed as a prop.
 *
 * @param {Object} props - The properties for the MapMarker component.
 * @param {[number, number]} props.lngLat - The longitude and latitude coordinates of the marker.
 * @param {string} props.text - The text to display in the popup.
 * @param {string} props.id - The unique identifier for the marker.
 * @param {(id: string) => void} props.onDelete - Callback function to handle marker deletion.
 * @param {string | null} props.deletingMarkerId - The ID of the marker currently being deleted, or null if none.
 * @param {maplibregl.Map | null} props.map - The MapLibre map instance to which the marker will be added.
 * @param {"light" | "dark"} props.theme - The current theme, either "light" or "dark".
 *
 * @returns {null} This component does not render any JSX elements.
 */
export function MapMarker({
    lngLat,
    text,
    id,
    onDelete,
    deletingMarkerId,
    map,
    theme,
}: MapMarkerProps & { theme: "light" | "dark" }) {
    const markerRef = useRef<maplibregl.Marker | null>(null);
    const popupRef = useRef<maplibregl.Popup | null>(null);

    useEffect(() => {
        if (!map) return;

        if (!markerRef.current) {
            const markerElement = document.createElement("div");
            markerElement.className = "maplibregl-marker";
            markerElement.style.width = "30px";
            markerElement.style.height = "30px";
            markerElement.style.backgroundImage = "url(/marker.svg)";
            markerElement.style.backgroundSize = "cover";
            markerElement.style.cursor = "pointer";
            markerElement.style.zIndex = "1000";

            const popup = new maplibregl.Popup({
                closeButton: true,
                closeOnClick: false,
                className: `custom-popup ${theme}-mode`,
                maxWidth: "300px",
                offset: 25,
            });

            const popupContent = document.createElement("div");
            popupContent.className = `popup-content ${theme}-mode`;
            popupContent.innerHTML = `
                <h3 class="popup-title">${text}</h3>
                <div class="popup-coordinates">
                    <p><span class="coordinate-label">Latitude:</span>${lngLat[1].toFixed(6)}</p>
                    <p><span class="coordinate-label">Longitude:</span>${lngLat[0].toFixed(6)}</p>
                </div>
                <div class="popup-actions">
                    <button class="delete-button" ${deletingMarkerId === id ? "disabled" : ""}>
                        ${deletingMarkerId === id ? "Deleting..." : "Delete"}
                    </button>
                </div>
            `;

            const deleteButton = popupContent.querySelector(".delete-button");
            if (deleteButton) {
                deleteButton.addEventListener("click", () => onDelete(id));
            }

            popup.setDOMContent(popupContent);

            markerRef.current = new maplibregl.Marker(markerElement)
                .setLngLat(lngLat)
                .setPopup(popup)
                .addTo(map);

            popupRef.current = popup;
        }

        return () => {
            if (markerRef.current) {
                markerRef.current.remove();
                markerRef.current = null;
            }
            if (popupRef.current) {
                popupRef.current.remove();
                popupRef.current = null;
            }
        };
    }, [map, lngLat, text, id, onDelete, deletingMarkerId, theme]);

    return null;
}

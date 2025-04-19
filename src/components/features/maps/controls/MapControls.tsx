import { Box, IconButton, Tooltip } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { MapControlsProps } from "@/types/maps";

/**
 * A React component that renders map controls for toggling the visibility of the current location.
 *
 * @param {Object} props - The props for the MapControls component.
 * @param {boolean} props.showCurrentLocation - A boolean indicating whether the current location is visible.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setShowCurrentLocation - A function to toggle the visibility of the current location.
 *
 * @returns {JSX.Element} The rendered MapControls component.
 */
export function MapControls({
    showCurrentLocation,
    setShowCurrentLocation,
}: MapControlsProps) {
    return (
        <Box
            sx={{
                position: "absolute",
                top: "10px",
                left: "10px",
                zIndex: 1,
                backgroundColor: "white",
                borderRadius: 1,
                boxShadow: 1,
            }}
        >
            <Tooltip
                title={
                    showCurrentLocation
                        ? "Hide current location"
                        : "Show current location"
                }
            >
                <IconButton
                    onClick={() => setShowCurrentLocation((prev) => !prev)}
                    sx={{
                        backgroundColor: showCurrentLocation
                            ? "#ef4444"
                            : "white",
                        color: showCurrentLocation ? "white" : "#666",
                        "&:hover": {
                            backgroundColor: showCurrentLocation
                                ? "#dc2626"
                                : "#f3f4f6",
                        },
                    }}
                >
                    <MyLocationIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
}

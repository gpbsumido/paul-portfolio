import { Box, Button } from "@mui/material";
import { MarkerFormProps } from "@/types/maps";

/**
 * MarkerForm Component
 *
 * A form component for adding or saving a marker with a specific position and text.
 * It provides input for marker text, displays errors, and includes "Cancel" and "Save" buttons.
 *
 * @param {MarkerFormProps} props - The props for the MarkerForm component.
 * @param {[number, number] | null} props.position - The geographical position of the marker as a tuple of latitude and longitude. If null, the form is not rendered.
 * @param {string} props.text - The text associated with the marker.
 * @param {boolean} [props.isCurrentLocationForm=false] - Indicates if the form is for saving the current location.
 * @param {string | null} props.error - An error message to display, if any.
 * @param {boolean} props.loading - Indicates whether the form is in a loading state (e.g., while saving).
 * @param {(text: string) => void} props.onTextChange - Callback function triggered when the marker text input changes.
 * @param {() => void} props.onCancel - Callback function triggered when the "Cancel" button is clicked.
 * @param {() => void} props.onSave - Callback function triggered when the "Save" button is clicked.
 *
 * @returns {JSX.Element | null} The rendered MarkerForm component or null if `position` is not provided.
 */

export function MarkerForm({
    position,
    text,
    isCurrentLocationForm = false,
    error,
    loading,
    onTextChange,
    onCancel,
    onSave,
}: MarkerFormProps) {
    if (!position) return null;

    return (
        <Box
            sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1003,
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                minWidth: "300px",
            }}
        >
            <h3 style={{ margin: "0 0 15px 0" }}>
                {isCurrentLocationForm
                    ? "Save Current Location"
                    : "Add New Marker"}
            </h3>
            {error && (
                <div style={{ color: "red", marginBottom: "15px" }}>
                    {error}
                </div>
            )}
            <input
                type="text"
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                placeholder="Enter marker text"
                style={{
                    width: "100%",
                    padding: "8px",
                    marginBottom: "15px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                }}
            />
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "flex-end",
                }}
            >
                <Button
                    onClick={onCancel}
                    variant="outlined"
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#f5f5f5",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onSave}
                    disabled={!text.trim() || loading}
                    variant="contained"
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#4287f5",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        opacity: !text.trim() || loading ? 0.5 : 1,
                    }}
                >
                    {loading ? "Saving..." : "Save"}
                </Button>
            </div>
        </Box>
    );
}

import { LocationsTableProps } from "@/types/maps";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from "@mui/material";

/**
 * A React component that renders a table displaying a list of locations.
 * Each location includes a name, latitude, longitude, and an action to delete the location.
 *
 * @param {LocationsTableProps} props - The props for the LocationsTable component.
 * @param {Array} props.locations - An array of location objects to display in the table.
 * @param {Function} props.onDelete - A callback function triggered when a location is deleted.
 * @param {string | null} props.deletingMarkerId - The ID of the location currently being deleted, if any.
 *
 * @returns {JSX.Element} A table displaying the list of locations with delete functionality.
 *
 * @example
 * ```tsx
 * <LocationsTable
 *   locations={[
 *     { id: "1", text: "Location 1", latitude: 12.345678, longitude: 98.765432 },
 *     { id: "2", text: "Location 2", latitude: 23.456789, longitude: 87.654321 },
 *   ]}
 *   onDelete={(id) => console.log(`Delete location with id: ${id}`)}
 *   deletingMarkerId="1"
 * />
 * ```
 */
export function LocationsTable({
    locations,
    onDelete,
    deletingMarkerId,
}: LocationsTableProps) {
    return (
        <Box
            sx={{
                width: "100%",
                height: "auto", // Change from '100%' to 'auto' to prevent unnecessary stretching
                maxHeight: "100%", // Ensure it respects the parent's height
                overflow: "auto",
            }}
        >
            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                <Table id="inside-table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Latitude</TableCell>
                            <TableCell>Longitude</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {locations.map((location) => (
                            <TableRow key={location.id}>
                                <TableCell>{location.text}</TableCell>
                                <TableCell>
                                    {location.latitude.toFixed(6)}
                                </TableCell>
                                <TableCell>
                                    {location.longitude.toFixed(6)}
                                </TableCell>
                                <TableCell align="right">
                                    <button
                                        onClick={() => onDelete(location.id)}
                                        style={{
                                            padding: "4px 8px",
                                            backgroundColor: "#ff4444",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            opacity:
                                                deletingMarkerId === location.id
                                                    ? 0.7
                                                    : 1,
                                        }}
                                        disabled={
                                            deletingMarkerId === location.id
                                        }
                                    >
                                        {deletingMarkerId === location.id
                                            ? "Deleting..."
                                            : "Delete"}
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {locations.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography color="textSecondary">
                                        No locations added yet
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

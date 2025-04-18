import { Dispatch, SetStateAction } from "react";
import { Map } from "maplibre-gl";

export interface RouteManagerProps {
    map: Map | null;
}

export interface MarkerFormProps {
    position: [number, number] | null;
    text: string;
    isCurrentLocationForm?: boolean;
    error: string | null;
    loading: boolean;
    onTextChange: (text: string) => void;
    onCancel: () => void;
    onSave: () => void;
}

export interface MapMarkerProps {
    lngLat: [number, number];
    text: string;
    id: string;
    onDelete: (id: string) => void;
    deletingMarkerId: string | null;
    map: maplibregl.Map | null;
}

export interface MapControlsProps {
    showCurrentLocation: boolean;
    setShowCurrentLocation: Dispatch<SetStateAction<boolean>>;
}

export interface CurrentLocationMarkerProps {
    lngLat: [number, number];
    onSave?: () => void;
    map?: maplibregl.Map | null;
}

export interface Location {
    id: string;
    text: string;
    latitude: number;
    longitude: number;
}

export interface LocationsTableProps {
    locations: Location[];
    onDelete: (id: string) => void;
    deletingMarkerId: string | null;
}

export interface MapContentProps {
    location: {
        lat: number;
        lng: number;
    };
}

export interface CustomMarker {
    id: string;
    lngLat: [number, number];
    text: string;
}

export interface ApiMarker {
    id: string;
    latitude: number | string;
    longitude: number | string;
    text: string;
}

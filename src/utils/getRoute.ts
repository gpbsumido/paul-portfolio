import { Feature } from "geojson";

export interface RouteOptions {
    start: [number, number];
    end: [number, number];
    mode: "driving" | "walking" | "cycling";
}

export interface RouteStep {
    distance: number;
    duration: number;
    instruction: string;
    name: string;
}

export interface RouteDetails {
    geometry: Feature;
    distance: number;
    duration: number;
    steps: RouteStep[];
}

export async function getRoute({
    start,
    end,
    mode,
}: RouteOptions): Promise<RouteDetails> {
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!accessToken) {
        throw new Error("Mapbox access token is not configured");
    }

    // Convert mode to Mapbox profile format
    const profile =
        mode === "cycling"
            ? "cycling"
            : mode === "walking"
              ? "walking"
              : "driving";
    const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinates}?geometries=geojson&steps=true&access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch route");
        }

        const data = await response.json();
        if (!data.routes || data.routes.length === 0) {
            throw new Error("No route found");
        }

        const route = data.routes[0];
        return {
            geometry: {
                type: "Feature",
                properties: {},
                geometry: route.geometry,
            },
            distance: route.distance,
            duration: route.duration,
            steps: route.legs[0].steps.map((step: any) => ({
                distance: step.distance,
                duration: step.duration,
                instruction: step.maneuver.instruction,
                name: step.name,
            })),
        };
    } catch (error) {
        console.error("Error fetching route:", error);
        throw error;
    }
}

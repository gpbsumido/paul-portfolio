interface Location {
    latitude: number;
    longitude: number;
}

interface RouteCache {
    [key: string]: {
        route: any;
        timestamp: number;
    };
}

const cache: RouteCache = {};
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

function getCacheKey(start: Location, end: Location, mode: string): string {
    return `${start.latitude},${start.longitude}-${end.latitude},${end.longitude}-${mode}`;
}

function isRouteExpired(timestamp: number): boolean {
    return Date.now() - timestamp > CACHE_EXPIRY;
}

export async function getRoute(
    start: Location,
    end: Location,
    mode: "driving" | "walking"
): Promise<any> {
    const cacheKey = getCacheKey(start, end, mode);
    const cachedRoute = cache[cacheKey];

    if (cachedRoute && !isRouteExpired(cachedRoute.timestamp)) {
        return cachedRoute.route;
    }

    const profile = mode === "driving" ? "mapbox/driving" : "mapbox/walking";
    const coordinates = `${start.longitude},${start.latitude};${end.longitude},${end.latitude}`;
    const accessToken = process.env.MAPBOX_TOKEN;

    if (!accessToken) {
        throw new Error("Mapbox access token is not configured");
    }

    const url = `https://api.mapbox.com/directions/v5/${profile}/${coordinates}?geometries=geojson&access_token=${accessToken}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch route");
        }

        const data = await response.json();

        // Cache the route
        cache[cacheKey] = {
            route: data,
            timestamp: Date.now(),
        };

        return data;
    } catch (error) {
        console.error("Error fetching route:", error);
        throw error;
    }
}

export function clearRouteCache(): void {
    Object.keys(cache).forEach((key) => {
        if (isRouteExpired(cache[key].timestamp)) {
            delete cache[key];
        }
    });
}

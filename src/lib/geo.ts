import geohash from 'ngeohash';

/**
 * Adds a random offset between -0.01 and 0.01 degrees to a coordinate.
 * 0.01 degrees is roughly 1.11 kilometers at the equator.
 * This ensures the exact location of the requester is never stored, 
 * preserving anonymity while allowing regional discovery.
 */
export function jitterCoordinate(coord: number): number {
    const jitter = (Math.random() - 0.5) * 0.02; // Range [-0.01, 0.01]
    return Number((coord + jitter).toFixed(6));
}

/**
 * Calculates a Geohash from the provided latitude and longitude.
 * 
 * @param lat The latitude (preferably jittered)
 * @param lon The longitude (preferably jittered)
 * @param precision The length of the geohash. Level 6 is ~1.2km x 0.6km.
 * @returns The computed geohash string.
 */
export function getGeohash(lat: number, lon: number, precision: number = 6): string {
    return geohash.encode(lat, lon, precision);
}

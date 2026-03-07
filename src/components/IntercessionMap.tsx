"use client";
import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { IntercessionLocation } from '@/app/actions/intercessions';

interface Props {
    locations: IntercessionLocation[];
}

export default function IntercessionMap({ locations }: Props) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        const apiKey = process.env.NEXT_PUBLIC_AWS_LOCATION_API_KEY;
        const mapName = process.env.NEXT_PUBLIC_AWS_LOCATION_MAP_NAME;
        const region = process.env.NEXT_PUBLIC_AWS_LOCATION_REGION;

        if (!apiKey || !mapName || !region) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
            center: [0, 20],
            zoom: 1.2,
        });

        map.current.on('load', () => {
            map.current?.resize();

            locations.forEach((loc) => {
                const el = document.createElement('div');
                el.style.cssText = `
                    width: 12px; height: 12px;
                    border-radius: 50%;
                    background-color: #f59e0b;
                    border: 2px solid white;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.4);
                    cursor: pointer;
                    transition: transform 0.2s;
                `;
                el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.6)'; });
                el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });

                const popup = new maplibregl.Popup({ offset: 20 }).setHTML(
                    `<div style="padding: 6px; font-size: 12px; color: #374151;">
                        🙏 Prayed from ${loc.locationString ?? 'unknown location'}
                    </div>`
                );

                new maplibregl.Marker({ element: el })
                    .setLngLat([loc.lon, loc.lat])
                    .setPopup(popup)
                    .addTo(map.current!);
            });
        });
    }, [locations]);

    if (locations.length === 0) return null;

    return (
        <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                🌍 {locations.length} Intercessor{locations.length !== 1 ? 's' : ''} from around the world
            </p>
            <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />
            </div>
        </div>
    );
}

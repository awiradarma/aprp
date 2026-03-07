"use client";
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { fetchMapPrayers } from '@/app/actions/map';

const GlobalMap = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const [markers, setMarkers] = useState<any[]>([]);

    useEffect(() => {
        // Fetch prayers when component mounts
        fetchMapPrayers().then(setMarkers);
    }, []);

    useEffect(() => {
        if (map.current) return; // Initialize map only once
        if (!mapContainer.current) return;

        const apiKey = process.env.NEXT_PUBLIC_AWS_LOCATION_API_KEY;
        const mapName = process.env.NEXT_PUBLIC_AWS_LOCATION_MAP_NAME;
        const region = process.env.NEXT_PUBLIC_AWS_LOCATION_REGION;

        if (!apiKey || !mapName || !region) {
            console.error("Missing AWS Location Service UI credentials.");
            return;
        }

        // Initialize MapLibre GL JS
        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
            center: [0, 20], // Center of world view
            zoom: 1.5,
        });

        map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

        // Trigger resize after load to ensure tiles fill the container
        map.current.on('load', () => {
            map.current?.resize();
        });

    }, []);

    // Update markers when data loads after map is ready
    useEffect(() => {
        if (!map.current || markers.length === 0) return;

        const addMarkers = () => {
            markers.forEach((marker) => {
                // Use inline styles — Tailwind won't process dynamically created elements
                const el = document.createElement('div');
                el.style.cssText = `
                    width: 14px; height: 14px;
                    border-radius: 50%;
                    background-color: #2563eb;
                    border: 2px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                    cursor: pointer;
                    transition: transform 0.2s;
                `;
                el.addEventListener('mouseenter', () => { el.style.transform = 'scale(1.5)'; });
                el.addEventListener('mouseleave', () => { el.style.transform = 'scale(1)'; });

                const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
                    `<div style="padding: 8px; max-width: 200px;">
                        <p style="font-size: 13px; font-style: italic; color: #1f2937;">"${marker.text}"</p>
                        <a href="/p/${marker.id}" style="color: #2563eb; font-size: 11px; font-weight: bold; display: inline-block; margin-top: 6px;">Join in Prayer →</a>
                    </div>`
                );

                new maplibregl.Marker({ element: el })
                    .setLngLat([marker.lon, marker.lat])
                    .setPopup(popup)
                    .addTo(map.current!);
            });
        };

        // If the map is already loaded, add markers immediately; otherwise wait
        if (map.current.loaded()) {
            addMarkers();
        } else {
            map.current.on('load', addMarkers);
        }
    }, [markers]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' }}>
            <div ref={mapContainer} style={{ position: 'absolute', inset: 0 }} />
            <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', zIndex: 10, pointerEvents: 'none' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#111827', margin: 0 }}>Global Presence</h3>
                <p style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600, margin: 0 }}>{markers.length} Active Regions</p>
            </div>
        </div>
    );
};

export default GlobalMap;

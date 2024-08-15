import React, { PropsWithChildren, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWhzYW0yMDIwIiwiYSI6ImNrZmd3YjBtbjA5bHMycnBwbm93MjZnOHgifQ.ORif_sUEPTY0igyDU9sFeA';

const MapContainer: React.FC = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef({});

    useEffect(() => {
        if (mapRef.current) return;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current ?? "",
            center: [-74.5, 40], // starting position [lng, lat]
            zoom: 9 // starting zoom
        });;

    });
    console.log("🚀 ~ useEffect ~  mapRef.current:", mapRef.current)

    return (
        <div
            style={{ height: '100%' }}
            ref={mapContainerRef}
            className="map-container"
        />
    );

};

export default MapContainer;

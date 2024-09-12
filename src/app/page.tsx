"use client";

import { AdvancedMarker, APIProvider, Map, MapCameraChangedEvent, MapMouseEvent, Pin } from "@vis.gl/react-google-maps";
import { Button } from "antd";
import AppConfig from "../../app.config";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const latValue = position.coords.latitude;
        const lngValue = position.coords.longitude;

        setLat(latValue);
        setLng(lngValue);
      }
    );
  }, []);

  return (
    <APIProvider apiKey={AppConfig.googleMapApiKey} onLoad={() => console.log("Maps API has loaded.")}>
      <Link href={`/login`}>
        Log in
      </Link>
      <Map
        className={styles.map}

        defaultZoom={13}
        mapId={AppConfig.mapId}
        defaultCenter={{ lat: lat, lng: lng }}
        center={{ lat: lat, lng: lng }}
        onClick={(ev: MapMouseEvent) => {

        }}
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log("camera changed:", ev.detail.center, "zoom:", ev.detail.zoom)
        }>
        {/* <PoiMarkers pois={locations} /> */}
      </Map>
    </APIProvider>
  );
}

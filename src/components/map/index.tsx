"use client";

import { env } from 'node:process';
import React, { useEffect, useState } from "react";
import { AdvancedMarker, APIProvider, Map, MapCameraChangedEvent, MapMouseEvent, Pin } from "@vis.gl/react-google-maps";
import { ButtonProps, Modal } from "antd";
import { CategoryType } from "@/types";

import styles from "./index.module.css";

type Poi = { key: string, location: google.maps.LatLngLiteral }

const GoogleMap: React.FC<
    {
        title?: string,
        open?: boolean | false,
        latlng?: string,
        okButtonProps?: ButtonProps;
        cancelButtonProps?: ButtonProps;
        category?: CategoryType;
        onOk?: (e: React.MouseEvent<HTMLButtonElement>) => void,
        onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void,
        callBack?: (location: string) => void
    }
> = ({ title, open, latlng, category, onOk, onCancel, okButtonProps, cancelButtonProps, callBack }) => {
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [locations, setLocations] = useState<Poi[]>([]);
    const [selectedLocation, setSelectedLocation] = useState("");

    const buildContent = (category?: CategoryType) => {
        const content = document.createElement("div");
        content.innerHTML = `
          <div class="${category?.icon}-icon"></div>
          `;
        return content;
    }

    const PoiMarkers = (props: { pois: Poi[] }) => {
        return (
            <>
                {props.pois.map((poi: Poi) => (
                    <AdvancedMarker
                        key={poi.key}
                        position={poi.location}>
                        <Pin
                            glyph={buildContent(category)}
                            background={category?.color}
                            borderColor={"#594d9c"}
                        />
                    </AdvancedMarker>
                ))}
            </>
        );
    };

    useEffect(() => {
        if (latlng) {

            const latValue = parseFloat(latlng.split(",")[0]);
            const lngValue = parseFloat(latlng.split(",")[1]);

            setLocations([
                { key: "selectLocation", location: { lat: latValue, lng: lngValue } }]);

            setLat(latValue);
            setLng(lngValue);

        }
    }, [latlng]);

    return <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || ''} onLoad={() => {
    }}>
        <Modal
            title={title}
            centered
            open={open}
            onOk={(e) => {
                callBack && callBack(selectedLocation);
                onOk && onOk(e);
            }}
            onCancel={onCancel}
            okButtonProps={okButtonProps}
            cancelButtonProps={cancelButtonProps}
            width={800}
        >
            <Map
                id={"map-modal"}
                className={styles.map}
                defaultZoom={13}
                mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
                defaultCenter={{ lat: lat, lng: lng }}
                onClick={(ev: MapMouseEvent) => {
                    const latValue = ev.detail.latLng?.lat ?? lat;
                    const lngValue = ev.detail.latLng?.lng ?? lng;
                    setLocations([
                        { key: "selectLocation", location: { lat: latValue, lng: lngValue } }]);
                    setSelectedLocation(`${latValue},${lngValue}`);
                }}
                onCameraChanged={(ev: MapCameraChangedEvent) =>
                    console.log("camera changed:", ev.detail.center, "zoom:", ev.detail.zoom)
                }>
                <PoiMarkers pois={locations} />
            </Map>
        </Modal>
    </APIProvider>
};

export default GoogleMap;
"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "./page.module.css";
import { AdvancedMarker, APIProvider, Map, MapCameraChangedEvent, MapMouseEvent, Pin } from "@vis.gl/react-google-maps";
import AppConfig from "../../../app.config";
import { ButtonProps, Modal } from "antd";

type Poi = { key: string, location: google.maps.LatLngLiteral }

const GoogleMap: React.FC<
    {
        title?: string,
        open?: boolean | false,
        latlng?: string,
        okButtonProps?: ButtonProps;
        cancelButtonProps?: ButtonProps;
        onOk?: (e: React.MouseEvent<HTMLButtonElement>) => void,
        onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void,
        callBack?: (location: string) => void
    }
> = ({ title, open, latlng, onOk, onCancel, okButtonProps, cancelButtonProps, callBack }) => {
    const [lat, setLat] = useState(0);
    const [lng, setLng] = useState(0);
    const [locations, setLocations] = useState<Poi[]>([]);
    const [selectedLocation, setSelectedLocation] = useState("");

    const PoiMarkers = (props: { pois: Poi[] }) => {
        return (
            <>
                {props.pois.map((poi: Poi) => (
                    <AdvancedMarker
                        key={poi.key}
                        position={poi.location}>
                        <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
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
            console.log("🚀 ~ locations:", latlng.split(","))
            setLat(latValue);
            setLng(lngValue);

        } else {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    const latValue = position.coords.latitude;
                    const lngValue = position.coords.longitude;

                    setLat(latValue);
                    setLng(lngValue);
                }
            );
        };
    }, [latlng]);

    return <APIProvider apiKey={AppConfig.googleMapApiKey} onLoad={() => console.log("Maps API has loaded.")}>
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
                className={styles.map}
                defaultZoom={13}
                mapId={AppConfig.mapId}
                defaultCenter={{ lat: lat, lng: lng }}
                center={{ lat: lat, lng: lng }}
                onClick={(ev: MapMouseEvent) => {
                    console.log("🚀 ~ GoogleMap ~ ev:", ev.detail.latLng)
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
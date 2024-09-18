"use client";

import { AdvancedMarker, APIProvider, InfoWindow, Map, MapCameraChangedEvent, MapMouseEvent, Pin, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { Button, Card, Col, Flex, Layout, Row, TablePaginationConfig } from "antd";
import AppConfig from "../../app.config";
import { useCallback, useEffect, useState } from "react";
import styles from "./page.module.css";
import "./map.css";
import Link from "next/link";
import { Header, Content } from "antd/es/layout/layout";
import { USER_ROLE } from "@/constants";
import { useCurrentUser } from "@/utils/user_info";
import { CategoryType, EventType } from "@/types";
import { getCategories, getEvents } from "@/api";

import { HeartOutlined, ShareAltOutlined, } from "@ant-design/icons";

import dayjs from "dayjs";
import { FacebookIcon, FacebookShareButton, TwitterShareButton, XIcon } from "react-share";

type iMark = { event: EventType, location: google.maps.LatLngLiteral }

export default function Home() {
  const user = useCurrentUser();

  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  const [list, setList] = useState<EventType[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });

  const [categories, setCategories] = useState<CategoryType[]>([]);

  const [marks, setMarks] = useState<iMark[]>([]);

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

  useEffect(() => {
    (async function () {
      getCategories().then((res) => {
        setCategories(res.data);
      });
    })();
  }, []);

  const fetchData = useCallback(
    (search?: EventType) => {
      getEvents({
        current: pagination.current as number,
        pageSize: pagination.pageSize as number,

        all: true
      }).then((res) => {
        setList(res.data);
        setTotal(res.total);

        res.data.map((item: EventType) => {
          if (dayjs(item.expirationTime).isBefore(dayjs(Date.now()))) return;

          var geoArr = item.location.split(',');
          var lat = parseFloat(geoArr[0]);
          var lng = parseFloat(geoArr[1]);
          marks.push(
            { event: item, location: { lat: lat, lng: lng } });
        });

      });

    },
    [pagination]
  );

  const buildContent = (event: EventType) => {
    const category = categories.find(item => item._id === event.category)?.name?.toLowerCase().replace(/\s+/g, '');

    let markBgColor = "";
    const content = document.createElement("div");

    switch (category) {
      case 'sports':
        markBgColor = "#aad08f";
        break;
      case 'job':
        markBgColor = "#17abe3";
        break;
      case 'marketplace':
        markBgColor = "#e89abe";
        break;
      default:
        markBgColor = "#efb336";
        break;
    }

    content.innerHTML = `
      <div class="icon ${category}-icon"></div>
      `;
    return { content, markBgColor };
  }

  const Markers = (props: { marks: iMark[] }) => {
    return (
      <>
        {props.marks.map((mark: iMark) => {
          const imark = buildContent(mark.event);

          const [markerRef, marker] = useAdvancedMarkerRef();

          const [infoWindowShown, setInfoWindowShown] = useState(false);

          const handleMarkerClick = useCallback(
            () => setInfoWindowShown(isShown => !isShown),
            []
          );

          const handleClose = useCallback(() => setInfoWindowShown(false), []);

          const actions: React.ReactNode[] = [
            <FacebookShareButton url={'http://localhost:3000/'}>
              <FacebookIcon size={18} round />
            </FacebookShareButton>,
            <TwitterShareButton
              url={'http://localhost:3000/'}
              title={mark.event.title}
            >
              <XIcon size={18} round />
            </TwitterShareButton>,
            <HeartOutlined key="favorite" />,
          ];

          return (
            <AdvancedMarker
              // key={`key-${mark.event._id}-${Math.random()}`}
              ref={markerRef}
              position={mark.location}
              clickable={true}
              onClick={handleMarkerClick}
            >
              <Pin
                glyph={imark.content}
                background={imark.markBgColor}
                borderColor={"#594d9c"}
              />
              {infoWindowShown && (
                <InfoWindow anchor={marker} onClose={handleClose}>
                  <Card actions={actions} style={{ minWidth: 300 }}>
                    <Card.Meta
                      title={mark.event.title}
                      description={
                        <>
                          <h5>Expired Date: {dayjs(mark.event.expirationTime).format("DD/MM/YYYY HH:mm")}</h5>
                          <h5>Contact: {user == null ? 'Please log in' : mark.event.contact}</h5>
                          <h5>Content: {mark.event.content}</h5>
                        </>
                      }
                    />
                  </Card>
                </InfoWindow>
              )}
            </AdvancedMarker>
          )
        })}
      </>
    );
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, pagination]);

  return (
    <Layout>
      <Header style={{
        position: "sticky",
        top: 0,
        zIndex: 1,
        width: "100%",
        height: "60px",
        display: "inline",
        backgroundColor: "white"
      }}>
        <div className={styles.logo}></div>

        <div className={styles.menus}>
          {
            user == null ? (
              <Row gutter={10}>
                <Col>
                  <Link href={`/login`}>
                    Log in
                  </Link>
                </Col>
                <Col >
                  <Link href={`/register`}>
                    Sign up
                  </Link>
                </Col>
              </Row>
            ) : (
              <Link href={`/dashboard`}>
                Dashboard
              </Link>
            )
          }
        </div>

      </Header>
      <Content title={"Map"} >
        <APIProvider apiKey={AppConfig.googleMapApiKey} onLoad={() => console.log("Maps API has loaded.")}>

          <Map
            className={styles.map}
            defaultZoom={13}
            mapId={AppConfig.mapId}
            defaultCenter={{ lat: lat, lng: lng }}
            gestureHandling="greedy"
            streetViewControl={false}
            onClick={(ev: MapMouseEvent) => {

            }}
            onCameraChanged={(ev: MapCameraChangedEvent) =>
              console.log("camera changed:", ev.detail.center, "zoom:", ev.detail.zoom)
            }>
            <Markers marks={marks} />
          </Map>
        </APIProvider>
      </Content>
    </Layout>


  );
}

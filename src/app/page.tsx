"use client";

import { AdvancedMarker, APIProvider, InfoWindow, Map, MapCameraChangedEvent, Pin, useAdvancedMarkerRef } from "@vis.gl/react-google-maps";
import { Button, Card, Col, Layout, Row, TablePaginationConfig } from "antd";
import { useCallback, useEffect, useState } from "react";
import styles from "./page.module.css";
import "./map.css";
import Link from "next/link";
import { Header, Content } from "antd/es/layout/layout";
import { useCurrentUser } from "@/utils/user_info";
import { CategoryType, EventType, FavoriteType } from "@/types";
import { getCategories, getEvents, setLogout } from "@/api";
import { HeartOutlined, UserOutlined, UserAddOutlined, BarChartOutlined, LogoutOutlined, HeartFilled } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { FacebookIcon, FacebookShareButton, TwitterShareButton, XIcon } from "react-share";
import { EventList } from "@/components";
import { addFavorite, deleteFavorite, getFavorite, getFavorites } from "@/api/favorite";

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

// Initialize Firebase
isSupported().then((supported) => {
  if (supported) {
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    };

    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    const perf = getPerformance(app);
  } else {
    console.log("Firebase Analytics is not supported in this environment.");
  }
});

type iMark = { event: EventType, location: google.maps.LatLngLiteral }

export default function Home() {
  const user = useCurrentUser();
  const router = useRouter();

  const defaultCenter = {
    lat: 0,
    lng: 0,
  };

  const [list, setList] = useState<EventType[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
  });

  const [categories, setCategories] = useState<CategoryType[]>([]);

  const [marks, setMarks] = useState<iMark[]>([]);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [favorites, setFavorites] = useState<FavoriteType[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const latValue = position.coords.latitude;
        const lngValue = position.coords.longitude;

        setMapCenter({ lat: latValue, lng: lngValue });
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
        title: search?.title,
        content: search?.contact,
        category: search?.category,
        all: true
      }).then((res) => {
        const data = res.data.filter((item: EventType) => dayjs(item.expirationTime).isAfter(dayjs(Date.now())));

        data.map((item: EventType) => {
          var geoArr = item.location.split(',');
          var lat = parseFloat(geoArr[0]);
          var lng = parseFloat(geoArr[1]);
          marks.push(
            { event: item, location: { lat: lat, lng: lng } });

          return item;
        });

        setList(data);
        setTotal(data.total);

      });

      getFavorites({ all: true }).then((res) => {
        setFavorites(res.data);
      });

    },
    [pagination]
  );

  const handleFavoriteSubmit = (favorite: FavoriteType) => {
    if (!user) {
      router.push("/login");
    } else {
      favorite?._id != null ? deleteFavorite(favorite._id!) : addFavorite(favorite);
    }

    fetchData();
  }

  const buildContent = (event: EventType) => {
    const category = event.category;
    const categoryIcon = category?.icon;

    const content = document.createElement("div");
    content.innerHTML = `
      <div class="${categoryIcon}-icon"></div>
      `;
    return { content, category };
  }

  const Markers = (props: { marks: iMark[] }) => {
    return (
      <>
        {props.marks.map((mark: iMark) => {
          const imarkObj = buildContent(mark.event);
          const [markerRef, marker] = useAdvancedMarkerRef();
          const [infoWindowShown, setInfoWindowShown] = useState(false);
          const handleMarkerClick = useCallback(
            () => {
              setInfoWindowShown(isShown => !isShown);
            },
            []
          );
          const handleClose = useCallback(() => setInfoWindowShown(false), []);

          const actions: React.ReactNode[] = [
            <FacebookShareButton url={window.location.origin}>
              <FacebookIcon size={18} round />
            </FacebookShareButton>,
            <TwitterShareButton
              url={window.location.origin}
              title={mark.event.title}
            >
              <XIcon size={18} round />
            </TwitterShareButton>,

            (favorites.find(item => item.event._id === mark.event._id) != null ? <HeartFilled
              key="favorite"
              style={{ color: "red" }}
              onClick={() => handleFavoriteSubmit({ _id: favorites.find(item => item.event._id === mark.event._id)?._id!, event: mark.event, user: user, },)}
            /> : <HeartOutlined
              key="favorite"
              onClick={() => handleFavoriteSubmit({ event: mark.event, user: user })}
            />
            )

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
                glyph={imarkObj.content}
                background={imarkObj.category?.color}
                borderColor={"#594d9c"}
              />
              {infoWindowShown && (
                <InfoWindow anchor={marker} onClose={handleClose}>
                  <Card actions={actions} style={{ width: 300 }}>
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
    <Layout style={{ minWidth: "470px" }}>
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
              <Row gutter={16}>
                <Col>
                  <Link href={`/login`}>
                    <UserOutlined /> Log in
                  </Link>
                </Col>
                <Col >
                  <Link href={`/register`}>
                    <UserAddOutlined /> Sign up
                  </Link>
                </Col>
              </Row>
            ) : (
              <Row gutter={10}>
                <Col>
                  <Link href={`/dashboard`}>
                    <BarChartOutlined /> Dashboard
                  </Link>
                </Col>
                <Col >
                  <Button type="link" onClick={async () => {
                    await setLogout();
                    localStorage.removeItem("user");
                    // router.refresh();
                    window.location.reload();
                  }}>
                    <LogoutOutlined /> log out
                  </Button>
                </Col>
              </Row>

            )
          }
        </div>

      </Header>

      <Content title={"Map"} >
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || ''}>

          <Map
            className={styles.map}
            defaultZoom={13}
            id={"map-id"}
            mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
            defaultCenter={mapCenter}
            gestureHandling="greedy"
            streetViewControl={false}
            fullscreenControl={false}
            onCameraChanged={(ev: MapCameraChangedEvent) =>
              console.log("camera changed:", ev.detail.center, "zoom:", ev.detail.zoom)
            }>
            <Markers marks={marks} />
          </Map>
          <EventList events={list} categories={categories}
            handleSearch={(values) => {
              values.content = values.title;
              fetchData(values);
            }}
          ></EventList>
        </APIProvider>
      </Content>
    </Layout>
  );
}

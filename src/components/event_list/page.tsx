"use client";

import { Avatar, List, Radio, Space } from "antd";
import { PropsWithChildren, ReactNode, useEffect } from "react";

import styles from "./page.module.css";
import { relative } from "path";
import { CategoryType, EventType } from "@/types";
import { useMap } from "@vis.gl/react-google-maps";

const EventList: React.FC<
  PropsWithChildren & {
    events: EventType[],
    categories: CategoryType[]
  }
> = ({ events, categories }) => {
  const map = useMap("map-id");

  return (
    <>
      <List
        className="listContent"
        style={{ position: "absolute", left: 0, bottom: 0, zIndex: 100, width: "30%", backgroundColor: "#ffffffcc", margin: "10px", padding: "10px", borderRadius: "10px" }}
        pagination={{ position: "bottom", align: "end" }}
        size="small"
        dataSource={events}
        renderItem={(item, index) => (
          <List.Item onClick={() => {
            const loc = item.location.split(",");
            map?.panTo({ lat: parseFloat(loc[0]), lng: parseFloat(loc[1]) });
          }}>
            <List.Item.Meta
              avatar={<div className={`${categories.find(category => category._id == item.category)?.icon}-icon`} />}
              // key={item._id}
              title={item.title}
              description={item.content}
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default EventList;
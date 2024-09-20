"use client";

import { Button, Col, Form, Input, List, Row, Select, } from "antd";
import { PropsWithChildren, } from "react";

import styles from "./page.module.css";
import { CategoryType, EventType } from "@/types";
import { useMap } from "@vis.gl/react-google-maps";
import { SearchOutlined } from "@ant-design/icons";

const Option = Select.Option;

const EventList: React.FC<
  PropsWithChildren & {
    events: EventType[],
    categories: CategoryType[],
    handleSearch?: (values: EventType) => void,
  }
> = ({ events, categories, handleSearch }) => {
  const map = useMap("map-id");

  const [searchForm] = Form.useForm();

  return (
    <>
      <div style={{ position: "absolute", left: 0, bottom: 0, zIndex: 100, width: "30%", backgroundColor: "#ffffffcc", margin: "10px", padding: "10px", borderRadius: "10px" }}>
        <Form
          form={searchForm}
          name="search"
          className={styles.form}
          style={{ margin: "5px 0 0 5px" }}
          onFinish={handleSearch}
        >
          <Row gutter={8}>
            <Col span={10}>
              <Form.Item name="title">
                <Input placeholder="Search" />
              </Form.Item>
            </Col>

            <Col span={10}>
              <Form.Item name="category">
                <Select
                  placeholder="Please select a category"
                  allowClear>
                  {categories.map((category) => (
                    <Option key={category._id} value={category._id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={3} style={{ textAlign: "left" }}>
              <Button type="primary" shape="circle" htmlType="submit" icon={<SearchOutlined />} />
            </Col>
          </Row>
        </Form>
        <List
          className="listContent"
          size="small"
          dataSource={events}
          pagination={{ position: "bottom", align: "end" }}
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
      </div>
    </>
  );
};

export default EventList;
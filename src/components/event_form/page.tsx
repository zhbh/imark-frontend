"use client";
import React, { useEffect, useState } from 'react';
import { AimOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, DatePicker, Flex, Form, Input, message, Modal, Select, } from 'antd';
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { CategoryType, EventFormType, EventType } from '@/types';
import dayjs from "dayjs";
import { addEvent, getCategories, updateEVent } from '@/api';
import { Content, GoogleMap } from '@/components';
import { useCurrentUser } from "@/utils/user_info";

const Option = Select.Option;

const EventForm: React.FC<EventFormType> = ({ title, editData }) => {
  const router = useRouter();
  const user = useCurrentUser();
  const [modal, contextHolder] = Modal.useModal();
  const [form] = Form.useForm();
  const [openMap, setOpenMap] = useState(false);
  const [location, setLocation] = useState("0,0");
  const [categories, setCategorise] = useState<CategoryType[]>([]);

  useEffect(() => {
    (async function () {
      getCategories().then((res) => {
        setCategorise(res.data);
      });
    })();
  }, []);

  useEffect(() => {
    if (editData) {
      setLocation(editData.location);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const latValue = position.coords.latitude;
          const lngValue = position.coords.longitude;

          setLocation(`${latValue},${lngValue}`);
        }
      );
    };

    if (editData) {
      console.log("🚀 ~ useEffect ~ editData:", editData)
      const data = {
        ...editData,
        expirationTime: editData.expirationTime ? dayjs(editData.expirationTime) : undefined,
        dispatchTime: editData.dispatchTime ? dayjs(editData.dispatchTime) : undefined,
      };
      form.setFieldsValue(data);
    }
  }, [editData, form]);

  const handleSubmit = async (values: EventType) => {
    console.log("🚀 ~ handleSubmit ~ values:", values)

    if (values.expirationTime) {
      values.expirationTime = dayjs(values.expirationTime).valueOf();
    }

    values.location = location;
    values.user = user!;

    console.log("🚀 ~ handleSubmit ~  values:", values);

    if (editData?._id) {
      await updateEVent(editData._id, values);
      message.success("Edit Event Successfully");
    } else {
      await addEvent(values);
      message.success("Add Event Successfully");
    }

    router.push("/dashboard/distribution");
  };

  const handleMap = () => {
    setOpenMap(true);
  };

  const handleOk = (e: React.MouseEvent<HTMLElement>,) => setOpenMap(false);

  const handleCancel = (e: React.MouseEvent<HTMLElement>) => setOpenMap(false);

  return (
    <Content
      title={title}
    >
      <Form
        form={form}
        scrollToFirstError
        style={{ paddingBlock: 32 }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        initialValues={editData ? editData : {}}
        autoComplete="off"
        onFinish={handleSubmit}
      >

        <Form.Item
          name="title"
          label="Title"
          validateTrigger="onBlur"
          rules={[{ required: true, message: "Title is required" }, { max: 20, message: "Continue input to exceed 20 chars", }]}>
          <Input placeholder="Please enter an event’s title" />
        </Form.Item>

        <Form.Item name="content" label="Content" rules={[{ required: true, message: "Content is required", }, { max: 500, message: "Continue input to exceed 500 chars", }]}>
          <Input.TextArea placeholder="Please enter your content" />
        </Form.Item>

        <Form.Item name="contact" label="Contact" rules={[{ required: true, message: "Contact is required", }, { max: 20, message: "Continue input to exceed 20 chars", }]}>
          <Input placeholder="Please enter your email or phone number" />
        </Form.Item>

        <Form.Item name="category" label="Category" rules={[{ required: true, message: "Category is required", }]}>
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

        <Form.Item name="expirationTime" label="Expiration Date" rules={[{ required: true, message: "Expiration Date is required", }]}>
          <DatePicker
            showTime={{ format: 'HH:mm' }}
            format="DD/MM/YYYY HH:mm"
            minDate={dayjs(new Date().toLocaleString(), "DD/MM/YYYY HH:MM")}
          />
        </Form.Item>

        <Form.Item
          name="location"
          label="Location"
          extra="If don’t pick up a location, the default one is your current spot."
          rules={[{ required: false }]}>
          <Button className={styles.location} shape="circle" icon={<AimOutlined />} onClick={handleMap} ></Button>
        </Form.Item>

        <GoogleMap
          open={openMap}
          latlng={location}
          onOk={handleOk}
          onCancel={handleCancel}
          callBack={(location) => {
            setLocation(location);
          }}
        >
        </GoogleMap>

        <Form.Item wrapperCol={{ offset: 6 }}>
          <Flex gap="small">
            <Button type="primary" htmlType="submit" icon={editData?._id ? <EditOutlined /> : <PlusOutlined />}>
              {editData?._id ? "Update" : "Add"}
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Content>
  );
}

export default EventForm;
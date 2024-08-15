"use client";
import React, { useEffect, useState } from 'react';
import { AimOutlined } from '@ant-design/icons';
import { Alert, Button, DatePicker, Flex, Form, Input, message, Select, Space, Typography } from 'antd';
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { EventFormType, EventType } from '@/types';
import dayjs from "dayjs";
import { addEvent, updateEVent } from '@/api';
import { Content } from '@/components';

const EventForm: React.FC<EventFormType> = ({ title, editData }) => {
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
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

    console.log("🚀 ~ handleSubmit ~  values:", values);

    if (editData?._id) {
      await updateEVent(editData._id, values);
      message.success("Edit Event Successfully");
    } else {
      await addEvent(values);
      message.success("Add Event Successfully");
    }

    router.push("/dashboard/distribution/events");
  };

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

        {/* <Form.Item name="category" label="Category" rules={[{ required: true, message: "Category is required", }]}>
          <Select
            placeholder="Please select a category"
            options={[
              { label: 'Sport', value: 'sport' },
              { label: 'Marketplace', value: 'marketplace' },
              { label: 'Rental market', value: 'rentalMarket' },
              { label: 'Job', value: 'job' },
            ]}
          />
        </Form.Item> */}

        <Form.Item name="expirationTime" label="Expiration Date" rules={[{ required: true, message: "Expiration Date is required", }]}>
          <DatePicker
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            minDate={dayjs(new Date().toLocaleString(), "DD/MM/YYYY HH:MM")}
          />
        </Form.Item>

        <Form.Item name="location" label="Location" rules={[{ required: false }]}>
          <Button className={styles.location} shape="circle" icon={<AimOutlined />} />
          <Alert message="If don’t pick up a location, the default one is your current spot." type="info" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6 }}>
          <Flex gap="small">
            <Button type="primary" htmlType="submit" >
              Submit
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Content>
  );
}

export default EventForm;
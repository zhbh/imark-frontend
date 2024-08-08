"use client";
import React from 'react';
import { AimOutlined } from '@ant-design/icons';
import { Alert, Button, DatePicker, Flex, Form, Input, message, Select, Space, Typography } from 'antd';
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { EventType } from '@/types';
import dayjs from "dayjs";
import { addEvent } from '@/api';

export default function AddEventPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const handleSubmit = async (values: EventType) => {
    console.log(
      "%c [ values ]-add event",
      "font-size:13px; background:pink; color:#bf2c9f;",
      values
    );

    if (values.expirationDate) {
      values.expirationDate = dayjs(values.expirationDate).valueOf();
    }
    
    await addEvent(values);
    message.success("Submit Successfully");

    router.push("/dashboard/distribution/events");
  };

  return (
    <Form
      form={form}
      scrollToFirstError
      style={{ paddingBlock: 32 }}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 14 }}
      onFinish={handleSubmit}
    >

      <Form.Item name="title" label="Title" rules={[{ required: true, message: "Title is required", }]}>
        <Input placeholder="Please enter an event’s title" />
      </Form.Item>

      <Form.Item name="content" label="Content" rules={[{ required: true, message: "Content is required", }]}>
        <Input.TextArea placeholder="Please enter your content" />
      </Form.Item>

      <Form.Item name="contact" label="Contact" rules={[{ required: true, message: "Contact is required", }]}>
        <Input placeholder="Please enter your email or phone number" />
      </Form.Item>

      <Form.Item name="category" label="Category" rules={[{ required: true, message: "Category is required", }]}>
        <Select
          placeholder="Please select a category"
          options={[
            { label: 'Sport', value: 'sport' },
            { label: 'Marketplace', value: 'marketplace' },
            { label: 'Rental market', value: 'rentalMarket' },
            { label: 'Job', value: 'job' },
          ]}
        />
      </Form.Item>

      <Form.Item label="expirationDate" name="Expiration Date" rules={[{ required: true, message: "Expiration Date is required", }]}>
        <DatePicker />
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
  );
}

"use client";
import React from 'react';
import { AimOutlined } from '@ant-design/icons';
import { Alert, Button, DatePicker, Flex, Form, Input, message, Select, Space, Typography } from 'antd';
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { EventType } from '@/types';

export default function AddEventPage() {
  const router = useRouter();
  const [form] = Form.useForm();

  const handleSubmit = async (values: EventType) => {
    console.log(
      "%c [ values ]-53",
      "font-size:13px; background:pink; color:#bf2c9f;",
      values
    );
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

      <Form.Item name="Title" label="Title" rules={[{ required: true }]}>
        <Input placeholder="Please enter an event’s title" />
      </Form.Item>

      <Form.Item name="Content" label="Content" rules={[{ required: true }]}>
        <Input.TextArea placeholder="Please enter your content" />
      </Form.Item>

      <Form.Item name="Contact" label="Contact" rules={[{ required: true }]}>
        <Input placeholder="Please enter your email or phone number" />
      </Form.Item>

      <Form.Item name="Category" label="Category" rules={[{ required: true }]}>
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

      <Form.Item label="Expiration Date" name="Expiration Date" rules={[{ required: true }]}>
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

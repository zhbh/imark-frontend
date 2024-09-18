"use client";

import request from "@/utils/request";
import { Button, Flex, Form, Input, message } from "antd";
import classnames from "classnames";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { UserLoginType } from "@/types";
import { ArrowLeftOutlined } from "@ant-design/icons";

import styles from "./page.module.css";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const handleFinish = async (values: UserLoginType) => {
    try {
      const res = await request.post("/api/login", values);
      console.log("🚀 ~ handleFinish ~ res:", res)

      localStorage.setItem("user", JSON.stringify(res.data));
      message.success("Log in successfully!");

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Log in</title>
        <meta name="description" content="imark - map-based information distribution management system" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <header className={styles.header}>
          iMark
        </header>
        <div className={styles.form}>
          <Form
            name="basic"
            initialValues={{ name: "", password: "" }}
            onFinish={handleFinish}
            layout="vertical"
            autoComplete="off"
            size="large"
          >

            <Form.Item
              name="name"
              label={<span className={styles.label}>Username</span>}
              rules={[{ required: true, message: "Please input your username" }]}
            >
              <Input placeholder="Please input your username" />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className={styles.label}>Password</span>}
              rules={[{ required: true, message: "Please input your password" }]}
            >
              <Input.Password placeholder="Please input your password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className={classnames(styles.btn, styles.loginBtn)}
                size="large"
              >
                Log in
              </Button>
            </Form.Item>

          </Form>

          <Flex justify="space-between">
            <Button type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/")
              } />

            <Link href="/register">
              Sign up
            </Link>
          </Flex>

        </div>
      </main>
    </>
  );
}

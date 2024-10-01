"use client";

import request from "@/utils/request";
import { Button, Flex, Form, Input, message, Radio } from "antd";
import classnames from "classnames";
import Head from "next/head";
import { ArrowLeftOutlined } from "@ant-design/icons";

import styles from "./page.module.css";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { UserLoginType } from "@/types";

export default function Register() {
  const router = useRouter();

  const handleFinish = async (values: UserLoginType) => {
    try {
      const res = await request.post("/api/register", values);
      console.log("🚀 ~ handleFinish ~ res:", res)

      message.success("Register successfully!");

      router.push("/login");
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
            initialValues={{ name: "", password: "", confirmPassword: "", nickName: "", role: "user", sex: "male", status: "on" }}
            onFinish={handleFinish}
            layout="vertical"
            autoComplete="off"
            size="large"
          >
            <Form.Item
              name="name"
              label={<span className={styles.label}>Username</span>}
              validateTrigger="onBlur"
              rules={[{ required: true, message: "username is required" }, { max: 20, message: "Continue input to exceed 20 chars", }]}
            >
              <Input placeholder="Please input your username" />
            </Form.Item>

            <Form.Item
              label="Nickname"
              extra="Display name"
              name="nickName"
              hidden
            >
              <Input placeholder="Please input the nickname" />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className={styles.label}>Password</span>}
              rules={[
                { required: true, message: "Please input your password" },
                ({
                  validator(_, value) {
                    var pwdRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}');
                    if (pwdRegex.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Must contain one number, one upper letter, one lower letter and one special character, at least 8 charaters"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Please input your password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span className={styles.label}>Confirm Password</span>}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("The new password that you entered do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Please input your password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                className={classnames(styles.btn, styles.submitBtn)}
                size="large"
              >
                Sign up
              </Button>
            </Form.Item>

          </Form>

          <Flex justify="space-between">
            <Button type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/")
              } />

            <Link href="/login">
              Log in
            </Link>
          </Flex>

        </div>
      </main>
    </>
  );
}

"use client";

import { addUser, updateUser } from "@/api";
import { Content } from "@/components";
import { USER_ROLE, USER_SEX, USER_STATUS } from "@/constants";
import { UserFormProps, UserType } from "@/types";
import { useCurrentUser } from "@/utils/user_info";
import { Button, Form, Input, Radio, message } from "antd";
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "./page.module.css";

const UserForm: React.FC<UserFormProps> = ({
  title,
  editData = {
    sex: USER_SEX.MALE,
    status: USER_STATUS.ON,
    role: USER_ROLE.USER,
    _id: null,
  },
}) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const user = useCurrentUser();
  useEffect(() => {
    form.setFieldsValue(editData);
  }, [editData, form]);

  const handleFinish = async (values: UserType) => {
    try {
      if (editData?._id) {
        await updateUser(editData._id, values);
        message.success("Edit the user successfully!");
      } else {
        await addUser(values);
        message.success("Create the user successfully!");
      }
      setTimeout(() => {
        router.push("/dashboard/user");
      });
    } catch (error) {
      console.error(error);
    }
  };

  const isEdit = !!editData?._id;

  return (
    <>
      <Content title={title}>
        <Form
          name="user"
          form={form}
          scrollToFirstError
          style={{ paddingBlock: 32 }}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          className={styles.form}
          initialValues={editData}
          onFinish={handleFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            extra="Using the username to log in"
            name="name"
            rules={[
              {
                required: isEdit ? false : true,
                message: "Please input the username",
              },
            ]}
          >
            <Input disabled={isEdit ? true : false} placeholder="Please input the username" />
          </Form.Item>

          {/* <Form.Item
            label="Nickname"
            extra="Display name"
            name="nickName"
            rules={[
              {
                required: true,
                message: "Please input the nickname",
              },
            ]}
          >
            <Input placeholder="Please input the nickname" />
          </Form.Item> */}

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: user?.role === USER_ROLE.USER,
                message: "Please input the password",
              },
              ({
                validator(_, value) {
                  var pwdRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}');
                  if (user?.role != USER_ROLE.USER || pwdRegex.test(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Must contain one number, one upper letter, one lower letter and one special character, at least 8 charaters"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Please input the password" type="password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={<span className={styles.label}>Confirm Password</span>}
            rules={[
              {
                required: user?.role === USER_ROLE.USER,
                message: "Please input the confirm password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (user?.role != USER_ROLE.USER || (!value || getFieldValue("password") === value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The new password that you entered do not match!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Please input your password" />
          </Form.Item>

          {/* <Form.Item label="Gender" name="sex">
            <Radio.Group>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </Radio.Group>
          </Form.Item> */}

          <Form.Item label="Status" name="status" hidden={user?.role === USER_ROLE.USER}>
            <Radio.Group disabled={user?.role === USER_ROLE.USER}>
              <Radio value="on">Activate</Radio>
              <Radio value="off">Forbidden</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Role" name="role" hidden={user?.role === USER_ROLE.USER}>
            <Radio.Group disabled={user?.role === USER_ROLE.USER}>
              <Radio value="user">User</Radio>
              <Radio value="admin">Administrator</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item colon={false} wrapperCol={{ offset: 5 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className={styles.btn}
              icon={editData?._id ? <EditOutlined /> : <PlusOutlined />}
            >
              {editData?._id ? "Update" : "Create"}
            </Button>
          </Form.Item>

        </Form>
      </Content>
    </>
  );
};

export default UserForm;

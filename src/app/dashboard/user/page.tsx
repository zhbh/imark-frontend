"use client";

import { getUserList, deleteUser, updateUser } from "@/api";
import { Auth, Content } from "@/components";
import { USER_ROLE, USER_STATUS } from "@/constants";
import { UserQueryType, UserType } from "@/types";
import { useCurrentUser } from "@/utils/user_info";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  Tag,
  message,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import styles from "./page.module.css";

const Option = Select.Option;

const COLUMNS = [
  {
    title: "Account",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
    width: 140,
  },
  {
    title: "Username",
    dataIndex: "nickName",
    key: "nickName",
    ellipsis: true,
    width: 140,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    ellipsis: true,
    width: 120,
    render: (text: string) =>
      text === "on" ? (
        <Tag color="green">Activate</Tag>
      ) : (
        <Tag color="red">Forbidden</Tag>
      ),
  },
  {
    title: "Created Time",
    dataIndex: "createdTime",
    key: "createdTime",
    width: 200,
    render: (text: number) => {
      return dayjs(text).format("DD/MM/YYYY HH:mm");
    },
  },
];

export default function Book() {
  const [form] = Form.useForm();
  const user = useCurrentUser();
  const [list, setList] = useState<UserType[]>([]);

  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
  });
  const router = useRouter();

  const columns = user?.role === USER_ROLE.ADMIN ? [
    ...COLUMNS,
    {
      title: "Operation",
      dataIndex: "",
      key: "action",
      render: (_: any, row: UserType) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              router.push(`/dashboard/user/edit/${row._id}`);
            }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger={row.status === USER_STATUS.ON}
            onClick={() => {
              handleUpdateStatus(row);
            }}
          >
            {row.status === USER_STATUS.ON ? "Forbidden" : "Activate"}
          </Button>
          <Button
            type="link"
            danger
            onClick={() => {
              handleDeleteModal(row as UserType);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ] : COLUMNS;

  const fetchData = useCallback(
    (search?: UserQueryType) => {
      const { name, status } = search || {};
      getUserList({
        current: pagination.current as number,
        pageSize: pagination.pageSize as number,
        ...(name && { name }),
        ...(status && { status }),
      }).then((res) => {
        setList(res.data);
        setTotal(res.total);
      });
    },
    [pagination]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData, pagination]);

  const handleAdd = () => {
    router.push("/dashboard/user/add");
  };

  const handleDeleteModal = (user: UserType) => {
    Modal.confirm({
      title: `Confirm to delete the user ${user.name}?`,
      icon: <ExclamationCircleFilled />,
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        await deleteUser(user._id as string);
        message.success("Delete successfully!");
        fetchData(form.getFieldsValue());
      },
    });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const handleSearchFinish = (values: UserQueryType) => {
    fetchData(values);
  };

  const handleUpdateStatus = async (row: UserType) => {
    await updateUser(row._id as string, {
      ...row,
      status: row.status === USER_STATUS.ON ? USER_STATUS.OFF : USER_STATUS.ON,
    });
    fetchData(form.getFieldsValue());
  };

  return (
    <>
      <Auth>
        <Content
          title="Users"
          operation={
            <Button type="primary" size="small" onClick={handleAdd}>
              Add User
            </Button>
          }
        >
          <Form
            form={form}
            name="search"
            className={styles.form}
            style={{ margin: "10px 0 0 10px" }}
            onFinish={handleSearchFinish}
          >
            <Row gutter={24}>
              <Col span={5}>
                <Form.Item name="name" label="Name">
                  <Input placeholder="Please input a name" allowClear />
                </Form.Item>
              </Col>
              <Col span={5}>
                <Form.Item name="status" label="Status">
                  <Select placeholder="Please select a status" allowClear>
                    <Option key={USER_STATUS.ON} value={USER_STATUS.ON}>
                      Activate
                    </Option>
                    <Option key={USER_STATUS.OFF} value={USER_STATUS.OFF}>
                      Forbidden
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={9} style={{ textAlign: "left" }}>
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
                <Button
                  style={{ margin: "0 8px" }}
                  onClick={() => {
                    form.resetFields();
                    fetchData();
                  }}
                >
                  Clear
                </Button>
              </Col>
            </Row>
          </Form>

          <div className={styles.tableWrap}>
            <Table
              rowKey="_id"
              dataSource={list}
              columns={columns}
              onChange={handleTableChange}
              pagination={{
                ...pagination,
                total: total,
                showTotal: () => `Total ${total} records`,
              }}
            />
          </div>

        </Content>
      </Auth>
    </>
  );
}

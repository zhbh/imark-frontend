"use client";

import { Content } from "@/components";
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
import { useCallback, useEffect, useState } from "react";

import styles from "./page.module.css";
import { CategoryQueryType, CategoryType } from "@/types";

const Option = Select.Option;

const COLUMNS = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
    width: 160,
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    ellipsis: true,
    width: 200,
    render: (text: { name: string }) => {
      return text?.name ?? "-";
    },
  },
  {
    title: "Created Time",
    dataIndex: "createdTime",
    key: "createdTime",
    width: 200,
    render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
  },
];

export default function Book() {
  const [form] = Form.useForm();
  const [isModalOpen, setModalOpen] = useState(false);
  const [list, setList] = useState<CategoryType[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
  });
  const [editData, setEditData] = useState<Partial<CategoryType>>({});

  const columns = [
    ...COLUMNS,
    {
      title: "Operations",
      dataIndex: "",
      key: "action",
      render: (_: any, row: CategoryType) => (
        <Space>
          <Button
            type="link"
            block
            onClick={() => {
              setModalOpen(true);
              setEditData(row);
            }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            block
            onClick={() => {
              handleDeleteModal(row._id as string);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const fetchData = useCallback(
    (search?: CategoryQueryType) => {
      // to do
    },
    [pagination]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData, pagination]);

  const handleEditCategoryFinish = async (values: CategoryType) => {
    //to do
  };

  const handleOk = async () => {
    form.submit();
  };

  const handleCancel = () => {
    setEditData({});
    setModalOpen(false);
  };

  const handleDeleteModal = (id: string) => {
    Modal.confirm({
      title: "Confirm to delete?",
      icon: <ExclamationCircleFilled />,
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        //to do
        message.success("Delete successfully!");
        fetchData(form.getFieldsValue());
      },
    });
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPagination(pagination);
  };

  const handleSearchFinish = (values: CategoryQueryType) => {
    fetchData(values);
  };

  const handleAddCategory = () => {
    setModalOpen(true);
    setTimeout(() => {
      form.resetFields();
    });
  };

  return (
    <>
      <Content
        title="Category"
        operation={
          <Button type="primary" onClick={handleAddCategory}>
            Add Category
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
                <Input placeholder="Please input the name" allowClear />
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item name="category" label="Category">
                <Select
                  allowClear
                  placeholder="Please select a category"
                // options={} todo
                ></Select>
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
              showTotal: () => `Total ${total} record(s)`,
            }}
          />
        </div>

        {isModalOpen && (
          <Modal
            title={editData._id ? "Edit Category" : "Create Category"}
            open={isModalOpen}
            onOk={handleOk}
            okText="Confirm"
            cancelText="Cancel"
            onCancel={handleCancel}
          >
            <Form
              name="category"
              form={form}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              style={{ maxWidth: 600 }}
              initialValues={editData ? editData : {}}
              onFinish={handleEditCategoryFinish}
              autoComplete="off"
            >

              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please inpunt a name",
                  },
                ]}
              >
                <Input placeholder="Please inpunt a name" />
              </Form.Item>

            </Form>
          </Modal>
        )}
      </Content>
    </>
  );
}
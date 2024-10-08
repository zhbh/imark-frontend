"use client";

import { Auth, Content } from "@/components";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  Button,
  Col,
  ColorPicker,
  ColorPickerProps,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  TablePaginationConfig,
  message,
  Divider,
  theme,
  Radio,
} from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { PlusOutlined, SearchOutlined, ClearOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./page.module.css";
import { CategoryQueryType, CategoryType } from "@/types";
import request from "@/utils/request";
import qs from "qs";
import { addCategory, deleteCategory, updateCategory } from "@/api";
import { cyan, generate, green, presetPalettes, red } from "@ant-design/colors";

type Presets = Required<ColorPickerProps>["presets"][number];

const COLUMNS = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    ellipsis: true,
    width: 160,
  },
  {
    title: "Color",
    dataIndex: "color",
    key: "color",
    width: 160,
    render: (value: string) => <ColorPicker
      showText
      value={value}
      disabled
    />
  },
  {
    title: "Icon",
    dataIndex: "icon",
    key: "icon",
    width: 100,
    render: (value: string) => <div className={`${value}-icon`}></div>,
  },
  {
    title: "Created Time",
    dataIndex: "createdTime",
    key: "createdTime",
    width: 160,
    render: (text: string) => dayjs(text).format("DD/MM/YYYY"),
  },
];

const genPresets = (presets = presetPalettes) =>
  Object.entries(presets).map<Presets>(([label, colors]) => ({
    label,
    colors,
  }));

export default function Category() {
  const [searchForm] = Form.useForm();
  const [categoryForm] = Form.useForm();
  const [isModalOpen, setModalOpen] = useState(false);
  const [list, setList] = useState<CategoryType[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 20,
    showSizeChanger: true,
  });
  const [editData, setEditData] = useState<Partial<CategoryType>>({});
  const { token } = theme.useToken();
  const [color, setColor] = useState(editData.color ? editData.color : "#aad08f");

  const presets = genPresets({
    primary: generate(token.colorPrimary),
    red,
    green,
    cyan,
  });

  const [loading, setLoading] = useState(false);

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
            icon={<EditOutlined />}
            onClick={() => {
              setModalOpen(true);
              setEditData(row);
              categoryForm.setFieldsValue(row);
            }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            block
            icon={<DeleteOutlined />}
            onClick={() => {
              handleDeleteModal(row);
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
      const { name } = search || {};

      setLoading(true);
      request
        .get(
          `/api/category?${qs.stringify({
            current: pagination.current,
            pageSize: pagination.pageSize,
            name,
          })}`
        )
        .then((res) => {
          setList(res.data);
          setTotal(res.total);
        }).finally(() => setLoading(false));
    },
    [pagination]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData, pagination]);

  const handleCategoryFinish = async (values: CategoryType) => {
    values.color = color;
    values.icon = values.icon ?? "sports";
    console.log("🚀 ~ handleCategoryFinish ~ values:", values)

    if (editData._id) {
      await updateCategory(editData._id, values);
      message.success("Edit the category successfully!");
    } else {
      await addCategory(values);
      message.success("Create the category successfully!");
    }

    await fetchData();
    handleCancel();
  };

  const handleOk = async () => {
    categoryForm.submit();
  };

  const handleCancel = () => {
    setEditData({});
    setModalOpen(false);
  };

  const handleDeleteModal = (row: CategoryType) => {
    Modal.confirm({
      title: `Confirm to delete the category ${row.name}?`,
      icon: <ExclamationCircleFilled />,
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
        await deleteCategory(row._id as string);
        message.success("Delete successfully!");
        fetchData(categoryForm.getFieldsValue());
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
    setTimeout(() => categoryForm.resetFields());
  };

  const customPanelRender: ColorPickerProps["panelRender"] = (
    _,
    { components: { Picker, Presets } },
  ) => (
    <Row justify="space-between" wrap={false}>
      <Col span={12}>
        <Presets />
      </Col>
      <Divider type="vertical" style={{ height: "auto" }} />
      <Col flex="auto">
        <Picker />
      </Col>
    </Row>
  );

  return (
    <>
      <Auth>
        <Content
          title="Category"
          operation={
            <Button
              type="primary"
              onClick={handleAddCategory}
              icon={<PlusOutlined />}>
              Add Category
            </Button>
          }
        >
          <Form
            form={searchForm}
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

              <Col span={9} style={{ textAlign: "left" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}>
                  Search
                </Button>
                <Button
                  style={{ margin: "0 8px" }}
                  icon={<ClearOutlined />}
                  onClick={() => {
                    searchForm.resetFields();
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
              loading={loading}
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
              title={editData._id ? "Edit Category" : "Add Category"}
              open={isModalOpen}
              okText="Confirm"
              cancelText="Cancel"
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <Form
                name="category"
                form={categoryForm}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                style={{ maxWidth: 600 }}
                initialValues={editData ? editData : {}}
                onFinish={handleCategoryFinish}
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

                <Form.Item
                  label="Color"
                  name="color"
                >
                  <ColorPicker
                    showText
                    // defaultValue={color}
                    styles={{ popupOverlayInner: { width: 480 } }}
                    presets={presets}
                    panelRender={customPanelRender}
                    onChange={(color) => setColor(color.toHexString())}
                  />
                </Form.Item>

                <Form.Item
                  label="Icon"
                  name="icon"
                >
                  <Radio.Group defaultValue={"sports"}>
                    <Radio value="sports"><div className="sports-icon"></div></Radio>
                    <Radio value="job"><div className="job-icon"></div></Radio>
                    <Radio value="marketplace"><div className="marketplace-icon"></div></Radio>
                    <Radio value="rentalmarket"><div className="rentalmarket-icon"></div></Radio>
                  </Radio.Group>

                </Form.Item>

              </Form>
            </Modal>
          )}
        </Content>
      </Auth>
    </>
  );
}
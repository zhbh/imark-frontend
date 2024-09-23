"use client";

import styles from "./page.module.css";
import { Form, Table, Space, Tag, TableProps, Tooltip, TablePaginationConfig, Modal, message, Button, Row, Col, Input, Select } from "antd";
import { ExclamationCircleFilled, PlusOutlined, SearchOutlined, ClearOutlined, EditOutlined, DeleteOutlined, AimOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryType, EventType } from "@/types";
import { getEvents, deleteEvent, getCategories } from "@/api";
import { Content, GoogleMap, PopUpModal } from "@/components";

const Option = Select.Option;

export default function Events() {
    const [searchForm] = Form.useForm();
    const router = useRouter();
    const [list, setList] = useState<EventType[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
    });
    const [openMap, setOpenMap] = useState(false);
    const [location, setLocation] = useState("0,0");
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [category, setCategory] = useState<CategoryType>();

    const COLUMNS = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: 120,
            render: (value: string) => {
                return <Tooltip title={value} placement="topLeft">
                    {value}
                </Tooltip>
            },
        },
        {
            title: "Content",
            dataIndex: "content",
            key: "content",
            ellipsis: true,
            width: 200,
            render: (value: string) => {
                return <Tooltip title={value} placement="topLeft">
                    {value}
                </Tooltip>
            },
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            ellipsis: true,
            width: 120,
            render: (item: CategoryType) =>
                item != null ? <Tag color="blue">{item.name}</Tag> : "-",
        },
        {
            title: "Expiration Time",
            dataIndex: "expirationTime",
            key: "expirationTime",
            width: 150,
            render: (value: string) => dayjs(value).format("DD/MM/YYYY HH:mm"),
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "expirationTime",
            width: 120,
            render: (_: any, row: EventType) => dayjs(row.expirationTime).isAfter(dayjs(Date.now())) ? (
                <Tag color="green"  >
                    In Progress
                </Tag >
            ) : (
                <Tag color="gray"  >
                    Done
                </Tag >
            ),
        },
        // {
        //     title: "Dispatch Time",
        //     dataIndex: "dispatchTime",
        //     key: "dispatchTime",
        //     width: 120,
        //     render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
        // },
    ];

    const fetchData = useCallback(
        (search?: EventType) => {
            const { title, content, category } = search || {};
            setLoading(true);
            getEvents({
                current: pagination.current as number,
                pageSize: pagination.pageSize as number,
                title,
                content,
                category,
            }).then((res) => {
                setLoading(false);
                setList(res.data);
                setTotal(res.total);
            });

        },
        [pagination]
    );

    useEffect(() => {
        fetchData();
    }, [fetchData, pagination]);

    const handleEventAdd = () => {
        router.push("/dashboard/distribution/add");
    };

    useEffect(() => {
        (async function () {
            getCategories().then((res) => {
                setCategories(res.data);
            });
        })();
    }, []);

    const handleDeleteModal = (data: EventType) => {
        Modal.confirm({
            title: `Confirm to delete the event ${data.title}?`,
            icon: <ExclamationCircleFilled />,
            okText: "Confirm",
            cancelText: "Cancel",
            async onOk() {
                try {
                    await deleteEvent(data._id as string);
                    message.success(`Delete the Event ${data.title}`);
                    fetchData();
                } catch (error) {
                    console.error(error);
                }
            },
        });
    };

    const handleSearch = (values: EventType) => {
        fetchData(values);
    };

    const handleTableChange = (pagination: TablePaginationConfig) => {
        setPagination(pagination);
    };

    const operations = {
        title: "Operations",
        key: "actions",
        dataIndex: "actions",
        render: (_: any, row: EventType) => (
            <Space size="small" align="center">
                <Button
                    type="link"
                    block
                    icon={<AimOutlined />}
                    onClick={() => {
                        setOpenMap(true);
                        setLocation(row.location);
                        setCategory(row.category);
                    }}
                >
                    Map
                </Button>
                <Button
                    type="link"
                    block
                    icon={<EditOutlined />}
                    onClick={() => {
                        router.push(`/dashboard/distribution/edit/${row._id}`);
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
                        handleDeleteModal(row as EventType);
                    }}
                >
                    Delete
                </Button>
            </Space>
        ),
    };

    const handleOk = (e: React.MouseEvent<HTMLElement>) => {
        setOpenMap(false);
    };

    const handleCancel = (e: React.MouseEvent<HTMLElement>) => {
        setOpenMap(false);
    };

    return (
        <Content
            title="Events"
            operation={
                <Button type="primary" size="small" icon={<PlusOutlined />} onClick={handleEventAdd}>
                    Add Event
                </Button>
            }
        >
            <Form
                form={searchForm}
                name="search"
                className={styles.searchForm}
                style={{ margin: "10px 0 0 10px" }}
                onFinish={handleSearch}
            >
                <Row gutter={24}>
                    <Col span={4}>
                        <Form.Item name="title" label="Title">
                            <Input placeholder="Please input" />
                        </Form.Item>
                    </Col>

                    <Col span={5}>
                        <Form.Item name="content" label="Content">
                            <Input placeholder="Please input" />
                        </Form.Item>
                    </Col>

                    <Col span={5}>
                        <Form.Item name="category" label="Category">
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
                    </Col>

                    <Col span={8} style={{ textAlign: "left" }}>
                        <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
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
                    size="small"
                    rowKey="_id"
                    showHeader={true}
                    loading={loading}
                    columns={[...COLUMNS, operations]}
                    dataSource={list}
                    onChange={handleTableChange}
                    tableLayout="fixed"
                    pagination={{
                        ...pagination,
                        total: total,
                        showTotal: () => `Total ${total} record(s)`,
                    }}
                />
            </div>
            <GoogleMap
                title="Event Location"
                open={openMap}
                onOk={handleOk}
                onCancel={handleCancel}
                latlng={location}
                category={category}
                cancelButtonProps={{ disabled: true }}
            ></GoogleMap>
        </Content>
    );
}
"use client";

import styles from "./page.module.css";
import { Form, Table, Space, Tag, Tooltip, TablePaginationConfig, Modal, message, Button, Row, Col, Input, Select } from "antd";
import { HeartOutlined, HeartFilled, SearchOutlined, ClearOutlined, AimOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryType, EventType, FavoriteQueryType, FavoriteType } from "@/types";
import { getCategories } from "@/api";
import { Content, GoogleMap } from "@/components";
import { useCurrentUser } from "@/utils/user_info";
import { deleteFavorite, getFavorites } from "@/api/favorite";

const Option = Select.Option;

export default function Favorites() {
    const [searchForm] = Form.useForm();
    const router = useRouter();
    const user = useCurrentUser();

    const [list, setList] = useState<FavoriteType[]>([]);
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
            render: (_: any, row: FavoriteType) => {
                return <Tooltip title={row.event?.title} placement="topLeft">
                    {row.event?.title}
                </Tooltip>
            },
        },
        {
            title: "Content",
            dataIndex: "content",
            key: "content",
            ellipsis: true,
            width: 160,
            render: (_: any, row: FavoriteType) => {
                return <Tooltip title={row.event?.content} placement="topLeft">
                    {row.event?.content}
                </Tooltip>
            },
        },
        {
            title: "Contact",
            dataIndex: "contact",
            key: "contact",
            ellipsis: true,
            width: 100,
            render: (_: any, row: FavoriteType) => {
                return <Tooltip title={row.event?.contact} placement="topLeft">
                    {row.event?.contact}
                </Tooltip>
            },
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            ellipsis: true,
            width: 120,
            render: (_: any, row: FavoriteType) =>
                row.event?.category != null ? <Tag color="blue">{row.event?.category.name}</Tag> : "-",
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
            render: (_: any, row: FavoriteType) => dayjs(row.event?.expirationTime).isAfter(dayjs(Date.now())) ? (
                <Tag color="green"  >
                    In Progress
                </Tag >
            ) : (
                <Tag color="gray"  >
                    Done
                </Tag >
            ),
        },
    ];

    const fetchData = useCallback(
        (search?: FavoriteQueryType) => {
            const { title, category } = search || {};
            setLoading(true);
            getFavorites({
                current: pagination.current as number,
                pageSize: pagination.pageSize as number,
                title,
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

    useEffect(() => {
        (async function () {
            getCategories().then((res) => {
                setCategories(res.data);
            });
        })();
    }, []);

    const handleUnfavoriteModal = (data: FavoriteType) => {
        Modal.confirm({
            title: `Confirm to unfavorite "${data.event.title}"?`,
            icon: <HeartOutlined />,
            okText: "Confirm",
            cancelText: "Cancel",
            async onOk() {
                try {
                    await deleteFavorite(data._id as string);
                    message.success(`Unfavorite "${data.event.title}"`);
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
        render: (_: any, row: FavoriteType) => (
            <Space size="small" align="center">
                <Button
                    type="link"
                    block
                    icon={<AimOutlined />}
                    onClick={() => {
                        setOpenMap(true);
                        setLocation(row.event?.location);
                        setCategory(row.event.category);
                    }}
                >
                    Map
                </Button>
                <Button
                    type="link"
                    danger
                    block
                    icon={<div className={styles.heartBreak}></div>}
                    onClick={() => {
                        handleUnfavoriteModal(row as FavoriteType);
                    }}
                >
                    Unfavorite
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
            title="Favorites"
        >
            {/* <Form
                form={searchForm}
                name="search"
                className={styles.searchForm}
                style={{ margin: "10px 0 0 10px" }}
                onFinish={handleSearch}
            >
                <Row gutter={24}>
                    <Col span={5}>
                        <Form.Item name="title">
                            <Input placeholder="Please search for event's title" allowClear />
                        </Form.Item>
                    </Col>

                    <Col span={5}>
                        <Form.Item name="content">
                            <Input placeholder="Please search for event's content" allowClear />
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
            </Form> */}
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
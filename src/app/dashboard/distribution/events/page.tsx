"use client";

import styles from "./page.module.css";
import { Form, Table, Space, Tag, TableProps, Tooltip, TablePaginationConfig, Modal, message, Button, Row, Col, Input, Select } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EventType } from "@/types";
import { getEvents, deleteEvent } from "@/api";
import { Content, GoogleMap, PopUpModal } from "@/components";

const columns = [
    {
        title: "Title",
        dataIndex: "title",
        key: "title",
        width: 120
    },
    {
        title: "Content",
        dataIndex: "content",
        key: "content",
        ellipsis: true,
        width: 160,
        render: (value: string) => {
            return <Tooltip title={value} placement="topLeft">
                {value}
            </Tooltip>
        },
    },
    {
        title: "Expiration Time",
        dataIndex: "expirationTime",
        key: "expirationTime",
        width: 160,
        render: (value: string) => dayjs(value).format("DD/MM/YYYY HH:mm"),
    },
    // {
    // title: "Status",
    // key: "status",
    // dataIndex: "status",
    // width: 120,
    // render: (value: [string]) => (
    //     <>
    //         {value.map((tag) => {
    //             let tagLowerCase = tag.toLowerCase();
    //             let color = tagLowerCase.includes("in progress") ? "green" : tagLowerCase.includes("done") ? "gray" : "red";
    //             if (tag === "loser") {
    //                 color = "volcano";
    //             }
    //             return (
    //                 <Tag color={color} key={tag}>
    //                     {tag.toUpperCase()}
    //                 </Tag>
    //             );
    //         })}
    //     </>
    // ),
    // },
    {
        title: "Last Dispatch Time",
        dataIndex: "lastDispatchTime",
        key: "lastDispatchTime",
        width: 160,
        render: (value: string) => dayjs(value).format("DD/MM/YYYY HH:mm"),
    },
];

export default function Events() {
    const [form] = Form.useForm();
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

    const fetchData = useCallback(
        (search?: EventType) => {
            const { title, content } = search || {};
            setLoading(true);
            getEvents({
                current: pagination.current as number,
                pageSize: pagination.pageSize as number,
                title,
                content,
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
        title: "Action",
        key: "actions",
        dataIndex: "actions",
        render: (_: any, row: EventType) => (
            <Space size="small" align="center">
                <Button
                    type="link"
                    block
                    onClick={() => {
                        setOpenMap(true);
                        setLocation(row.location);
                        console.log("🚀 ~ Events ~ row.location:", row.location)
                    }}
                >
                    View
                </Button>
                <Button
                    type="link"
                    block
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
                <Button type="primary" size="small" onClick={handleEventAdd}>
                    Add Event
                </Button>
            }
        >
            <Form
                form={form}
                name="search"
                className={styles.form}
                style={{ margin: "10px 0 0 10px" }}
                onFinish={handleSearch}
            >
                <Row gutter={24}>
                    <Col span={5}>
                        <Form.Item name="title" label="Title">
                            <Input placeholder="Please input" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="content" label="Content">
                            <Input placeholder="Please input" />
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
                    size="small"
                    rowKey="_id"
                    showHeader={true}
                    loading={loading}
                    columns={[...columns, operations]}
                    dataSource={list}
                    onChange={handleTableChange}
                    tableLayout="fixed"
                    pagination={{
                        ...pagination,
                        total: total,
                        showTotal: () => `Total ${total} records`,
                    }}
                />
            </div>
            <GoogleMap
                title="Event Location"
                open={openMap}
                onOk={handleOk}
                onCancel={handleCancel}
                latlng={location}
                cancelButtonProps={{ disabled: true }}
            ></GoogleMap>
        </Content>
    );
}
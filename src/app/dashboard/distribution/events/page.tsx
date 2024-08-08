"use client";
import { Table, Space, Tag, TableProps, Tooltip, TablePaginationConfig, Modal, message, Button } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { EventType } from "@/types";
import { getEvents } from "@/api";

const columns = [
    {
        title: "Title",
        dataIndex: "title",
        key: "title",
        width: 200
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
        title: "Expiration Time",
        dataIndex: "expiredTime",
        key: "expiredTime",
        width: 120,
        render: (value: string) => dayjs(value).format("DD/MM/YYYY HH:mm"),
    },
    {
        title: "Status",
        key: "status",
        dataIndex: "status",
        render: (value: [string]) => (
            <>
                {value.map((tag) => {
                    let tagLowerCase = tag.toLowerCase();
                    let color = tagLowerCase.includes("in progress") ? "green" : tagLowerCase.includes("done") ? "gray" : "red";
                    if (tag === "loser") {
                        color = "volcano";
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: "Last Dispatch Time",
        dataIndex: "lastDispatchTime",
        key: "lastDispatchTime",
        width: 120,
        render: (value: string) => dayjs(value).format("DD/MM/YYYY HH:mm"),
    },
];

const data = [
    {
        key: "1",
        title: "Play badminton",
        content: "Address: The University of Waikato",
        expiredTime: dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        lastDispatchTime: dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        status: ["In progress"],
    },
    {
        key: "2",
        title: "Car for sale",
        content: "Good Price",
        expiredTime: dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        lastDispatchTime: dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        status: ["Done"],
    },
    {
        key: "2",
        title: "XXXX",
        content: "YYYYYYYY",
        expiredTime: dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        lastDispatchTime: dayjs(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        status: ["Disapproval"],
    },
];

export default function EventsPage() {
    const [list, setList] = useState<EventType[]>([]);
    const [total, setTotal] = useState(0);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 20,
        showSizeChanger: true,
    });


    const fetchData = useCallback(
        () => {
            getEvents({
                current: pagination.current as number,
                pageSize: pagination.pageSize as number,
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

    const handleDeleteModal = (id: string) => {
        Modal.confirm({
            title: "Confirm to delete?",
            icon: <ExclamationCircleFilled />,
            okText: "Confirm",
            cancelText: "Cancel",
            async onOk() {
                try {
                    //to do
                    message.success("Delete successfully!");

                } catch (error) {
                    console.error(error);
                }
            },
        });
    };

    const handleTableChange = (pagination: TablePaginationConfig) => {
        setPagination(pagination);
    };

    const operations = {
        title: "Action",
        key: "actions",
        dataIndex: "actions",
        render: (_: any, row: EventType) => (
            <Space size="middle">
                <a>View</a>
                <a>Edit</a>
                <Button
                    type="link"
                    danger
                    block
                    onClick={() => {
                        handleDeleteModal(row.id as string);
                    }}
                >
                    Delete
                </Button>
            </Space>
        ),
    };

    return (
        <Table rowKey="id" columns={[...columns, operations]} dataSource={[]} />
    );
}
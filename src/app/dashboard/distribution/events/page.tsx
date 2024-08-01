"use client";
import { Table, Space, Tag, TableProps } from "antd";
import dayjs from "dayjs";

interface DataType {
    key: string;
    title: string;
    content: String;
    expiredTime: String;
    lastDispatchTime: String;
    status: string[];
}

const columns: TableProps<DataType>["columns"] = [
    {
        title: "Title",
        dataIndex: "title",
        key: "title",
    },
    {
        title: "Content",
        dataIndex: "content",
        key: "content",
    },
    {
        title: "Expiration Time",
        dataIndex: "expiredTime",
        key: "expiredTime",
    },
    {
        title: "Status",
        key: "status",
        dataIndex: "status",
        render: (_, { status }) => (
            <>
                {status.map((tag) => {
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
    },
    {
        title: "Action",
        key: "action",
        render: (_, record) => (
            <Space size="middle">
                <a>View</a>
                <a>Edit</a>
                <a>Delete</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
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
    return (
        <Table columns={columns} dataSource={data} />
    );
}
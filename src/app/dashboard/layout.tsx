"use client";

import React, { Children } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps, TableProps } from 'antd';
import { Layout as AntdLayout, Menu, Dropdown, Space, Table, Tag } from 'antd';
import Image from 'next/image';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import dayjs from "dayjs";

const { Header, Content, Footer, Sider } = AntdLayout;

const menus = [
    {
        label: 'Information Distribution Management',
        key: '/events',
        children: [{
            label: 'Events',
            key: '/events',
        }, {
            label: 'Add Events',
            key: '/events/add',
        },]
    }
];

const items: MenuProps['items'] = [
    {
        key: '/logou',
        label: (
            <a target="_blank" rel="" href="">
                Log out
            </a>
        ),
    },
];

interface DataType {
    key: string;
    title: string;
    content: String;
    expiredTime: String;
    lastDispatchTime: String;
    status: string[];
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Content',
        dataIndex: 'content',
        key: 'content',
    },
    {
        title: 'Expired Time',
        dataIndex: 'expiredTime',
        key: 'expiredTime',
    },
    {
        title: 'Status',
        key: 'status',
        dataIndex: 'status',
        render: (_, { status }) => (
            <>
                {status.map((tag) => {
                    let tagLowerCase = tag.toLowerCase();
                    let color = tagLowerCase.includes('in progress') ? 'green' : tagLowerCase.includes('done') ? 'gray' : 'red';
                    if (tag === 'loser') {
                        color = 'volcano';
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
        title: 'Last Dispatch Time',
        dataIndex: 'lastDispatchTime',
        key: 'lastDispatchTime',
    },
    {
        title: 'Action',
        key: 'action',
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
        key: '1',
        title: 'Play badminton',
        content: 'Address: The University of Waikato',
        expiredTime: dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        lastDispatchTime: dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        status: ['In progress'],
    },
    {
        key: '2',
        title: 'Car for sale',
        content: 'Good Price',
        expiredTime: dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        lastDispatchTime: dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        status: ['Done'],
    },
    {
        key: '2',
        title: 'XXXX',
        content: 'YYYYYYYY',
        expiredTime: dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        lastDispatchTime: dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        status: ['Disapproval'],
    },
];

export default function Layout({ children }: {
    children: React.ReactNode;
}) {
    const router = useRouter;
    // const handleMenuClick = ({ key }) => {
    //     router.apply(key);
    // };

    return (
        <AntdLayout>
            <Header className={styles.header} style={{
                display: 'inline',
                // justifyContent: 'space-between',
                // alignItems: 'center',
                backgroundColor: 'white'
            }}>
                <div className={styles.logo}></div>
                <Dropdown menu={{ items }} overlayClassName={styles.dropOverlay} className={styles.user}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            Admin
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </Header>
            <AntdLayout>
                <Sider width={200}>
                    <Menu
                        mode='inline'
                        defaultSelectedKeys={['/events']}
                        defaultOpenKeys={['/events']}
                        style={{ height: '100%', borderRight: 0 }}
                        items={menus}
                    // onClick={handleMenuClick}
                    />
                </Sider>
                <AntdLayout style={{ /* padding: '0 24px 24px' */ }}>

                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        <Table columns={columns} dataSource={data} />
                    </Content>
                </AntdLayout>
            </AntdLayout>
        </AntdLayout>
    );
}
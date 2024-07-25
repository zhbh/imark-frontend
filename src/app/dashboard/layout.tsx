"use client";

import React, { Children } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps, TableProps } from 'antd';
import { Layout as AntdLayout, Menu, Dropdown, Space, Table, Tag } from 'antd';
import Image from 'next/image';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

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
    name: string;
    age: number;
    address: string;
    tags: string[];
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: 'Title',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Content',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Category',
        key: 'tags',
        dataIndex: 'tags',
        render: (_, { tags }) => (
            <>
                {tags.map((tag) => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
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
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Invite {record.name}</a>
                <a>Delete</a>
            </Space>
        ),
    },
];

const data: DataType[] = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
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
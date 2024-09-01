"use client";

import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout as AntdLayout, Menu, Dropdown, Space, message } from "antd";
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { useCurrentUser } from "@/utils/user_info";
import Link from "next/link";
import { setLogout } from "@/api";

const { Header, Content, Footer, Sider } = AntdLayout;

const menus = [
    {
        label: "Information Distribution Management",
        icon: <HomeOutlined />,
        key: "events",
        children: [{
            label: "Events",
            key: "/dashboard/distribution",
        }, {
            label: "Add Event",
            key: "/dashboard/distribution/add",
        },]
    },
    {
        label: "User Management",
        icon: <UserOutlined />,
        key: "user",
        children: [{
            label: "Users",
            key: "/dashboard/user",
        }, {
            label: "Add User",
            key: "/dashboard/user/add",
        },]
    }
];


export default function Layout({ children }: {
    children: React.ReactNode;
}) {
    const user = useCurrentUser();
    const [collapsed, setCollapsed] = useState(false);
    const [current, setCurrent] = useState('events');

    const router = useRouter();

    const items: MenuProps["items"] = [
        {
            key: "EditUser",
            label: (
                <Link href={`/dashboard/user/edit/${user?._id}`}>
                    User Edit
                </Link>
            ),
        },
        {
            key: "logout",
            label: (
                <span
                    onClick={async () => {
                        await setLogout();
                        localStorage.removeItem("user");
                        message.success("Login out successfully!");
                        router.push("/login");
                    }}
                >
                    Log out
                </span>
            ),
        },
    ];

    const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
        setCurrent(key);
        router.push(key);
    };

    return (
        <AntdLayout>
            <Header className={styles.header} style={{
                display: "inline",
                backgroundColor: "white"
            }}>
                <div className={styles.logo}></div>
                <Dropdown menu={{ items }} overlayClassName={styles.dropOverlay} className={styles.user}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            {user?.nickName}
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </Header>
            <AntdLayout className={styles.innerSection}>
                <Sider theme="light" width={250} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={["/dashboard/distribution"]}
                        defaultOpenKeys={["events"]}
                        items={menus}
                        selectedKeys={[current]}
                        onClick={handleMenuClick}
                    />
                </Sider>
                <AntdLayout>
                    <Content className={styles.content}>
                        {children}
                    </Content>
                    <Footer className={styles.footer} style={{ padding: "10px 20px", marginTop: "10px", borderTop: "1px solid #f0f0f0" }}>
                        <div className={styles.menu}>
                            <p className={styles.title}>Feedback</p>
                            <a href="https://github.com/zhbh/imark-frontend/issues" target="_blank" title="GitHub websit">
                                <img src="./images/github.svg" />GitHub
                            </a>
                        </div>
                    </Footer>
                </AntdLayout>
            </AntdLayout>
        </AntdLayout>
    );
}
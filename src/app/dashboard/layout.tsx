"use client";

import React, { useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout as AntdLayout, Menu, Dropdown, Space } from "antd";
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { HomeOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = AntdLayout;

const menus = [
    {
        label: "Information Distribution Management",
        icon: <HomeOutlined />,
        key: "events",
        children: [{
            label: "Events",
            key: "/dashboard/distribution/events",
        }, {
            label: "Add Event",
            key: "/dashboard/distribution/addEvent",
        },]
    }
];

const items: MenuProps["items"] = [
    {
        key: "/logou",
        label: (
            <a target="_blank" rel="" href="">
                Log out
            </a>
        ),
    },
];


export default function Layout({ children }: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);

    const router = useRouter();
    const handleMenuClick: MenuProps["onClick"] = ({ key }) => router.push(key);

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
                            Admin
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            </Header>
            <AntdLayout className={styles.innerSection}>
                <Sider theme="light" width={250} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
                    <Menu 
                        mode="inline"
                        defaultSelectedKeys={["/dashboard/distribution/events"]}
                        defaultOpenKeys={["events"]}
                        items={menus}
                        onClick={handleMenuClick}
                    />
                </Sider>
                <AntdLayout className={styles.contentSection}>

                    <Content className={styles.content}>
                        {children}
                    </Content>
                    <Footer className={styles.footer} style={{ padding: "10px 20px", marginTop: "10px", borderTop: "1px solid #f0f0f0" }}>
                        <div className={styles.menu}>
                            <p className={styles.title}>Feedback</p>
                            <a href="https://github.com/zhbh/imark-frontend/issues" target="_blank" title="GitHub websit">
                                <Image src="images/github.svg" width={22} height={22} alt={"GitHub"}></Image>
                                <p>GitHub</p>
                            </a>
                        </div>
                    </Footer>
                </AntdLayout>
            </AntdLayout>
        </AntdLayout>
    );
}
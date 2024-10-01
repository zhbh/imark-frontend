"use client";

import React, { useMemo, useState } from "react";
import type { MenuProps } from "antd";
import { Layout as AntdLayout, Menu } from "antd";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { HomeOutlined, UserOutlined, ClusterOutlined, GithubOutlined, MailOutlined, HeartOutlined, LogoutOutlined, ProfileOutlined } from '@ant-design/icons';
import { useCurrentUser } from "@/utils/user_info";
import Link from "next/link";
import { setLogout } from "@/api";
import { USER_ROLE } from "@/constants";

const { Header, Content, Sider } = AntdLayout;

const LEFT_SIDE_MENUS = [
    {
        label: "Event Management",
        icon: <HomeOutlined />,
        key: "events",
        role: USER_ROLE.USER,
        children: [
            {
                label: "Events",
                key: "/dashboard/distribution",
                role: USER_ROLE.USER,
            },
            {
                label: "Add Event",
                key: "/dashboard/distribution/add",
                role: USER_ROLE.USER,
            },
        ]
    },
    {
        label: "User Management",
        icon: <UserOutlined />,
        key: "user",
        role: USER_ROLE.ADMIN,
        children: [
            {
                label: "Users",
                key: "/dashboard/user",
                role: USER_ROLE.ADMIN,
            },
            {
                label: "Add User",
                key: "/dashboard/user/add",
                role: USER_ROLE.ADMIN,
            },
        ]
    },
    {
        label: "Category Management",
        icon: <ClusterOutlined />,
        key: "/dashboard/category",
        role: USER_ROLE.ADMIN,
    },
    {
        label: "Favorite Management",
        icon: <HeartOutlined />,
        key: "/dashboard/favorite",
        role: USER_ROLE.USER,
    }
];


export default function Layout({ children }: {
    children: React.ReactNode;
}) {
    const user = useCurrentUser();

    const [collapsed, setCollapsed] = useState(true);
    const [current, setCurrent] = useState('events');

    const router = useRouter();

    const HEADER_MENUS: MenuProps['items'] = [
        {
            key: 'home',
            icon: <HomeOutlined />,
            label: (
                <a href="/">
                    Home
                </a>
            ),
        },
        {
            key: 'github',
            icon: <GithubOutlined />,
            label: (
                <a href="https://github.com/zhbh/imark-frontend" target="_blank" rel="noopener noreferrer">
                    Repository
                </a>
            ),
        },
        {
            key: 'feedback',
            icon: <MailOutlined />,
            label: (
                <a href="https://github.com/zhbh/imark-frontend/issues" target="_blank" rel="noopener noreferrer">
                    Feedback
                </a>
            ),
        },
        {
            label: `${user?.name}`,
            key: 'userMenus',
            icon: <UserOutlined />,
            children: [
                {
                    label: (
                        <Link href={`/dashboard/user/edit/${user?._id}`}>
                            Profile
                        </Link>
                    ),
                    key: 'profile',
                    icon: <ProfileOutlined />,
                },
                {
                    label: 'Log out',
                    key: 'logout',
                    icon: <LogoutOutlined />,
                    onClick: async () => {
                        await setLogout();
                        localStorage.removeItem("user");
                        router.push("/");
                    }
                },
            ],
        },

    ];

    const handleLeftSideMenuClick: MenuProps["onClick"] = ({ key }) => {
        setCurrent(key);
        router.push(key);
    };

    const menusItems = useMemo(() => {
        if (user?.role === USER_ROLE.USER) {
            return LEFT_SIDE_MENUS.filter((item) => {
                if (item.children) {
                    item.children = item.children.filter(
                        (k) => k.role === USER_ROLE.USER
                    );
                }
                return item.role === USER_ROLE.USER;
            });
        } else {
            return LEFT_SIDE_MENUS;
        }
    }, [user]);

    return (
        <AntdLayout style={{ minWidth: "900px" }}>
            <Header className={styles.header} style={{
                display: "inline",
                backgroundColor: "white"
            }}>
                <div className={styles.logo}></div>

                <Menu
                    mode="horizontal"
                    inlineCollapsed={false}
                    items={HEADER_MENUS}
                    style={{ display: "flex", justifyContent: "end", flex: 1, minWidth: 0, backgroundColor: "white", }}
                />

            </Header>
            <AntdLayout className={styles.innerSection}>

                <Sider theme="light" width={250} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} >
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={["/dashboard/distribution"]}
                        // defaultOpenKeys={["events"]}
                        items={menusItems}
                        selectedKeys={[current]}
                        onClick={handleLeftSideMenuClick}
                    />
                </Sider>

                <AntdLayout>

                    <Content className={styles.content}>
                        {children}
                    </Content>

                </AntdLayout>
            </AntdLayout>
        </AntdLayout>
    );
}
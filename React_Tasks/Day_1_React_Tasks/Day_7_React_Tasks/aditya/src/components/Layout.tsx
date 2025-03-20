import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, Button } from "antd";
import {UserOutlined,LogoutOutlined,PlusOutlined, MenuFoldOutlined,MenuUnfoldOutlined,HomeOutlined} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { RootState } from "../store/store";

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [collapsed, setCollapsed] = useState(false); // Sidebar state

  // ✅ Toggle Sidebar Collapse
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    dispatch(logout(true));
    navigate("/login");
  };

  // ✅ Updated user menu using `items`
  const userMenuItems = [
    {
      key: "profile",
      label: "Edit Profile",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  // ✅ Updated sidebar menu using `items`
  const sidebarMenuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Job Listings",
      onClick: () => navigate("/jobs"),
    },
    {
      key: "2",
      icon: <PlusOutlined />,
      label: "Add Job",
      onClick: () => navigate("/add-job"),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar with Hamburger */}
      <Sider collapsible collapsed={collapsed} trigger={null}>
        <div
          className="logo"
          style={{ color: "white", textAlign: "center", padding: "16px", fontSize: "18px" }}
        >
          {collapsed ? "JP" : "Job Portal"}
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} items={sidebarMenuItems} />
      </Sider>

      {/* Main Content Area */}
      <Layout>
        {/* Navbar */}
        <Header
          style={{
            background: "#fff",
            padding: "0 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0
         
          
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
            style={{ fontSize: "18px" }}
          />
          <h2 style={{ margin: 0 }}>Satva Job Portal</h2>
          {user && (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar style={{ backgroundColor: "#87d068", cursor: "pointer" }} icon={<UserOutlined />} />
            </Dropdown>
          )}
        </Header>

        {/* Page Content */}
        <Content
          style={{ margin: "16px", padding: "24px", background: "#fff", borderRadius: "8px" }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;

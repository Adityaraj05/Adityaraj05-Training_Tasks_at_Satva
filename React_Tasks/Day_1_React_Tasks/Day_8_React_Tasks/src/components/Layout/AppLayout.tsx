import React, { useState } from 'react';
import { Layout, Menu, Button, theme, Dropdown } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  TeamOutlined,
  ProjectOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  DashboardOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../utils/auth';

const { Header, Sider, Content } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, permissions, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Menu items based on permissions
  const getMenuItems = () => {
    const items = [
      {
        key: '/dashboard',
        icon: <DashboardOutlined />,
        label: 'Dashboard',
        onClick: () => navigate('/dashboard'),
      }
    ];

    // Users module
    if (hasPermission(permissions, 'users', 'view')) {
      items.push({
        key: '/users',
        icon: <UserOutlined />,
        label: 'Users',
        onClick: () => navigate('/users'),
      });
    }

    // Employees module
    if (hasPermission(permissions, 'employees', 'view')) {
      items.push({
        key: '/employees',
        icon: <TeamOutlined />,
        label: 'Employees',
        onClick: () => navigate('/employees'),
      });
    }

    // Projects module
    if (hasPermission(permissions, 'projects', 'view')) {
      items.push({
        key: '/projects',
        icon: <ProjectOutlined />,
        label: 'Projects',
        onClick: () => navigate('/projects'),
      });
    }

    // Roles module
    if (hasPermission(permissions, 'roles', 'view')) {
      items.push({
        key: '/roles',
        icon: <SettingOutlined />,
        label: 'Roles & Permissions',
        onClick: () => navigate('/roles'),
      });
    }

    return items;
  };

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
      >
        <div style={{ textAlign: 'center', color: 'white', margin: '16px 0', fontSize: '18px', fontWeight: 'bold' }}>
          <HomeOutlined style={{ marginRight: 8 }} />
          {!collapsed && 'Satva Solutions'}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={getMenuItems()}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 16 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px', width: 64, height: 64 }}
            />
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text">
                <UserOutlined /> {user?.name || 'User'} ({user?.role})
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
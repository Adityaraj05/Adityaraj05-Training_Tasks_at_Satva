import React, { useState, useEffect } from 'react';
import {
  UsergroupAddOutlined,
  DashboardOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  AuditOutlined,
  ContactsOutlined,
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShoppingOutlined,
  LogoutOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Typography, Avatar, Drawer, Space, Badge, Segmented, Dropdown, Tooltip, Divider } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// Define custom theme colors
const customTheme = {
  primaryColor: '#4F46E5', // Indigo
  secondaryColor: '#6366F1', // Lighter indigo
  accentColor: '#818CF8', // Even lighter indigo
  successColor: '#34D399', // Emerald
  warningColor: '#FBBF24', // Amber
  dangerColor: '#EF4444', // Red
  backgroundColor: '#F9FAFB', // Light gray background
  textColor: '#111827', // Dark text
  lightTextColor: '#6B7280', // Gray text
  siderBg: '#1E293B', // Dark slate blue
  siderText: '#F3F4F6', // Light text for sider
  headerBg: '#FFFFFF', // White header
  cardBg: '#FFFFFF', // White card background
};

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [allRoles, setAllRoles] = useState<string[]>([]);
  const [name, setName] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Set mobile view on initial render and window resize
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedRoles = localStorage.getItem('roles');
    const storedName = localStorage.getItem('name');
    const storedActiveRole = localStorage.getItem('activeRole');
    
    if (storedRoles) {
      const parsedRoles = JSON.parse(storedRoles);
      setAllRoles(parsedRoles);
      
      // Set activeRole to either the previously selected role (if valid)
      // or default to the first role in the array
      if (storedActiveRole && parsedRoles.includes(storedActiveRole)) {
        setActiveRole(storedActiveRole);
      } else {
        // Default to first role
        const defaultRole = parsedRoles[0];
        setActiveRole(defaultRole);
        localStorage.setItem('activeRole', defaultRole);
      }
    }
    
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      path: 'dashboard',
      roles: ['Admin', 'Customer', 'Supplier'],
    },
    {
      key: '2',
      icon: <HomeOutlined />,
      label: 'Home',
      path: 'home',
      roles: ['Customer', 'Supplier'],
    },
    {
      key: '3',
      icon: <ShoppingCartOutlined />,
      label: 'Cart',
      path: 'cart',
      roles: ['Customer'],
    },
    {
      key: '4',
      icon: <ShoppingOutlined />,
      label: 'Orders',
      path: 'orders',
      roles: ['Supplier'],
    },
    {
      key: '5',
      icon: <UsergroupAddOutlined />,
      label: 'Supplier List',
      path: 'suppliers',
      roles: ['Admin'],
    },
    {
      key: '6',
      icon: <AppstoreOutlined />,
      label: 'Products List',
      path: 'product-list',
      roles: ['Admin'],
    },
    {
      key: '7',
      icon: <AuditOutlined />,
      label: 'Order List',
      path: 'order-list',
      roles: ['Admin'],
    },
    {
      key: '8',
      icon: <ContactsOutlined />,
      label: 'Customer List',
      path: 'customer-list',
      roles: ['Admin'],
    },
    {
      key: '9',
      icon: <ContactsOutlined />,
      label: 'Invoices',
      path: 'invoices',
      roles: ['Supplier'],
    },
  ];

  // Filter menu items based on active role
  const filteredMenuItems = menuItems.filter(item =>
    activeRole ? item.roles.includes(activeRole) : false
  );

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('roles');
    localStorage.removeItem('name');
    localStorage.removeItem('id');
    localStorage.removeItem('activeRole');
    window.location.href = '/login';
  };

  const getActiveKey = () => {
    const currentPath = location.pathname.split('/').pop() || '';
    const activeItem = filteredMenuItems.find(item => item.path === currentPath);
    return activeItem ? activeItem.key : '1';
  };

  const handleRoleChange = (value: string | number) => {
    const newRole = value as string;
    setActiveRole(newRole);
    localStorage.setItem('activeRole', newRole);
    
    // Navigate to a safe path for the new role (dashboard is available to all roles)
    navigate('dashboard');
    
    // Close mobile drawer if open
    if (mobileView) {
      setMobileDrawerOpen(false);
    }
  };

  // User dropdown menu items
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'My Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  const MenuComponent = () => (
    <>
      <div
        style={{
          padding: collapsed ? '16px 0' : '24px 16px',
          textAlign: 'center',
          borderBottom: `1px solid rgba(255, 255, 255, 0.1)`,
          marginBottom: 16,
          background: 'linear-gradient(180deg, rgba(79,70,229,0.2) 0%, rgba(30,41,59,0) 100%)',
        }}
      >
        {!collapsed && (
          <Title level={3} style={{ color: customTheme.siderText, margin: 0, marginBottom: 16, fontWeight: 700 }}>
            <span style={{ color: customTheme.primaryColor }}>Shop</span>
            <span style={{ color: '#fff' }}>Nex</span>
          </Title>
        )}
        {collapsed ? (
          <Avatar
            style={{ backgroundColor: customTheme.primaryColor, boxShadow: '0 4px 6px rgba(79,70,229,0.25)' }}
            size={40}
          >
            {activeRole?.charAt(0) || 'U'}
          </Avatar>
        ) : (
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Avatar
              style={{ 
                backgroundColor: customTheme.primaryColor, 
                boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
                border: '2px solid rgba(255,255,255,0.2)'
              }}
              size={70}
            >
              {name
                ? `${name.split(' ')[0]?.charAt(0) || ''}${name.split(' ')[1]?.charAt(0) || ''}`.toUpperCase() || 'U'
                : 'U'}
            </Avatar>
            <div>
              <Text style={{ color: '#fff', display: 'block', fontSize: '16px', fontWeight: 600 }}>
                {name || 'User'}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.75)', display: 'block', fontSize: '14px' }}>
                {activeRole || ''}
              </Text>
            </div>
          </Space>
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getActiveKey()]}
        items={filteredMenuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
          onClick: () => {
            navigate(item.path);
            if (mobileView) {
              setMobileDrawerOpen(false);
            }
          },
        }))}
        style={{ 
          borderRight: 0, 
          background: 'transparent',
          padding: '0 8px'
        }}
      />
      {!collapsed && !mobileView && (
        <div style={{ 
          padding: '16px', 
          position: 'absolute', 
          bottom: 0, 
          width: '100%',
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.1)'
        }}>
          {/* <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{
              width: '100%',
              borderRadius: '8px',
              backgroundColor: 'rgba(239,68,68,0.8)',
              borderColor: 'transparent'
            }}
          >
            Logout
          </Button> */}
        </div>
      )}
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh', background: customTheme.backgroundColor }}>
      {!mobileView && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={250}
          style={{
            background: customTheme.siderBg,
            boxShadow: '2px 0 10px rgba(0,0,0,0.15)',
            zIndex: 10,
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <MenuComponent />
        </Sider>
      )}

      <Layout style={{ marginLeft: mobileView ? 0 : (collapsed ? 80 : 250), transition: 'all 0.2s' }}>
        <Header
          style={{
            padding: '0 20px',
            background: customTheme.headerBg,
            boxShadow: '0 1px 10px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 64,
            position: 'sticky',
            top: 0,
            zIndex: 9,
            borderRadius: mobileView ? 0 : '0 0 12px 12px',
            marginBottom: '4px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button
              type="text"
              icon={mobileView ? <MenuUnfoldOutlined /> : (collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />)}
              onClick={() => mobileView ? setMobileDrawerOpen(true) : setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 42,
                height: 42,
                borderRadius: '8px',
                color: customTheme.textColor
              }}
            />

            <Title level={4} style={{ margin: 0 }}>
              {filteredMenuItems.find(item => item.key === getActiveKey())?.label || 'Dashboard'}
            </Title>
          </div>

          <Space size={16}>
            {allRoles.length > 1 && (
              <Segmented
                options={allRoles}
                value={activeRole || allRoles[0]} 
                onChange={handleRoleChange}
                style={{
                  backgroundColor: 'rgba(79,70,229,0.1)',
                  padding: '2px',
                  borderRadius: '8px'
                }}
              />
            )}
            
            <Tooltip title="Notifications">
              <Badge count={3} size="small" offset={[-2, 2]}>
                <Button 
                  icon={<BellOutlined />} 
                  shape="circle" 
                  type="text"
                  style={{
                    fontSize: '16px',
                    width: 40,
                    height: 40
                  }}
                />
              </Badge>
            </Tooltip>
            
            {mobileView ? (
              <>
                <Button
                  type="text"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  danger
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%'
                  }}
                />
              </>
            ) : (
              <Dropdown 
                menu={{ items: userMenuItems }} 
                placement="bottomRight" 
                arrow
                trigger={['click']}
              >
                <Badge dot offset={[-4, 4]}>
                  <Avatar 
                    style={{ 
                      backgroundColor: customTheme.primaryColor,
                      cursor: 'pointer',
                      border: '2px solid rgba(79,70,229,0.2)'
                    }}
                    size={40}
                  >
                    {name
                      ? `${name.split(' ')[0]?.charAt(0) || ''}${name.split(' ')[1]?.charAt(0) || ''}`.toUpperCase() || 'U'
                      : 'U'}
                  </Avatar>
                </Badge>
              </Dropdown>
            )}
          </Space>
        </Header>

        <Content
          style={{
            margin: '16px',
            padding: 0,
            minHeight: 280,
            maxWidth: '1600px',
            width: '100%',
            alignSelf: 'center'
          }}
        >
          <div style={{
            background: customTheme.cardBg,
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)',
            minHeight: '280px',
            height: '100%'
          }}>
            <Outlet />
          </div>
        </Content>
      </Layout>

      <Drawer
        placement="left"
        closable={false}
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileView && mobileDrawerOpen}
        width={280}
        bodyStyle={{ padding: 0, background: customTheme.siderBg, height: '100%' }}
      >
        <MenuComponent />
      </Drawer>
    </Layout>
  );
};

export default App;
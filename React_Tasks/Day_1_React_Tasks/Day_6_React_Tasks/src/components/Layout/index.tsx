
import React, {  useState } from 'react';
import {
  LoginOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProductOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button, Layout, Menu, message, theme, Modal } from 'antd';
import { Outlet } from 'react-router-dom';
// import { useCartContext } from '../../Context/CartContext/CartWrapper';
// import { useProductContext } from '../../Context/ProductContext/ProductWrapper';

const { Header, Sider, Content } = Layout;

const App: React.FC = () => {
  // const { cart } = useCartContext();
  // const [cartLength, setCartLength] = useState(cart.products.length);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  // const { products } = useProductContext();

  // useEffect(() => {
  //   setCartLength(cart.products.length);
  // }, [products]);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleLogout = () => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Are you sure you want to logout?',
      onOk() {
        localStorage.removeItem('token');
        navigate('/');
        message.success('Logout successfully');
      }
    })
  }
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <ProductOutlined />,
              label: 'Products List',
              onClick: () => {
                navigate("/dashboard")
              }
            },

            {
              key: '2',
              icon: <ProductOutlined />,
              label: 'All Products',
              onClick: () => {
                navigate("/dashboard/products")
              }
            },

            {
              key: '4',
              icon: <LoginOutlined />,
              label: 'Logout',
              onClick: () => {
                handleLogout();
              }
            }
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: "0 2px", background: "slate", display: "flex", justifyContent: "space-between" }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              color: "white",
              height: 64,
            }}
          />
          <Button
            type="text"
            icon={<ShoppingOutlined />}
            onClick={() => navigate("/dashboard/cart")}
            style={{
              fontSize: '20px',
              width: 64,
              color: "white",
              height: 64,
            }}
          />
          {/* <span
            style={{
              position: "absolute",
              top: 10,
              right: 8,
              backgroundColor: "lightgreen",
              color: "grey",
              width: 20,
              height: 20,
              borderRadius: "50%",
              fontSize: "12px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: "14px",
            }}
          >
            {cartLength}
          </span> */}

        </Header>
        <Content
          style={{
            margin: '10px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
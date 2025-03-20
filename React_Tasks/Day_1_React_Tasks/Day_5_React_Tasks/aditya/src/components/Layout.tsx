import { Outlet, Link, useNavigate } from "react-router-dom";
import { Layout as AntLayout, Menu, Button, Modal } from "antd";
import { MenuOutlined, ShopOutlined, UserOutlined, LogoutOutlined, PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { getUserFromToken } from "../utils/auth"; 
import DataDisplay from "./DataDisplay";

const { Header, Sider, Content } = AntLayout;

export const Layout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showData, setShowData] = useState(false); 

  useEffect(() => {
    const checkAuth = async () => {
      const user = await getUserFromToken();
      if (!user) {
        navigate("/login", { replace: true }); 
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    Modal.confirm({
      title: "Are you sure you want to logout?",
      content: "You will be logged out and redirected to the login page.",
      onOk: () => {
        localStorage.removeItem("token"); 
        navigate("/login", { replace: true });
      },
      onCancel: () => {
      
        console.log("Logout cancelled");
      },
      okButtonProps: {
        danger: true, 
      },
     
    });
  };

  if (!isAuthenticated) return null; 

  return (
    <AntLayout style={{ minHeight: "100vh" }}>


      
<Header
          style={{ position: "fixed", top: 0, left: collapsed ? 80 : 200, right: 0, zIndex: 1000, display: "flex", justifyContent: "space-between",
 alignItems: "center", background: "#001529", padding: "0 20px", color: "#fff", height: "64px", transition: "left 0.2s ease-in-out",
          }}
        >
          <Button type="text" icon={<MenuOutlined style={{ color: "#fff" }} />} onClick={() => setCollapsed(!collapsed)} />
        </Header>
      {/* Sidebar */}
      <Sider collapsible collapsed={collapsed} trigger={null} style={{  background: "#001529", height: "100vh", position: "fixed",
          left: 0,
          top: 0,
        }}
      >
        <div style={{ padding: "16px", textAlign: "center", color: "#fff", fontSize: "16px" }}>
          {collapsed ? "☰" : "Satva Technolab"}
        </div>
        <Menu theme="dark" mode="inline" style={{ borderRight: 0 }}>
          <Menu.Item key="products" icon={<ShopOutlined />} onClick={() => setShowData(false)}>
            <Link to="/dashboard/products">Products</Link>
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />} onClick={() => setShowData(false)}>
            <Link to="/dashboard/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="data" icon={<PlusOutlined />} onClick={() => setShowData(true)}>
            Data
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

   
      <AntLayout style={{ marginLeft: collapsed ? 80 : 200, transition: "margin 0.2s ease-in-out" }}>
        


        {/* Main Content */}
        <Content
          style={{
            marginTop: "64px", 
            padding: "0px",
            transition: "margin-left 0.2s ease-in-out",
          }}
        >
          {showData ? <DataDisplay /> : <Outlet />}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

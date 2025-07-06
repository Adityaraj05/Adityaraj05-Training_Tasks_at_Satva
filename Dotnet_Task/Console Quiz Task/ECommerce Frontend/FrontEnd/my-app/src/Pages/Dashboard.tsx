import React, { useState, useEffect } from 'react';
import { 
  Result, 
  Button, 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Typography, 
  Spin, 
  Empty,
  Table,
  Tag,
  Divider
} from 'antd';
import { 
  ShoppingOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  WarningOutlined, 
  InboxOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [inventoryStats, setInventoryStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    lowStock: 0,
    outOfStock: 0,
    discounted: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const accessToken = localStorage.getItem('accessToken');
  const activeRole = localStorage.getItem('activeRole') || '';

  // Initialize with loading state and role detection
  useEffect(() => {
    // Add a small delay to ensure localStorage values are correctly populated
    const timer = setTimeout(() => {
      const currentRole = localStorage.getItem('activeRole');
      console.log("Initial role detected:", currentRole);
      fetchProducts();
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the latest activeRole value directly
      const currentRole = localStorage.getItem('activeRole') || '';
      
      const endpoint = currentRole.toLowerCase() === 'supplier'
        ? `${apiUrl}/api/product/getAllForSupplier`
        : `${apiUrl}/api/product/getAllProducts`;

      console.log("Current role:", currentRole);
      console.log("Using endpoint:", endpoint);
      console.log("Access token exists:", !!accessToken);

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Handle case where API returns null or undefined
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }

      // Filter products if role is customer (only show active)
      let allProducts = response.data;
      if (activeRole.toLowerCase() === 'customer') {
        allProducts = allProducts.filter(product => product.isActive);
      }
      
      setProducts(allProducts);
      
      // Calculate statistics from the actual data
      const stats = {
        total: allProducts.length,
        active: allProducts.filter(p => p.isActive).length,
        inactive: allProducts.filter(p => !p.isActive).length,
        lowStock: allProducts.filter(p => p.stockQuantity > 0 && p.stockQuantity < 10).length,
        outOfStock: allProducts.filter(p => p.stockQuantity <= 0).length,
        discounted: allProducts.filter(p => p.discountPrice > 0).length
      };
      
      setInventoryStats(stats);
      
      // Get the 5 most recently added/updated products
      const sortedProducts = [...allProducts].sort((a, b) => b.id - a.id);
      setRecentProducts(sortedProducts.slice(0, 5));
      setRecentLoading(false);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load dashboard data");
      setLoading(false);
      setRecentLoading(false);
    }
  };

  const recentProductColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <div>
            <Tag color="blue">{record.category?.name || 'N/A'}</Tag>
            {record.isActive ? 
              <Tag color="green">Active</Tag> : 
              <Tag color="red">Inactive</Tag>
            }
          </div>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price, record) => (
        <>
          {record.discountPrice > 0 ? (
            <>
              <Text delete style={{ color: '#999' }}>₹{price.toFixed(2)}</Text>
              <br />
              <Text type="danger" strong>₹{record.discountPrice.toFixed(2)}</Text>
            </>
          ) : (
            <Text strong>₹{price.toFixed(2)}</Text>
          )}
        </>
      ),
    },
    {
      title: 'Stock',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      render: (quantity) => {
        if (quantity <= 0) {
          return <Tag color="red">Out of Stock</Tag>;
        } else if (quantity < 10) {
          return <Tag color="orange">Low Stock ({quantity})</Tag>;
        } else {
          return <Tag color="green">{quantity} in Stock</Tag>;
        }
      },
    },
  ];

  // Function to handle retry button click
  const handleRetry = () => {
    fetchProducts();
  };

  if (error) {
    return (
      <Result
        status="error"
        title="Failed to load dashboard"
        subTitle="There was an error loading your dashboard data. Please try again."
        extra={<Button type="primary" onClick={handleRetry}>Retry</Button>}
      />
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4}>Dashboard Overview</Title>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchProducts}
          loading={loading}
        >
          Refresh
        </Button>
      </div>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <Spin size="large" tip="Loading dashboard data..." />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card 
                bordered={false} 
                style={{ 
                  height: 180, 
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)'
                }}
              >
                <Statistic 
                  title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>Total Products</span>}
                  value={inventoryStats.total} 
                  valueStyle={{ color: '#ffffff', fontSize: 36, fontWeight: 700 }}
                  prefix={<ShoppingOutlined style={{ marginRight: 8 }} />} 
                />
                <div style={{ 
                  marginTop: 12, 
                  padding: '12px 0', 
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.85)'
                }}>
                  All products in inventory
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Card 
                bordered={false} 
                style={{ 
                  height: 180, 
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)'
                }}
              >
                <Statistic 
                  title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>Active Products</span>}
                  value={inventoryStats.active} 
                  valueStyle={{ color: '#ffffff', fontSize: 36, fontWeight: 700 }}
                  prefix={<CheckCircleOutlined style={{ marginRight: 8 }} />} 
                />
                <div style={{ 
                  marginTop: 12, 
                  padding: '12px 0', 
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.85)'
                }}>
                  Products available for sale
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Card 
                bordered={false} 
                style={{ 
                  height: 180, 
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  background: 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)'
                }}
              >
                <Statistic 
                  title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>Inactive Products</span>}
                  value={inventoryStats.inactive} 
                  valueStyle={{ color: '#ffffff', fontSize: 36, fontWeight: 700 }}
                  prefix={<CloseCircleOutlined style={{ marginRight: 8 }} />} 
                />
                <div style={{ 
                  marginTop: 12, 
                  padding: '12px 0', 
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.85)'
                }}>
                  Products not for sale
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Card 
                bordered={false} 
                style={{ 
                  height: 180, 
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)'
                }}
              >
                <Statistic 
                  title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>Low Stock</span>}
                  value={inventoryStats.lowStock} 
                  valueStyle={{ color: '#ffffff', fontSize: 36, fontWeight: 700 }}
                  prefix={<WarningOutlined style={{ marginRight: 8 }} />} 
                />
                <div style={{ 
                  marginTop: 12, 
                  padding: '12px 0', 
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.85)'
                }}>
                  Products running low
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Card 
                bordered={false} 
                style={{ 
                  height: 180, 
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  background: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)'
                }}
              >
                <Statistic 
                  title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>Out of Stock</span>}
                  value={inventoryStats.outOfStock} 
                  valueStyle={{ color: '#ffffff', fontSize: 36, fontWeight: 700 }}
                  prefix={<InboxOutlined style={{ marginRight: 8 }} />} 
                />
                <div style={{ 
                  marginTop: 12, 
                  padding: '12px 0', 
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.85)'
                }}>
                  Products with zero inventory
                </div>
              </Card>
            </Col>
            
            {/* Added Discounted Products Card */}
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card 
                bordered={false} 
                style={{ 
                  height: 180, 
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  background: 'linear-gradient(135deg, #EC4899 0%, #D946EF 100%)'
                }}
              >
                <Statistic 
                  title={<span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>Discounted Products</span>}
                  value={inventoryStats.discounted} 
                  valueStyle={{ color: '#ffffff', fontSize: 36, fontWeight: 700 }}
                  prefix={<ShoppingOutlined style={{ marginRight: 8 }} />} 
                />
                <div style={{ 
                  marginTop: 12, 
                  padding: '12px 0', 
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.85)'
                }}>
                  Products on sale
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col span={24}>
              <Card 
                title="Recent Products" 
                bordered={false}
                style={{ 
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                {recentLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                    <Spin />
                  </div>
                ) : recentProducts.length > 0 ? (
                  <Table 
                    dataSource={recentProducts.map(p => ({ ...p, key: p.id }))} 
                    columns={recentProductColumns}
                    pagination={false}
                    size="small"
                  />
                ) : (
                  <Empty 
                    description="No products found" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Dashboard;
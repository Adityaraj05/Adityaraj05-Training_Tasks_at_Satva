import React, { useEffect, useState } from 'react';
import { Tabs, Table, message, Button, Modal, Space, Tag, Card, Typography, Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import dayjs from 'dayjs';

interface OrderItem {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  orderId: number;
  customerId: number;
  customerName: string;
  createdAt: string;
}

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { confirm } = Modal;

const Orders: React.FC = () => {
  const [activeKey, setActiveKey] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const accessToken = localStorage.getItem('accessToken');
  const sellerId = localStorage.getItem('id');

  useEffect(() => {
    fetchOrders(activeKey);
  }, [activeKey]);

  const fetchOrders = async (status: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/order/orderItems?status=${status}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setOrders(response.data);
    } catch (error) {
      message.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (orderItemId: number) => {
    try {
      setActionLoading(orderItemId);
      await axios.post(
        `${apiUrl}/api/order/approveOrder/${orderItemId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      message.success('Order approved successfully');
      fetchOrders(activeKey);
    } catch (error) {
      message.error('Failed to approve order');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (orderItemId: number) => {
    try {
      setActionLoading(orderItemId);
      await axios.post(
        `${apiUrl}/api/order/rejectOrder/${orderItemId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      message.success('Order rejected successfully');
      fetchOrders(activeKey);
    } catch (error) {
      message.error('Failed to reject order');
    } finally {
      setActionLoading(null);
    }
  };

  const showApproveConfirm = (orderItem: OrderItem) => {
    confirm({
      title: 'Are you sure you want to approve this order?',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      content: (
        <div>
          <p>Order Item ID: {orderItem.orderItemId}</p>
          <p>Product: {orderItem.productName}</p>
          <p>Quantity: {orderItem.quantity}</p>
          <p>Price: ₹{orderItem.price.toFixed(2)}</p>
        </div>
      ),
      okText: 'Yes, Approve',
      okType: 'primary',
      cancelText: 'Cancel',
      onOk() {
        return handleApprove(orderItem.orderItemId);
      },
    });
  };

  const showRejectConfirm = (orderItem: OrderItem) => {
    confirm({
      title: 'Are you sure you want to reject this order?',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <p>Order Item ID: {orderItem.orderItemId}</p>
          <p>Product: {orderItem.productName}</p>
          <p>Quantity: {orderItem.quantity}</p>
          <p>Price: ₹{orderItem.price.toFixed(2)}</p>
        </div>
      ),
      okText: 'Yes, Reject',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        return handleReject(orderItem.orderItemId);
      },
    });
  };


  const handleGenerateInvoice = async (orderItem: OrderItem) => {
    try {
      const orderId = orderItem.orderId;      
      const response = await axios.get(
        `${apiUrl}/api/invoice/generate/${orderId}/${sellerId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );      
      if (response.status === 200) {
        message.success("Invoice generated successfully!");
        console.log("Invoice data:", response.data);
      } else {
        message.error("Failed to generate invoice.");
      }
    } catch (error: any) {
      message.error(`Error generating invoice: ${error.message || error.toString()}`);
    }
  };

  const columns: ColumnsType<OrderItem> = [
    {
      title: 'Order Item ID',
      dataIndex: 'orderItemId',
      key: 'orderItemId',
      width: 120,
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 100,
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      ellipsis: true,
      width: 150,
      render: (text: string) => (
        <Tooltip title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (quantity: number) => (
        <Tag color="blue">{quantity}</Tag>
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price: number) => (
        <Text strong>₹{price.toFixed(2)}</Text>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
      ellipsis: true,
      width: 150,
      render: (text: string) => (
        <Tooltip title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (date: string) => (
        <Tooltip title={dayjs(date).format('DD MMM YYYY, HH:mm:ss')}>
          {dayjs(date).format('DD MMM YYYY, HH:mm')}
        </Tooltip>
      ),
    },
  ];

  if (activeKey === 'Approved') {
    columns.push({
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<FileTextOutlined />}
          onClick={() => handleGenerateInvoice(record)}
        >
        </Button>
      ),
    });
  }

  if (activeKey === 'Pending') {
    columns.push({
      title: 'Actions',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => showApproveConfirm(record)}
            loading={actionLoading === record.orderItemId}
            size="small"
          >
            Approve
          </Button>
          <Button
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => showRejectConfirm(record)}
            loading={actionLoading === record.orderItemId}
            size="small"
          >
            Reject
          </Button>
        </Space>
      ),
    });
  }

  const getTabIcon = (tabKey: string) => {
    switch (tabKey) {
      case 'Pending':
        return <InfoCircleOutlined />;
      case 'Approved':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'Rejected':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  const getOrderStatusBadge = () => {
    const count = orders.length;
    switch (activeKey) {
      case 'Pending':
        return <Tag color="processing">{count} Pending</Tag>;
      case 'Approved':
        return <Tag color="success">{count} Approved</Tag>;
      case 'Rejected':
        return <Tag color="error">{count} Rejected</Tag>;
      default:
        return null;
    }
  };

  return (
    <Card className="orders-card" bordered={false}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>Orders Management</Title>
        {getOrderStatusBadge()}
      </div>

      <Tabs
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key as any)}
        type="card"
      >
        <TabPane
          tab={
            <span>
              {getTabIcon('Pending')} Pending
            </span>
          }
          key="Pending"
        >
          <Table
            dataSource={orders.map(o => ({ ...o, key: o.orderItemId }))}
            columns={columns}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`
            }}
            scroll={{ x: 'max-content' }}
            size="middle"
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              {getTabIcon('Approved')} Approved
            </span>
          }
          key="Approved"
        >
          <Table
            dataSource={orders.map(o => ({ ...o, key: o.orderItemId }))}
            columns={columns}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`
            }}
            scroll={{ x: 'max-content' }}
            size="middle"
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              {getTabIcon('Rejected')} Rejected
            </span>
          }
          key="Rejected"
        >
          <Table
            dataSource={orders.map(o => ({ ...o, key: o.orderItemId }))}
            columns={columns}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`
            }}
            scroll={{ x: 'max-content' }}
            size="middle"
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Orders;
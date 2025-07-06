import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Tag, Typography, message, Modal, Tabs } from 'antd';
import {  ExclamationCircleOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { ColumnsType } from 'antd/es/table';
import type { TabsProps } from 'antd';

const { Title, Text } = Typography;
const { confirm } = Modal;

interface Supplier {
  id: string;
  shopName: string;
  shopDetails: string;
  city: string;
  isActive: boolean;
}

const SupplierList: React.FC = () => {
  const [activeSuppliers, setActiveSuppliers] = useState<Supplier[]>([]);
  const [pendingSuppliers, setPendingSuppliers] = useState<Supplier[]>([]);
  const [activeLoading, setActiveLoading] = useState<boolean>(true);
  const [pendingLoading, setPendingLoading] = useState<boolean>(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const accessToken = localStorage.getItem('accessToken');

  const fetchActiveSuppliers = async () => {
    try {
      setActiveLoading(true);
      const response = await axios.get(`${apiUrl}/api/user/activeSuppliers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setActiveSuppliers(response.data);
    } catch (err) {
      message.error('Failed to fetch active suppliers.');
      console.error('Error fetching active suppliers:', err);
    } finally {
      setActiveLoading(false);
    }
  };

  const fetchPendingSuppliers = async () => {
    try {
      setPendingLoading(true);
      const response = await axios.get(`${apiUrl}/api/user/pendingSuppliers`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setPendingSuppliers(response.data);
    } catch (err) {
      message.error('Failed to fetch pending suppliers.');
      console.error('Error fetching pending suppliers:', err);
    } finally {
      setPendingLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSuppliers();
    fetchPendingSuppliers();
  }, []);

  // const handleToggleStatus = async (id: string, currentStatus: boolean) => {
  //   try {
  //     await axios.post(
  //       `${apiUrl}/api/user/toggleUserActivation/${id}`,
  //       null, 
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  
  //     setActiveSuppliers(prevSuppliers =>
  //       prevSuppliers.map(supplier =>
  //         supplier.id === id ? { ...supplier, isActive: !currentStatus } : supplier
  //       )
  //     );
  
  //     message.success(`Supplier marked as ${!currentStatus ? 'active' : 'inactive'}`);
  //   } catch (err) {
  //     message.error('Failed to update supplier status.');
  //     console.error('Error updating supplier status:', err);
  //   }
  // };
  

  const handleAcceptSupplier = async (id: string) => {
    try {
      await axios.post(
        `${apiUrl}/api/user/approveSupplier/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      setPendingSuppliers(prevSuppliers => 
        prevSuppliers.filter(supplier => supplier.id !== id)
      );
      fetchActiveSuppliers();
      
      message.success('Supplier approved successfully');
    } catch (err) {
      message.error('Failed to approve supplier.');
      console.error('Error approving supplier:', err);
    }
  };

  const handleRejectSupplier = async (id: string, shopName: string) => {
    confirm({
      title: 'Are you sure you want to reject this supplier?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <Text>You are about to reject: <Text strong>{shopName}</Text></Text>
          <br />
          <Text type="warning">This action cannot be undone.</Text>
        </div>
      ),
      okText: 'Reject',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.put(
            `${apiUrl}/api/admin/suppliers/${id}/reject`,
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          
          setPendingSuppliers(prevSuppliers => 
            prevSuppliers.filter(supplier => supplier.id !== id)
          );
          
          message.success('Supplier rejected successfully');
        } catch (err) {
          message.error('Failed to reject supplier.');
          console.error('Error rejecting supplier:', err);
        }
      },
    });
  };

  const activeColumns: ColumnsType<Supplier> = [
    {
      title: 'Shop Name',
      dataIndex: 'shopName',
      key: 'shopName',
      sorter: (a, b) => a.shopName.localeCompare(b.shopName),
    },
    {
      title: 'Shop Details',
      dataIndex: 'shopDetails',
      key: 'shopDetails',
      ellipsis: true,
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      sorter: (a, b) => a.city.localeCompare(b.city),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
    }
  ];

  const pendingColumns: ColumnsType<Supplier> = [
    {
      title: 'Shop Name',
      dataIndex: 'shopName',
      key: 'shopName',
      sorter: (a, b) => a.shopName.localeCompare(b.shopName),
    },
    {
      title: 'Shop Details',
      dataIndex: 'shopDetails',
      key: 'shopDetails',
      ellipsis: true,
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      sorter: (a, b) => a.city.localeCompare(b.city),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<CheckOutlined />}
            onClick={() => handleAcceptSupplier(record.id)}
          >
            Accept
          </Button>
          <Button 
            danger 
            icon={<CloseOutlined />}
            onClick={() => handleRejectSupplier(record.id, record.shopName)}
          >
            Reject
          </Button>
        </Space>
      ),
    },
  ];

  // Tab items
  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Active Suppliers',
      children: (
        <Table
          columns={activeColumns}
          dataSource={activeSuppliers.map(supplier => ({ ...supplier, key: supplier.id }))}
          loading={activeLoading}
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: 'max-content' }}
          locale={{ emptyText: 'No active suppliers found' }}
        />
      ),
    },
    {
      key: '2',
      label: 'Pending Suppliers',
      children: (
        <Table
          columns={pendingColumns}
          dataSource={pendingSuppliers.map(supplier => ({ ...supplier, key: supplier.id }))}
          loading={pendingLoading}
          pagination={{ pageSize: 10 }}
          bordered
          scroll={{ x: 'max-content' }}
          locale={{ emptyText: 'No pending suppliers found' }}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={4}>Supplier Management</Title>
      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

export default SupplierList;
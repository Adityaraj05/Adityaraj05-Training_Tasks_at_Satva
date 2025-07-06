import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Tag, Typography, message, Modal } from 'antd';
import {  ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { confirm } = Modal;

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/user/getAllCustomers`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setCustomers(response.data);
      } catch (err) {
        message.error('Failed to fetch customers. Please try again later.');
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const showToggleConfirmModal = (id: string, name: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    confirm({
      title: `Are you sure you want to mark this customer as ${newStatus ? 'active' : 'inactive'}?`,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <Text>
            You are about to change the status of <Text strong>{name}</Text> to{' '}
            <Text strong type={newStatus ? 'success' : 'danger'}>
              {newStatus ? 'Active' : 'Inactive'}
            </Text>
          </Text>
        </div>
      ),
      okText: 'Yes',
      okType: newStatus ? 'primary' : 'danger',
      cancelText: 'No',
      onOk: () => handleToggleStatus(id, currentStatus),
    });
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await axios.post(
        `${apiUrl}/api/user/toggleUserActivation/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer.id === id ? { ...customer, isActive: !currentStatus } : customer
        )
      );
      
      message.success(`Customer marked as ${!currentStatus ? 'active' : 'inactive'} successfully`);
    } catch (err) {
      message.error('Failed to update customer status. Please try again.');
      console.error('Error updating customer status:', err);
    }
  };

  const columns: ColumnsType<Customer> = [
    {
      title: 'Name',
      key: 'name',
      sorter: (a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
      render: (_, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
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
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type={record.isActive ? 'default' : 'primary'}
            danger={record.isActive}
            onClick={() => showToggleConfirmModal(record.id, `${record.firstName} ${record.lastName}`, record.isActive)}
          >
            {record.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={4}>Customer Management</Title>
      <Table
        columns={columns}
        dataSource={customers.map(customer => ({ ...customer, key: customer.id }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: 'No customers found' }}
      />
    </div>
  );
};

export default CustomerList;
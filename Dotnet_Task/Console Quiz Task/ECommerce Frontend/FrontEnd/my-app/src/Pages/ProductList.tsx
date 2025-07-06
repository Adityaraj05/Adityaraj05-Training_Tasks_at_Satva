import React, { useEffect, useState } from 'react';
import { Table, Space, Button, Tag, Typography, message, Modal, Switch } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { confirm } = Modal;

// Define the Product interface based on expected API response
interface Product {
  stockQuantity: any;
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const apiUrl = import.meta.env.VITE_API_URL;
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/product/getAllProducts`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setProducts(response.data);
        console.log('Products:', response.data);

      } catch (err) {
        message.error('Failed to fetch products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    
  }, []);

  const showToggleConfirmModal = (id: string, name: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    confirm({
      title: `Are you sure you want to mark this product as ${newStatus ? 'active' : 'inactive'}?`,
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
      const url = currentStatus
        ? `${apiUrl}/api/product/softDeleteProduct/${id}`
        : `${apiUrl}/api/product/reactivateProduct/${id}`;
  
      await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === id ? { ...product, isActive: !currentStatus } : product
        )
      );
  
      message.success(
        `Product marked as ${!currentStatus ? 'active' : 'inactive'} successfully`
      );
    } catch (err) {
      message.error('Failed to update product status. Please try again.');
      console.error('Error updating product status:', err);
    }
  };
  

  const columns: ColumnsType<Product> = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'image',
      render: (imageUrl: string) => (
        <img
          src={imageUrl}
          alt="Product"
          style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Category',
      dataIndex: 'category',  
      key: 'category',
      render: (category: { name: string }) => category.name,  
      filters: Array.from(new Set(products.map(product => product.category?.name)))  
        .map(categoryName => ({ text: categoryName, value: categoryName })),
      onFilter: (value, record) => record.category?.name === value,  
    },
    {
      title: 'Stock',
      dataIndex: 'stockQuantity',
      key: 'stockQuantity',
      sorter: (a, b) => a.stockQuantity - b.stockQuantity,
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
            onClick={() => showToggleConfirmModal(record.id, record.name, record.isActive)}
          >
            {record.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </Space>
      ),
    },
  ];
  

  return (
    <div style={{ padding: '24px' }}>
      <Title level={4}>Product Management</Title>
      <Table
        columns={columns}
        dataSource={products.map(product => ({ ...product, key: product.id }))}
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        scroll={{ x: 'max-content' }}
        locale={{ emptyText: 'No products found' }}
      />
    </div>
  );
};

export default ProductList;
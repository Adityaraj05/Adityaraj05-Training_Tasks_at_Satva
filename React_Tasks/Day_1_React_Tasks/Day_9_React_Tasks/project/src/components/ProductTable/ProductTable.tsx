import React, { useState } from 'react';
import { Table, Button, Typography, Popconfirm, Tag, Empty } from 'antd';
import { Edit, Trash2, Plus, Package } from 'lucide-react';
import { Product } from '../../types';
import { useProducts } from '../../context/ProductContext';
import ProductForm from '../ProductForm/ProductForm';
import styles from './ProductTable.module.scss';

const { Title } = Typography;

const ProductTable: React.FC = () => {
  const { products, deleteProduct } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
  };

  const handleAddNew = () => {
    setSelectedProduct(undefined);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setSelectedProduct(undefined);
  };

  const handleTableChange = (pagination: React.SetStateAction<{ current: number; pageSize: number; }>) => {
    setPagination(pagination);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => <Tag color="blue">{category}</Tag>,
      filters: [
        { text: 'Electronics', value: 'Electronics' },
        { text: 'Audio', value: 'Audio' },
        { text: 'Wearables', value: 'Wearables' },
        { text: 'Accessories', value: 'Accessories' },
        { text: 'Home', value: 'Home' },
      ],
      onFilter: (value: string | number | boolean, record: Product) =>
        record.category === value,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
      sorter: (a: Product, b: Product) => a.price - b.price,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a: Product, b: Product) => a.stock - b.stock,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Product) => (
        <div className={styles.actionButtons}>
          <Button
            type="text"
            icon={<Edit size={16} />}
            onClick={() => handleEdit(record)}
            aria-label="Edit product"
          />
          <Popconfirm
            title="Delete this product?"
            description="Are you sure you want to delete this product? This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              danger
              icon={<Trash2 size={16} />}
              aria-label="Delete product"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const expandedRowRender = (record: Product) => (
    <div style={{ padding: '0 48px' }}>
      <p>
        <strong>Description:</strong> {record.description}
      </p>
      <p>
        <strong>Created:</strong> {new Date(record.createdAt).toLocaleString()}
      </p>
    </div>
  );

  return (
    <>
      {isFormVisible && <ProductForm initialValues={selectedProduct} onCancel={handleCancel} />}

      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <Title level={4} className={styles.tableTitle}>
            Products
          </Title>
          <Button type="primary" icon={<Plus size={16} />} onClick={handleAddNew}>
            Add Product
          </Button>
        </div>

        <div className={styles.tableContent}>
          <Table
            dataSource={products}
            columns={columns}
            rowKey="id"
            expandable={{
              expandedRowRender,
              rowExpandable: (record) => record.description.length > 0,
            }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '20'],
            }}
            onChange={handleTableChange}
            locale={{
              emptyText: (
                <Empty image={<Package size={64} />} description="No products found" />
              ),
            }}
            scroll={{ y: 'calc(100vh - 300px)' }}
          />
        </div>
      </div>
    </>
  );
};

export default ProductTable;

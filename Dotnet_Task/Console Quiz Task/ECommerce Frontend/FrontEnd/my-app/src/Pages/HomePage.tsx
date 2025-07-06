import React, { useEffect, useState } from 'react';
import { Table, Button, Image, message, Space, Tag, Card, Typography, Tooltip, Badge, Modal, Divider, InputNumber, Select } from 'antd';
import { EditOutlined, PoweroffOutlined, ShoppingOutlined, ExclamationCircleOutlined, PlusOutlined, ReloadOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import ProductForm from '../Components/ProductForm';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  stockQuantity: number;
  imageUrl: string;
  isActive: boolean;
  category: Category;
}

const { Title, Text } = Typography;
const { confirm } = Modal;

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [activeRole, setActiveRole] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formValues, setFormValues] = useState<any>({});
  const apiUrl = import.meta.env.VITE_API_URL;
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const userActiveRole = localStorage.getItem('activeRole');
    if (userActiveRole) {
      setActiveRole(userActiveRole);
      fetchProducts(userActiveRole);
    } else {
      try {
        const rolesArray = JSON.parse(localStorage.getItem('roles') || '[]');
        if (rolesArray.length > 0) {
          const defaultRole = rolesArray[0];
          setActiveRole(defaultRole);
          localStorage.setItem('activeRole', defaultRole);
          fetchProducts(defaultRole);
        } else {
          message.error('No role found. Please log in again.');
        }
      } catch (error) {
        console.error("Error parsing role from localStorage:", error);
        setActiveRole('');
      }
    }
  }, []);

  useEffect(() => {
    console.log('formValue', formValues);
  }, [formValues]);

  useEffect(() => {
    const handleStorageChange = () => {
      const newActiveRole = localStorage.getItem('activeRole');
      if (newActiveRole && newActiveRole !== activeRole) {
        setActiveRole(newActiveRole);
        fetchProducts(newActiveRole);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('activeRoleChanged', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('activeRoleChanged', handleStorageChange);
    };
  }, [activeRole]);

  const fetchProducts = async (userRole: string) => {
    try {
      setLoading(true);
      const endpoint = userRole.toLowerCase() === 'supplier'
        ? `${apiUrl}/api/product/getAllForSupplier`
        : `${apiUrl}/api/product/getAllProducts`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (userRole.toLowerCase() === 'customer') {
        setProducts(response.data.filter((product: Product) => product.isActive));
      } else {
        setProducts(response.data);
      }
    } catch (error) {
      message.error('Failed to load products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (productId: number, currentStatus: boolean) => {
    try {
      setActionLoading(productId);
      const endpoint = currentStatus
        ? `${apiUrl}/api/product/softDeleteProduct/${productId}`
        : `${apiUrl}/api/product/reactivateProduct/${productId}`;

      await axios.post(endpoint, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      message.success(`Product ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchProducts(activeRole);
    } catch (err) {
      message.error('Failed to toggle product status');
      console.error('Error toggling product status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleFormSubmit = async (values: any) => {
    setFormLoading(true);
    try {
      console.log('Form values before submission:', values);

      const isEditing = formValues.id ? true : false;
      const endpoint = isEditing
        ? `${apiUrl}/api/product/updateProduct/${formValues.id}`
        : `${apiUrl}/api/product/addProduct`;

      const processedVariants = values.variants?.map((variant: any, index: number) => {
        if (isEditing && formValues.variants && formValues.variants[index]) {
          return {
            ...variant,
            id: formValues.variants[index].id
          };
        }
        return variant;
      });

      const dataToSend = {
        ...values,
        id: formValues.id,
        variants: processedVariants
      };

      console.log('Data being sent to API:', dataToSend);

      await axios.post(endpoint, dataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      message.success(`Product ${isEditing ? 'updated' : 'added'} successfully`);
      setIsModalVisible(false);
      setFormValues({});
      await fetchProducts(activeRole);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        message.error(`Failed to ${formValues.id ? 'update' : 'add'} product: ${error.response.data.message}`);
      } else if (error.message) {
        message.error(`Failed to ${formValues.id ? 'update' : 'add'} product: ${error.message}`);
      } else {
        message.error(`Failed to ${formValues.id ? 'update' : 'add'} product: Unknown error`);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = async (productId: number) => {
    try {
      const response = await axios.get(`${apiUrl}/api/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data.success) {
        const product = response.data.data;
  
        const formattedValues = {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          discountPrice: product.discountPrice,
          stockQuantity: product.stockQuantity,
          imageUrls: [product.imageUrl],
          categoryId: product.category.id,
          variants: product.variant ? [
            {
              id: product.variant.id,
              size: product.variant.size,
              color: product.variant.color,
              material: product.variant.material,
              priceAdjustment: product.variant.priceAdjustment,
              stockQuantity: product.variant.stockQuantity,
              sku: product.variant.sku
            }
          ] : []
        };
  
        setFormValues(formattedValues);        
        showModal();
      } else {
        message.error(response.data.message || 'Failed to fetch product.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      message.error(errorMessage);
      console.error('Error fetching product:', error);
    }
  };

  const handleAddToCart = (product: Product) => {
    if (product.stockQuantity <= 0) {
      message.error('This product is out of stock');
      return;
    }

    let selectedQuantity = 1;
    let selectedVariantId: number | null = null;

    const container = document.createElement('div');
    document.body.appendChild(container);

    const AddToCartContent = () => {
      const [variants, setVariants] = useState<any[]>([]);
      const [loading, setLoading] = useState(true);
      const [selectedVariant, setSelectedVariant] = useState<number | null>(null);

      useEffect(() => {
        const fetchVariants = async () => {
          try {
            const response = await axios.get(`${apiUrl}/api/product/variants/${product.id}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            setVariants(response.data.data || []);
          } catch (err) {
            message.error('Failed to load product variants');
          } finally {
            setLoading(false);
          }
        };
        fetchVariants();
      }, []);

      selectedVariantId = selectedVariant;

      return (
        <div style={{ marginTop: 16 }}>
          <p><strong>{product.name}</strong></p>
          <p>Price: ₹{product.discountPrice > 0 ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}</p>
          <p>Available Stock: {product.stockQuantity}</p>

          <div style={{ marginTop: 16 }}>
            <Text>Variant:</Text>
            <Select
              style={{ width: '100%', marginTop: 8 }}
              placeholder="Select a variant"
              loading={loading}
              onChange={(value) => setSelectedVariant(value)}
            >
              {variants.map((variant) => (
                <Select.Option key={variant.id} value={variant.id}>
                  {variant.size ? `Size: ${variant.size}` : ''}
                  {variant.color ? ` | Color: ${variant.color}` : ''}
                  {variant.material ? ` | Material: ${variant.material}` : ''}
                </Select.Option>
              ))}
            </Select>
          </div>

          <div style={{ marginTop: 16 }}>
            <Text>Quantity:</Text>
            <InputNumber
              min={1}
              max={product.stockQuantity}
              defaultValue={1}
              onChange={(val) => {
                if (val) selectedQuantity = val;
              }}
              style={{ marginLeft: 16, width: 80 }}
            />
          </div>
        </div>
      );
    };

    Modal.confirm({
      title: 'Add to Cart',
      icon: <ShoppingCartOutlined />,
      content: <AddToCartContent />,
      okText: 'Add to Cart',
      cancelText: 'Cancel',
      destroyOnClose: true,
      onOk: async () => {
        try {
          await axios.post(
            `${apiUrl}/api/cart/add`,
            {
              productId: product.id,
              variantId: selectedVariantId,
              quantity: selectedQuantity,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          message.success('Product added to cart successfully');
        } catch (error) {
          console.error('Error adding to cart:', error);
          message.error('Failed to add product to cart');
          return Promise.reject(error);
        }
      },
      onCancel: () => {
        document.body.removeChild(container);
      }
    });
  };

  const showStatusConfirm = (product: Product) => {
    const isActivating = !product.isActive;

    confirm({
      title: `Are you sure you want to ${isActivating ? 'activate' : 'deactivate'} this product?`,
      icon: <ExclamationCircleOutlined style={{ color: isActivating ? '#52c41a' : '#ff4d4f' }} />,
      content: (
        <div>
          <p><strong>Product:</strong> {product.name}</p>
          <p><strong>Category:</strong> {product.category.name}</p>
          <p><strong>Current Status:</strong> <Tag color={product.isActive ? 'green' : 'red'}>{product.isActive ? 'Active' : 'Inactive'}</Tag></p>
          <p><strong>Price:</strong> ₹{product.price}</p>
          {isActivating ?
            <p>Activating will make this product visible to customers.</p> :
            <p>Deactivating will hide this product from customers.</p>
          }
        </div>
      ),
      okText: isActivating ? 'Yes, Activate' : 'Yes, Deactivate',
      okType: isActivating ? 'primary' : 'danger',
      cancelText: 'Cancel',
      onOk() {
        return handleToggleStatus(product.id, product.isActive);
      },
    });
  };

  const getStockTag = (quantity: number) => {
    if (quantity <= 0) {
      return <Tag color="red">Out of Stock</Tag>;
    } else if (quantity < 10) {
      return <Tag color="orange">Low Stock ({quantity})</Tag>;
    } else {
      return <Tag color="green">{quantity} in Stock</Tag>;
    }
  };

  const getColumns = (): ColumnsType<Product> => {
    const baseColumns: ColumnsType<Product> = [
      {
        title: 'Image',
        dataIndex: 'imageUrl',
        key: 'imageUrl',
        width: 100,
        render: (url: string) => (
          <Image
            width={80}
            src={url}
            alt="Product"
            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
          />
        ),
      },
      {
        title: 'Product Details',
        key: 'product',
        width: 200,
        render: (_, record) => (
          <>
            <Text strong style={{ fontSize: '15px' }}>{record.name}</Text>
            <div style={{ marginTop: 5 }}>
              <Tag color="blue">{record.category.name}</Tag>
              {activeRole === 'Supplier' && (
                record.isActive ?
                  <Badge status="success" text="Active" /> :
                  <Badge status="error" text="Inactive" />
              )}
            </div>
          </>
        ),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        width: 200,
        render: (text: string) => (
          <Tooltip title={text}>
            {text}
          </Tooltip>
        ),
      },
      {
        title: 'Price',
        key: 'price',
        width: 150,
        render: (_, record) => (
          <>
            {record.discountPrice > 0 ? (
              <>
                <Text delete style={{ color: '#999' }}>₹{record.price.toFixed(2)}</Text>
                <br />
                <Text type="danger" strong>₹{record.discountPrice.toFixed(2)}</Text>
              </>
            ) : (
              <Text strong>₹{record.price.toFixed(2)}</Text>
            )}
          </>
        ),
      },
      {
        title: 'Stock',
        dataIndex: 'stockQuantity',
        key: 'stockQuantity',
        width: 150,
        render: (quantity: number) => getStockTag(quantity),
      },
    ];

    if (activeRole === 'Supplier') {
      baseColumns.push({
        title: 'Actions',
        key: 'actions',
        width: 180,
        render: (_, record) => (
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record.id)}
            >
              Edit
            </Button>
            <Button
              danger={record.isActive}
              type={record.isActive ? 'default' : 'primary'}
              icon={<PoweroffOutlined />}
              size="small"
              loading={actionLoading === record.id}
              onClick={() => showStatusConfirm(record)}
            >
              {record.isActive ? 'Deactivate' : 'Activate'}
            </Button>
          </Space>
        ),
      });
    } else if (activeRole === 'Customer') {
      baseColumns.push({
        title: 'Actions',
        key: 'actions',
        width: 120,
        render: (_, record) => (
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            size="small"
            disabled={record.stockQuantity <= 0}
            onClick={() => handleAddToCart(record)}
          >
            Add to Cart
          </Button>
        ),
      });
    }

    return baseColumns;
  };

  const getProductsSummary = () => {
    const total = products.length;
    let summaryTags = [<Tag color="blue" key="total">Total: {total}</Tag>];

    if (activeRole === 'Supplier') {
      const active = products.filter(p => p.isActive).length;
      const inactive = total - active;
      const lowStock = products.filter(p => p.stockQuantity < 10 && p.stockQuantity > 0).length;
      const outOfStock = products.filter(p => p.stockQuantity <= 0).length;

      summaryTags = [
        ...summaryTags,
        <Tag color="green" key="active">Active: {active}</Tag>,
        <Tag color="red" key="inactive">Inactive: {inactive}</Tag>,
        <Tag color="orange" key="lowstock">Low Stock: {lowStock}</Tag>,
        <Tag color="volcano" key="outofstock">Out of Stock: {outOfStock}</Tag>
      ];
    } else if (activeRole === 'Customer') {
      const available = products.filter(p => p.stockQuantity > 0).length;
      const discounted = products.filter(p => p.discountPrice > 0).length;

      summaryTags = [
        ...summaryTags,
        <Tag color="green" key="available">Available: {available}</Tag>,
        <Tag color="red" key="outofstock">Out of Stock: {total - available}</Tag>,
        <Tag color="volcano" key="discounted">On Discount: {discounted}</Tag>
      ];
    }

    return <Space size="middle">{summaryTags}</Space>;
  };

  const getPageTitle = () => {
    return activeRole === 'Supplier' ? 'Product Management' : 'Product Catalog';
  };

  return (
    <Card className="products-card" bordered={false}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          <ShoppingOutlined /> {getPageTitle()}
        </Title>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchProducts(activeRole)}
            loading={loading}
          >
            Refresh
          </Button>
          {activeRole === 'Supplier' && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModal}
            >
              Add Product
            </Button>
          )}
        </Space>
      </div>

      <div style={{ marginBottom: 16 }}>
        {getProductsSummary()}
      </div>

      <Divider style={{ margin: '12px 0' }} />

      <Table
        dataSource={products.map(p => ({ ...p, key: p.id }))}
        columns={getColumns()}
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`
        }}
        size="middle"
      />
      <Modal
        title={formValues.id ? "Edit Product" : "Add New Product"}
        visible={isModalVisible}
        onCancel={() => {
          handleCancel();
          setFormValues({});
        }}
        footer={null}
        destroyOnClose
        width={800}
      >
        <ProductForm
          onSubmit={handleFormSubmit}
          loading={formLoading}
          initialValues={formValues}
          productId={formValues.id}
        />
      </Modal>
    </Card>
  );
};

export default HomePage;
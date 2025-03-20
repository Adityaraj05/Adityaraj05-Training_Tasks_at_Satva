import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, Typography } from 'antd';
import { Product } from '../../types';
import { useProducts } from '../../context/ProductContext';
import styles from './ProductForm.module.scss';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface ProductFormProps {
  initialValues?: Product;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialValues, onCancel }) => {
  const [form] = Form.useForm();
  const { addProduct, updateProduct } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!initialValues;

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [form, initialValues]);

  const handleSubmit = async (values: Omit<Product, 'id' | 'createdAt'>) => {
    setIsSubmitting(true);
    try {
      if (isEditing && initialValues) {
        updateProduct({
          ...values,
          id: initialValues.id,
          createdAt: initialValues.createdAt,
        } as Product);
      } else {
        addProduct(values);
      }
      form.resetFields();
      onCancel();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <Title level={4} className={styles.formTitle}>
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: 'Please enter product name' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category' }]}
        >
          <Select placeholder="Select a category">
            <Option value="Electronics">Electronics</Option>
            <Option value="Audio">Audio</Option>
            <Option value="Wearables">Wearables</Option>
            <Option value="Accessories">Accessories</Option>
            <Option value="Home">Home</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please enter price' }]}
        >
          <InputNumber
            min={0}
            step={0.01}
            precision={2}
            style={{ width: '100%' }}
            placeholder="Enter price"
            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          name="stock"
          label="Stock"
          rules={[{ required: true, message: 'Please enter stock quantity' }]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter stock quantity" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <TextArea rows={4} placeholder="Enter product description" />
        </Form.Item>

        <div className={styles.formActions}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {isEditing ? 'Update' : 'Add'} Product
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ProductForm;
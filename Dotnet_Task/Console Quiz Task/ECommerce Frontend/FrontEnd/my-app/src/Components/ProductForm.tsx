import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    InputNumber,
    Button,
    Select,
    Space,
    Typography,
    Divider,
    Card,
    message
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface ProductFormProps {
    onSubmit: (values: ProductFormData) => void;
    initialValues?: ProductFormData;
    isEditing?: boolean;
    loading?: boolean;
    productId?: number; // Added for edit functionality
}

interface VariantData {
    size: string;
    color: string;
    material: string;
    priceAdjustment: number;
    stockQuantity: number;
    sku: string;
}

interface ProductFormData {
    name: string;
    description: string;
    price: number;
    discountPrice: number;
    stockQuantity: number;
    categoryId: number;
    imageUrls: string[];
    variants: VariantData[];
}

interface Category {
    id: number;
    name: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
    onSubmit,
    initialValues,
    loading = false,
    productId
}) => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingVariants, setLoadingVariants] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        fetchCategories();
        if (productId) {
            fetchProductVariants(productId);
        }
    }, [productId]);

    const fetchCategories = async () => {
        try {
            setLoadingCategories(true);
            const response = await axios.get(`${apiUrl}/api/category/getAllCategories`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            message.error('Failed to load categories');
        } finally {
            setLoadingCategories(false);
        }
    };

    const fetchProductVariants = async (id: number) => {
        try {
            setLoadingVariants(true);
            const response = await axios.get(`${apiUrl}/api/product/variants/${id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.data.data && response.data.data.length > 0) {
                form.setFieldsValue({
                    variants: response.data.data.map((variant: any) => ({
                        size: variant.size || '',
                        color: variant.color || '',
                        material: variant.material || '',
                        priceAdjustment: variant.priceAdjustment || 0,
                        stockQuantity: variant.stockQuantity || 0,
                        sku: variant.sku || ''
                    }))
                });
            }
        } catch (error) {
            console.error('Error fetching product variants:', error);
            message.error('Failed to load product variants');
        } finally {
            setLoadingVariants(false);
        }
    };

    const validateUrl = (value: string): boolean => {
        try {
            const parsed = new URL(value);
            if (
                /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(parsed.pathname) ||
                parsed.searchParams.has('auto') ||
                parsed.searchParams.has('format')
            ) {
                return true;
            }
            message.warning('URL may not look like a standard image file');
            return false;
        } catch {
            return false;
        }
    };


    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setImageUrl(value);
    };

    const handleSubmit = (values: any) => {
        if (!values.imageUrls || (Array.isArray(values.imageUrls) ? values.imageUrls.length === 0 : !values.imageUrls)) {
            message.error('Please add at least one product image');
            return;
        }

        const formData: ProductFormData = {
            ...values,
            discountPrice: values.discountPrice || 0,
            variants: values.variants || []
        };

        onSubmit(formData);
    };

    return (
        <Card bordered={false}>
            <Title level={4}>Product Details</Title>
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onFinish={handleSubmit}
                autoComplete="off"
            >
                <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[{ required: true, message: 'Please enter product name' }]}
                >
                    <Input placeholder="Enter product name" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter product description' }]}
                >
                    <TextArea rows={4} placeholder="Enter product description" />
                </Form.Item>

                <Space size="large" style={{ display: 'flex' }}>
                    <Form.Item
                        name="price"
                        label="Price (₹)"
                        rules={[{ required: true, message: 'Please enter product price' }]}
                    >
                        <InputNumber
                            min={0}
                            step={0.01}
                            precision={2}
                            placeholder="0.00"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item name="discountPrice" label="Discount Price (₹)">
                        <InputNumber
                            min={0}
                            step={0.01}
                            precision={2}
                            placeholder="0.00"
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="stockQuantity"
                        label="Stock Quantity"
                        rules={[{ required: true, message: 'Please enter stock quantity' }]}
                    >
                        <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
                    </Form.Item>
                </Space>

                <Form.Item
                    name="categoryId"
                    label="Category"
                    rules={[{ required: true, message: 'Please select a category' }]}
                >
                    <Select
                        placeholder="Select a category"
                        loading={loadingCategories}
                    >
                        {categories.map((category) => (
                            <Option key={category.id} value={category.id}>
                                {category.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.List
                    name="imageUrls"
                    rules={[
                        {
                            validator: async (_, imageUrls) => {
                                if (!imageUrls || imageUrls.length === 0) {
                                    return Promise.reject(new Error('Please add at least one image'));
                                }
                            },
                        },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            <Space style={{ marginBottom: 16 }}>
                                <Input
                                    placeholder="Enter image URL"
                                    value={imageUrl}
                                    onChange={handleImageUrlChange}
                                    style={{ width: 300 }}
                                />
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        if (!imageUrl) {
                                            message.error('Please enter an image URL');
                                            return;
                                        }
                                        if (!validateUrl(imageUrl)) {
                                            message.error('Please enter a valid image URL');
                                            return;
                                        }
                                        add(imageUrl);
                                        setImageUrl('');
                                    }}
                                >
                                    Add Image
                                </Button>
                            </Space>

                            {fields.map(({ key, name, ...restField }, index) => {
                                return (
                                    <Form.Item
                                        key={key}
                                        {...restField}
                                        name={name}
                                        rules={[{ required: true, message: 'Image URL is required' }]}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                            <img
                                                src={form.getFieldValue(['imageUrls', index])}
                                                alt={`Product ${index}`}
                                                style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 8 }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src =
                                                        'https://via.placeholder.com/60?text=No+Image';
                                                }}
                                            />
                                            <Text ellipsis style={{ maxWidth: 300 }}>
                                                {form.getFieldValue(['imageUrls', index])}
                                            </Text>
                                            <Button
                                                type="text"
                                                danger
                                                icon={<MinusCircleOutlined />}
                                                onClick={() => remove(name)}
                                                style={{ marginLeft: 8 }}
                                            />
                                        </div>
                                    </Form.Item>
                                );
                            })}

                            <Form.ErrorList errors={errors} />
                        </>
                    )}
                </Form.List>


                <Divider orientation="left">Product Variants</Divider>
                <Text type="secondary">
                    Add different variants of the product (size, color, material, etc.)
                </Text>

                <Form.List name="variants">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Card
                                    key={key}
                                    size="small"
                                    style={{ marginTop: 16, marginBottom: 16 }}
                                    extra={
                                        <MinusCircleOutlined
                                            onClick={() => remove(name)}
                                            style={{ color: '#ff4d4f' }}
                                        />
                                    }
                                >
                                    <Space
                                        direction="vertical"
                                        style={{ display: 'flex', width: '100%' }}
                                        size="middle"
                                    >
                                        <Space size="large" style={{ display: 'flex' }}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'id']}
                                                hidden
                                            >
                                                <Input type="hidden" />
                                            </Form.Item>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'size']}
                                                label="Size"
                                                rules={[{ required: true, message: 'Please enter size' }]}
                                            >
                                                <Input placeholder="Size" />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'color']}
                                                label="Color"
                                                rules={[{ required: true, message: 'Please enter color' }]}
                                            >
                                                <Input placeholder="Color" />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'material']}
                                                label="Material"
                                            >
                                                <Input placeholder="Material" />
                                            </Form.Item>
                                        </Space>

                                        <Space size="large" style={{ display: 'flex' }}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, 'priceAdjustment']}
                                                label="Price Adjustment (₹)"
                                            >
                                                <InputNumber
                                                    placeholder="0.00"
                                                    step={0.01}
                                                    precision={2}
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'stockQuantity']}
                                                label="Stock Quantity"
                                                rules={[{ required: true, message: 'Enter stock quantity' }]}
                                            >
                                                <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
                                            </Form.Item>

                                            <Form.Item
                                                {...restField}
                                                name={[name, 'sku']}
                                                label="SKU"
                                                rules={[{ required: true, message: 'Please enter SKU' }]}
                                            >
                                                <Input placeholder="SKU" />
                                            </Form.Item>
                                        </Space>
                                    </Space>
                                </Card>
                            ))}

                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    Add Variant
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} size="large">
                        Save Product
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ProductForm;
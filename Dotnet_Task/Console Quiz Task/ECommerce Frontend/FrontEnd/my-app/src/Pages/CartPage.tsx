import React, { useEffect, useState } from 'react';
import { Table, Button, Image, message, Typography, InputNumber, Popconfirm, Empty, Divider, Statistic, Card, Modal } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, ReloadOutlined, ShoppingOutlined, CheckOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import Checkout from './Checkout';
import { jwtDecode } from "jwt-decode";


interface CartItem {
    id: number;
    productId: number;
    quantity: number;
    productVariantId: number;
    price: number;
    productName: string;
    productImageUrl: string;
}

interface CartData {
    id: number;
    userId: number;
    cartItems: CartItem[];
}

interface JwtPayload {
    userId: number;
    role: string;
    // Add other fields if needed
}

const { Title, Text } = Typography;

const CartPage: React.FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [updateLoading, setUpdateLoading] = useState<number | null>(null);
    const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);


    const apiUrl = import.meta.env.VITE_API_URL;
    const accessToken = localStorage.getItem('accessToken');

    const claimKey = import.meta.env.VITE_CLAIM_USER_ID;

    const getUserIdFromToken = (): number | null => {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;
        try {
            const decoded: any = jwtDecode(token);
            const userId = decoded[claimKey];
            return userId ? parseInt(userId, 10) : null;
        } catch (err) {
            console.error("Failed to decode token", err);
            return null;
        }
    };
    const userId = getUserIdFromToken();
    console.log("userId", userId);
    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            setLoading(true);

            const response = await axios.get(`${apiUrl}/api/cart/get`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.data.success) {
                const cartData: CartData = response.data.data;
                setCartItems(cartData.cartItems);
            } else {
                message.info(response.data.message || 'Failed to load cart items');
            }
        } catch (error) {
            message.error('Failed to load cart items');
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (cartItemId: number, quantity: number) => {
        try {
            setUpdateLoading(cartItemId);
            await axios.put(`${apiUrl}/api/cart/update/${cartItemId}`,
                { quantity },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === cartItemId ? { ...item, quantity } : item
                )
            );

            message.success('Cart updated successfully');
        } catch (error) {
            message.error('Failed to update cart');
            console.error('Error updating cart:', error);
        } finally {
            setUpdateLoading(null);
        }
    };

    const handleRemoveFromCart = async (cartItemId: number) => {
        try {
            setUpdateLoading(cartItemId);
            await axios.delete(`${apiUrl}/api/cart/remove/${cartItemId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
            message.success('Item removed from cart');
        } catch (error) {
            message.error('Failed to remove item from cart');
            console.error('Error removing item:', error);
        } finally {
            setUpdateLoading(null);
        }
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            message.error('Your cart is empty.');
            return;
        }
        setIsCheckoutVisible(true);
    };

    const calculateItemPrice = (item: CartItem): number => {
        return item.price * item.quantity;
    };

    const calculateTotal = (): number => {
        return cartItems.reduce((sum, item) => sum + calculateItemPrice(item), 0);
    };

    const columns: ColumnsType<CartItem> = [
        {
            title: 'Image',
            dataIndex: 'productImageUrl',
            key: 'productImageUrl',
            width: 100,
            render: (url: string) => (
                <Image
                    width={80}
                    src={url}
                    alt="Product"
                    fallback="data:image/png;base64,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" />
            ),
        },
        {
            title: 'Product',
            dataIndex: 'productName',
            key: 'productName',
            render: (name: string) => (
                <Text strong style={{ fontSize: '15px' }}>{name}</Text>
            ),
        },
        {
            title: 'Unit Price',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            render: (price: number) => (
                <Text>₹{price.toFixed(2)}</Text>
            ),
        },
        {
            title: 'Quantity',
            key: 'quantity',
            width: 120,
            render: (_, record) => (
                <InputNumber
                    min={1}
                    value={record.quantity}
                    onChange={(value) => {
                        if (value) handleUpdateQuantity(record.id, value);
                    }}
                    disabled={updateLoading === record.id}
                    style={{ width: 60 }}
                />
            ),
        },
        {
            title: 'Subtotal',
            key: 'subtotal',
            width: 120,
            render: (_, record) => (
                <Text strong>₹{calculateItemPrice(record).toFixed(2)}</Text>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_, record) => (
                <Popconfirm
                    title="Remove this item from cart?"
                    onConfirm={() => handleRemoveFromCart(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        loading={updateLoading === record.id}
                    >
                        Remove
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    const renderEmptyCart = () => (
        <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
                <span>
                    Your cart is empty
                </span>
            }
        >
            <Button type="primary" icon={<ShoppingOutlined />}>
                Continue Shopping
            </Button>
        </Empty>
    );

    return (
        <Card className="cart-card" bordered={false}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Title level={4} style={{ margin: 0 }}>
                    <ShoppingCartOutlined /> Shopping Cart
                </Title>
                <Button
                    icon={<ReloadOutlined />}
                    onClick={fetchCartItems}
                    loading={loading}
                >
                    Refresh
                </Button>
            </div>

            {cartItems.length > 0 ? (
                <>
                    <Table
                        dataSource={cartItems.map(item => ({ ...item, key: item.id }))}
                        columns={columns}
                        loading={loading}
                        scroll={{ x: 'max-content' }}
                        pagination={false}
                        size="middle"
                    />

                    <Divider />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 8px' }}>
                        <div>
                            <Text>Total Items: {cartItems.length}</Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                            <Statistic
                                title="Total Amount"
                                value={calculateTotal()}
                                precision={2}
                                prefix="₹"
                                style={{ margin: 0 }}
                            />
                            <Button
                                type="primary"
                                size="large"
                                icon={<CheckOutlined />}
                                onClick={handleCheckout}
                                disabled={cartItems.length === 0}
                            >
                                Proceed to Checkout
                            </Button>
                            <Modal
                                open={isCheckoutVisible}
                                footer={null}
                                onCancel={() => setIsCheckoutVisible(false)}
                                width={700}
                                destroyOnClose
                            >
                                <Checkout
                                    userId={userId}
                                    cartItems={cartItems}
                                    onPlaceOrder={async (orderData) => {
                                        console.log(orderData);
                                        try {
                                            const response = await axios.post(`${apiUrl}/api/order/placeOrder`, orderData, {
                                                headers: {
                                                    Authorization: `Bearer ${accessToken}`,
                                                },
                                            });
                                            
                                            if (response.data.success) {
                                                message.success('Order placed successfully');
                                                setCartItems([]);
                                                setIsCheckoutVisible(false);
                                            } else {
                                                message.error(response.data.message || 'Failed to place order');
                                            }
                                        } catch (error) {
                                            const errorMessage = error.response?.data?.message || error.message;
                                            message.error(errorMessage); 
                                            console.error('Error placing order:', error);
                                        }
                                    }}
                                />
                            </Modal>
                        </div>
                    </div>
                </>
            ) : (
                renderEmptyCart()
            )}
        </Card>
    );
};

export default CartPage;
import React, { useEffect, useState } from 'react';
import { Table, Typography, message } from 'antd';
import axios from 'axios';
import type { ColumnsType } from 'antd/es/table';

const { Title } = Typography;

interface OrderItem {
    productId: number;
    productVariantId: number | null;
    quantity: number;
    price: number;
}

interface Order {
    userId: number;
    totalAmount: number;
    status: string;
    shippingAddressId: number;
    billingAddressId: number;
    orderNotes: string;
    trackingNumber: string;
    shippingProvider: string;
    orderItems: OrderItem[];
}

const OrderList: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const apiUrl = import.meta.env.VITE_API_URL;
    const accessToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${apiUrl}/api/order/allOrders`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setOrders(response.data);
            } catch (error) {
                message.error('Failed to fetch orders. Please try again later.');
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const columns: ColumnsType<Order> = [
        {
            title: 'User ID',
            dataIndex: 'userId',
            key: 'userId',
            sorter: (a, b) => a.userId - b.userId,
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            sorter: (a, b) => a.totalAmount - b.totalAmount,
            render: (amount) => `$${amount.toFixed(2)}`,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (status) => status || 'N/A',
        },
        {
            title: 'Order Notes',
            dataIndex: 'orderNotes',
            key: 'orderNotes',
            ellipsis: true,
            render: (notes) => notes || 'None',
        },
        {
            title: 'Tracking Number',
            dataIndex: 'trackingNumber',
            key: 'trackingNumber',
            render: (tracking) => tracking || 'N/A',
        },
        {
            title: 'Shipping Provider',
            dataIndex: 'shippingProvider',
            key: 'shippingProvider',
            render: (provider) => provider || 'N/A',
        },
        {
            title: 'Number of Items',
            key: 'orderItems',
            render: (_, record) => record.orderItems.length,
            sorter: (a, b) => a.orderItems.length - b.orderItems.length,
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <Title level={4}>Order Management</Title>
            <Table
                columns={columns}
                dataSource={orders.map((order, index) => ({ ...order, key: index }))}
                loading={loading}
                pagination={{ pageSize: 10 }}
                bordered
                scroll={{ x: 'max-content', y: 400 }} // horizontal + vertical scroll with 400px height
                locale={{ emptyText: 'No orders found' }}
            />

        </div>
    );
};

export default OrderList;

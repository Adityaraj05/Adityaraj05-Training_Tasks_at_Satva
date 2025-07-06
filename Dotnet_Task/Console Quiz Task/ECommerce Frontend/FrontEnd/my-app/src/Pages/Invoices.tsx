import React, { useEffect, useState } from 'react';
import { Table, Button, message, Card, Input, Space, Spin, Tag } from 'antd';
import { PrinterOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import axios from 'axios';

interface Invoice {
    id: number;
    orderId: number;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate: string;
    sellerId: number;
    customerName: string;
    customerEmail: string;
    totalAmount: number;
    status?: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

const isOverdue = (dueDate: string) => {
  return dayjs().isAfter(dayjs(dueDate));
};

const Invoices: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchText, setSearchText] = useState<string>('');
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
    const [sellerId, setSellerId] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    // Initialize seller ID and access token
    useEffect(() => {
        const storedSellerId = localStorage.getItem('id');
        const storedAccessToken = localStorage.getItem('accessToken');
        
        setSellerId(storedSellerId);
        setAccessToken(storedAccessToken);
    }, []);

    const handleGenerate = async (record: Invoice) => {
      try {
        setLoading(true);
        const response = await axios.get(`${apiUrl}/api/invoice/export/${record.id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: 'blob', 
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${record.invoiceNumber}.pdf`); 
        document.body.appendChild(link);
        link.click();
        link.remove();

        message.success('Invoice downloaded successfully');
      } catch (error: any) {
        if (error.response) {
          message.error(`Failed to generate invoice: ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
          message.error('No response from server. Please try again later.');
        } else {
          message.error(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchInvoices = async () => {
        if (!sellerId || !accessToken) {
            // Skip fetch if no sellerId or accessToken available yet
            return;
        }
        
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/api/invoice/getInvoicesBySellerId/${sellerId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });
            setInvoices(response.data);
            setFilteredInvoices(response.data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            message.error('Failed to load invoices');
        } finally {
            setLoading(false);
        }
    };

    // Only fetch invoices when sellerId and accessToken are available
    useEffect(() => {
        if (sellerId && accessToken) {
            fetchInvoices();
        }
    }, [sellerId, accessToken]);

    useEffect(() => {
        if (searchText) {
            const searchLower = searchText.toLowerCase();
            const filtered = invoices.filter(invoice => 
                invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
                invoice.customerName.toLowerCase().includes(searchLower) ||
                invoice.customerEmail.toLowerCase().includes(searchLower) ||
                String(invoice.orderId).includes(searchText)
            );
            setFilteredInvoices(filtered);
        } else {
            setFilteredInvoices(invoices);
        }
    }, [searchText, invoices]);

    const handleRefresh = () => {
        // Re-read localStorage values in case they changed
        const storedSellerId = localStorage.getItem('id');
        const storedAccessToken = localStorage.getItem('accessToken');
        
        setSellerId(storedSellerId);
        setAccessToken(storedAccessToken);

        // fetchInvoices will be triggered by the dependency-based useEffect
    };

    const columns: ColumnsType<Invoice> = [
        {
            title: 'Invoice Number',
            dataIndex: 'invoiceNumber',
            key: 'invoiceNumber',
        },
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
        },
        {
            title: 'Invoice Date',
            dataIndex: 'invoiceDate',
            key: 'invoiceDate',
            render: (date: string) => dayjs(date).format('DD MMM YYYY'),
        },
        {
            title: 'Due Date',
            dataIndex: 'dueDate',
            key: 'dueDate',
            render: (date: string) => (
                <Space>
                    {dayjs(date).format('DD MMM YYYY')}
                    {isOverdue(date) && <Tag color="red">Overdue</Tag>}
                </Space>
            ),
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Customer Email',
            dataIndex: 'customerEmail',
            key: 'customerEmail',
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount: number) => <span style={{ fontWeight: 500 }}>₹{amount.toFixed(2)}</span>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button 
                    icon={<PrinterOutlined/>} 
                    type="primary" 
                    onClick={() => handleGenerate(record)}
                    disabled={!accessToken}
                />
            ),
        },
    ];

    return (
        <Card title="Invoices" extra={
            <Space>
                <Input
                    placeholder="Search invoices"
                    prefix={<SearchOutlined />}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ width: 200 }}
                    allowClear
                />
                <Button 
                    icon={<ReloadOutlined />} 
                    onClick={handleRefresh}
                />
            </Space>
        }>
            <Spin spinning={loading}>
                {!sellerId && (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        User information not found. Please log in again.
                    </div>
                )}
                <Table 
                    rowKey="id" 
                    dataSource={filteredInvoices} 
                    columns={columns}
                    pagination={{ 
                        showSizeChanger: true,
                        defaultPageSize: 10,
                        pageSizeOptions: ['10', '20', '50']
                    }}
                />
            </Spin>
        </Card>
    );
};

export default Invoices;
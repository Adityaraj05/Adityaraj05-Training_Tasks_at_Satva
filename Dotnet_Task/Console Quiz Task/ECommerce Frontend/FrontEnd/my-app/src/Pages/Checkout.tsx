import React, { useState, useEffect } from 'react';
import { Button, Radio, List, Input, Divider, message, Spin } from 'antd';
import axios from 'axios';

interface Address {
    id: number;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface CartItem {
    productId: number;
    productName: string;
    productVariantId: number;
    quantity: number;
    price: number;
}

interface CheckoutProps {
    userId: number | null;
    cartItems: CartItem[];
    onPlaceOrder: (orderData: any) => Promise<void>;
}

interface ApiResponse {
    success: boolean;
    message: string | null;
    data: Address[];
    errors: any | null;
}

const Checkout: React.FC<CheckoutProps> = ({ userId, cartItems, onPlaceOrder }) => {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loadingAddresses, setLoadingAddresses] = useState<boolean>(true);
    const [errorLoadingAddresses, setErrorLoadingAddresses] = useState<string | null>(null);

    const [step, setStep] = useState<'address' | 'review'>('address');
    const [selectedShippingIndex, setSelectedShippingIndex] = useState<number | null>(null);
    const [selectedBillingIndex, setSelectedBillingIndex] = useState<number | null>(null);
    const [orderNotes, setOrderNotes] = useState('');

    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchAddresses = async () => {
            setLoadingAddresses(true);
            setErrorLoadingAddresses(null);

            try {
                const response = await axios.get<ApiResponse>(`${apiUrl}/api/user/addresses`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data?.success && Array.isArray(response.data.data)) {
                    setAddresses(response.data.data);
                    if (response.data.data.length === 1) {
                        setSelectedShippingIndex(0);
                        setSelectedBillingIndex(0);
                    }
                } else {
                    console.error('Unexpected API response format:', response.data);
                    setAddresses([]);
                    setErrorLoadingAddresses('Received invalid address data from server.');
                }
            } catch (error) {
                setErrorLoadingAddresses('Failed to load addresses.');
                console.error(error);
                setAddresses([]);
            } finally {
                setLoadingAddresses(false);
            }
        };

        if (userId) {
            fetchAddresses();
        }
    }, [userId, apiUrl, token]);

    const handleNext = () => {
        if (selectedShippingIndex === null) {
            message.error('Please select a shipping address.');
            return;
        }
        if (selectedBillingIndex === null) {
            message.error('Please select a billing address.');
            return;
        }
        setStep('review');
    };

    const handlePlaceOrder = async () => {
        if (selectedShippingIndex === null || selectedBillingIndex === null) {
            message.error('Address selection is missing.');
            return;
        }

        const shippingAddressId = addresses[selectedShippingIndex].id;
        const billingAddressId = addresses[selectedBillingIndex].id;

        const orderData = {
            userId,
            totalAmount,
            status: 'Pending',
            shippingAddressId,
            billingAddressId,
            orderNotes,
            trackingNumber: '',
            shippingProvider: '',
            orderItems: cartItems.map(item => ({
                productId: item.productId,
                productVariantId: item.productVariantId,
                quantity: item.quantity,
                price: item.price,
            })),
        };

        try {
            await onPlaceOrder(orderData);
        } catch (error) {
            message.error('Failed to place order.');
            console.error(error);
        }
    };

    const formatAddress = (address: Address): string => {
        return [address.line1, address.line2, address.city, address.state, address.postalCode, address.country]
            .filter(Boolean)
            .join(', ');
    };

    const renderAddressOptions = (selectedIndex: number | null, setSelectedIndex: (index: number) => void) => {
        if (loadingAddresses) {
            return <Spin />;
        }

        if (errorLoadingAddresses) {
            return <div style={{ color: 'red' }}>{errorLoadingAddresses}</div>;
        }

        if (!Array.isArray(addresses) || addresses.length === 0) {
            return <div>No addresses found. Please add an address first.</div>;
        }

        return (
            <Radio.Group
                onChange={e => setSelectedIndex(e.target.value)}
                value={selectedIndex}
                style={{ marginBottom: 20 }}
            >
                {addresses.map((addr, index) => (
                    <Radio
                        key={addr.id}
                        value={index}
                        style={{ display: 'block', marginBottom: 8 }}
                    >
                        {formatAddress(addr)}
                    </Radio>
                ))}
            </Radio.Group>
        );
    };

    const selectedShippingAddress = selectedShippingIndex !== null ? addresses[selectedShippingIndex] : null;
    const selectedBillingAddress = selectedBillingIndex !== null ? addresses[selectedBillingIndex] : null;

    return (
        <div style={{ maxWidth: 600, margin: 'auto' }}>
            {step === 'address' && (
                <>
                    <h2>Select Shipping Address</h2>
                    {renderAddressOptions(selectedShippingIndex, setSelectedShippingIndex)}

                    <h2>Select Billing Address</h2>
                    {renderAddressOptions(selectedBillingIndex, setSelectedBillingIndex)}

                    <Button
                        type="primary"
                        onClick={handleNext}
                        disabled={selectedShippingIndex === null || selectedBillingIndex === null}
                    >
                        Next
                    </Button>
                </>
            )}

            {step === 'review' && (
                <>
                    <h2>Order Review</h2>
                    
                    <div style={{ marginBottom: 16 }}>
                        <h3>Shipping Address:</h3>
                        <p>{selectedShippingAddress && formatAddress(selectedShippingAddress)}</p>
                    </div>
                    
                    <div style={{ marginBottom: 16 }}>
                        <h3>Billing Address:</h3>
                        <p>{selectedBillingAddress && formatAddress(selectedBillingAddress)}</p>
                    </div>
                    
                    <List
                        bordered
                        dataSource={cartItems}
                        renderItem={item => (
                            <List.Item>
                                <div>
                                    {item.productName} x {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}
                                </div>
                            </List.Item>
                        )}
                    />
                    <Divider />
                    <div>
                        <strong>Total: ₹{totalAmount.toFixed(2)}</strong>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <Input.TextArea
                            rows={3}
                            placeholder="Order notes (optional)"
                            value={orderNotes}
                            onChange={e => setOrderNotes(e.target.value)}
                        />
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <Button onClick={() => setStep('address')} style={{ marginRight: 8 }}>
                            Back
                        </Button>
                        <Button type="primary" onClick={handlePlaceOrder}>
                            Place Order
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Checkout;
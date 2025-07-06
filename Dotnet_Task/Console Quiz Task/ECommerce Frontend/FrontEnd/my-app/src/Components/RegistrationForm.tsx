import React, { useState } from 'react';
import { Form, Input, Button, Typography, InputNumber, Row, Col, Select, Collapse, message, Divider } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  DollarOutlined, 
  HomeOutlined, 
  GlobalOutlined, 
  ShopOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface RegistrationFormValues {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  balance?: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  shopName?: string;
  shopDetails?: string;
  shopLine1?: string;
  shopLine2?: string;
  shopCity?: string;
  shopState?: string;
  shopPostalCode?: string;
  shopCountry?: string;
  IsSupplier?: boolean;
}

const apiUrl = import.meta.env.VITE_API_URL;

// Custom theme colors for e-commerce feel
const colors = {
  primary: '#ff6b6b',        // Vibrant coral red
  secondary: '#4ecdc4',      // Teal accent
  background: '#f9f9f9',     // Light gray background
  dark: '#2d3436',           // Dark charcoal for text
  light: '#ffffff',          // White
  neutral: '#dfe6e9',        // Light gray for borders
  panelHeader: '#f8f9fa',    // Very light gray for panel headers
  shadow: '0 8px 24px rgba(0, 0, 0, 0.08)'
};

const RegistrationForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const onFinish = (values: RegistrationFormValues) => {
    const payload = {
      FirstName: values.firstName,
      LastName: values.lastName,
      Email: values.email,
      Password: values.password,
      PhoneNumber: values.phoneNumber,
      Role: values.role,
      Balance: values.balance,
      Line1: values.addressLine1,
      Line2: values.addressLine2,
      City: values.city,
      State: values.state,
      PostalCode: values.postalCode,
      Country: values.country
    }

    if (values.role === 'supplier') {
      Object.assign(payload, {
        ShopName: values.shopName,
        ShopDetails: values.shopDetails,
        ShopLine1: values.shopLine1,
        ShopLine2: values.shopLine2,
        ShopCity: values.shopCity,
        ShopState: values.shopState,
        ShopPostalCode: values.shopPostalCode,
        ShopCountry: values.shopCountry,
        IsSupplier: true
      });
    }

    axios.post(`${apiUrl}/api/auth/register`, payload)
    .then(response => {
      console.log("Registration successful:", response.data);
      if (response.data.success) {
        message.success("User registered successfully");
        form.resetFields();
        navigate("/login");
      } else {
        message.error(response.data.message);
      }
    })
    .catch(error => {
      const errorMessage = error.response?.data || "Registration failed. Please try again.";
      message.error(errorMessage);
      console.error("Registration error:", errorMessage);
    });
  
  };

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
  };

  // Custom collapse panel styles
  const customPanelStyle = {
    background: colors.panelHeader,
    borderRadius: '8px',
    marginBottom: '16px',
    border: `1px solid ${colors.neutral}`,
    overflow: 'hidden',
  };

  // Custom input style
  const inputStyle = {
    borderRadius: '8px',
    height: '42px',
    borderColor: colors.neutral,
    backgroundColor: colors.light,
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '900px',
      margin: '40px auto',
      padding: '0 20px',
    }}>
      <div style={{
        backgroundColor: colors.light,
        borderRadius: '12px',
        boxShadow: colors.shadow,
        padding: '40px',
        border: `1px solid ${colors.neutral}`,
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '72px', 
            height: '72px', 
            borderRadius: '50%', 
            background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`, 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
          }}>
            <ShoppingOutlined style={{ fontSize: '36px', color: colors.light }} />
          </div>
          <Title level={2} style={{ 
            marginBottom: '8px', 
            fontWeight: 700, 
            color: colors.dark 
          }}>
            Create an Account
          </Title>
          <Text style={{ fontSize: '16px', color: '#777' }}>
            Join our shopping community today
          </Text>
        </div>

        <Form
          form={form}
          name="registration"
          layout="vertical"
          onFinish={onFinish}
          scrollToFirstError
          requiredMark={false}
        >
          <Form.Item
            name="role"
            label={<span style={{ fontSize: '16px', fontWeight: 500 }}>Register as</span>}
            rules={[{ required: true, message: 'Please select your role' }]}
            style={{ marginBottom: '24px' }}
          >
            <Select
              placeholder="Select your role"
              onChange={handleRoleChange}
              size="large"
              style={{ 
                borderRadius: '8px',
                fontSize: '16px'
              }}
              dropdownStyle={{ borderRadius: '8px' }}
            >
              <Select.Option value="customer">Customer</Select.Option>
              <Select.Option value="supplier">Supplier</Select.Option>
            </Select>
          </Form.Item>

          <Collapse 
            defaultActiveKey={['personalInfo']} 
            style={{ marginBottom: '24px', background: 'none', border: 'none' }}
            bordered={false}
          >
            <Panel 
              header={
                <span style={{ 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  color: colors.dark 
                }}>
                  Personal Information
                </span>
              } 
              key="personalInfo"
              style={customPanelStyle}
            >
              <div style={{ padding: '16px 8px 0' }}>
                <Row gutter={24}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="firstName"
                      label={<span style={{ fontWeight: 500 }}>First Name</span>}
                      rules={[{ required: true, message: 'Please enter your first name' }]}
                    >
                      <Input 
                        prefix={<UserOutlined style={{ color: '#bbb' }} />} 
                        placeholder="First Name" 
                        style={inputStyle}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="lastName"
                      label={<span style={{ fontWeight: 500 }}>Last Name</span>}
                      rules={[{ required: true, message: 'Please enter your last name' }]}
                    >
                      <Input 
                        prefix={<UserOutlined style={{ color: '#bbb' }} />} 
                        placeholder="Last Name" 
                        style={inputStyle}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="email"
                  label={<span style={{ fontWeight: 500 }}>Email</span>}
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined style={{ color: '#bbb' }} />} 
                    placeholder="Email" 
                    style={inputStyle}
                  />
                </Form.Item>

                <Row gutter={24}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="password"
                      label={<span style={{ fontWeight: 500 }}>Password</span>}
                      rules={[
                        { required: true, message: 'Please enter a password' },
                        { min: 8, message: 'Password must be at least 8 characters' }
                      ]}
                      hasFeedback
                    >
                      <Input.Password 
                        prefix={<LockOutlined style={{ color: '#bbb' }} />} 
                        placeholder="Password" 
                        style={inputStyle}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="confirmPassword"
                      label={<span style={{ fontWeight: 500 }}>Confirm Password</span>}
                      dependencies={['password']}
                      hasFeedback
                      rules={[
                        { required: true, message: 'Please confirm your password' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords do not match'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password 
                        prefix={<LockOutlined style={{ color: '#bbb' }} />} 
                        placeholder="Confirm Password" 
                        style={inputStyle}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="phoneNumber"
                      label={<span style={{ fontWeight: 500 }}>Phone Number</span>}
                      rules={[{ required: true, message: 'Please enter your phone number' }]}
                    >
                      <Input 
                        prefix={<PhoneOutlined style={{ color: '#bbb' }} />} 
                        placeholder="Phone Number" 
                        style={inputStyle}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="balance"
                      label={<span style={{ fontWeight: 500 }}>Balance</span>}
                      rules={
                        selectedRole === 'customer'
                          ? [{ required: true, message: 'Please enter your initial balance' }]
                          : []
                      }
                    >
                      <InputNumber
                        prefix={<DollarOutlined style={{ color: '#bbb' }} />}
                        placeholder="Balance"
                        style={{ ...inputStyle, width: '100%' }}
                        formatter={(value) =>
                          `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                        }
                        parser={(value) =>
                          value ? value.replace(/\$\s?|(,*)/g, '') : ''
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Panel>
          </Collapse>

          <Collapse 
            defaultActiveKey={['addressInfo']} 
            style={{ marginBottom: '24px', background: 'none', border: 'none' }}
            bordered={false}
          >
            <Panel 
              header={
                <span style={{ 
                  fontSize: '18px', 
                  fontWeight: 600, 
                  color: colors.dark 
                }}>
                  Address Information
                </span>
              } 
              key="addressInfo"
              style={customPanelStyle}
            >
              <div style={{ padding: '16px 8px 0' }}>
                <Form.Item
                  name="addressLine1"
                  label={<span style={{ fontWeight: 500 }}>Address Line 1</span>}
                  rules={[{ required: true, message: 'Please enter your address' }]}
                >
                  <Input 
                    prefix={<HomeOutlined style={{ color: '#bbb' }} />} 
                    placeholder="Address Line 1" 
                    style={inputStyle}
                  />
                </Form.Item>

                <Form.Item
                  name="addressLine2"
                  label={<span style={{ fontWeight: 500 }}>Address Line 2</span>}
                >
                  <Input 
                    prefix={<HomeOutlined style={{ color: '#bbb' }} />} 
                    placeholder="Address Line 2 (Optional)" 
                    style={inputStyle}
                  />
                </Form.Item>

                <Row gutter={24}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="city"
                      label={<span style={{ fontWeight: 500 }}>City</span>}
                      rules={[{ required: true, message: 'Please enter your city' }]}
                    >
                      <Input 
                        placeholder="City" 
                        style={inputStyle}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="state"
                      label={<span style={{ fontWeight: 500 }}>State/Province</span>}
                      rules={[{ required: true, message: 'Please enter your state' }]}
                    >
                      <Input 
                        placeholder="State/Province" 
                        style={inputStyle}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="postalCode"
                      label={<span style={{ fontWeight: 500 }}>Postal Code</span>}
                      rules={[{ required: true, message: 'Please enter your postal code' }]}
                    >
                      <Input 
                        placeholder="Postal Code" 
                        style={inputStyle}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="country"
                      label={<span style={{ fontWeight: 500 }}>Country</span>}
                      rules={[{ required: true, message: 'Please enter your country' }]}
                    >
                      <Input 
                        prefix={<GlobalOutlined style={{ color: '#bbb' }} />} 
                        placeholder="Country" 
                        style={inputStyle}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Panel>
          </Collapse>

          {selectedRole === 'supplier' && (
            <Collapse 
              defaultActiveKey={['shopInfo']} 
              style={{ marginBottom: '24px', background: 'none', border: 'none' }}
              bordered={false}
            >
              <Panel 
                header={
                  <span style={{ 
                    fontSize: '18px', 
                    fontWeight: 600, 
                    color: colors.dark 
                  }}>
                    Shop Details
                  </span>
                } 
                key="shopInfo"
                style={customPanelStyle}
              >
                <div style={{ padding: '16px 8px 0' }}>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item
                        name="shopName"
                        label={<span style={{ fontWeight: 500 }}>Shop Name</span>}
                        rules={[{ required: true, message: 'Please enter your shop name' }]}
                      >
                        <Input 
                          prefix={<ShopOutlined style={{ color: '#bbb' }} />} 
                          placeholder="Shop Name" 
                          style={inputStyle}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="shopDetails"
                    label={<span style={{ fontWeight: 500 }}>Shop Details</span>}
                    rules={[{ required: true, message: 'Please enter shop details' }]}
                  >
                    <Input.TextArea 
                      rows={4} 
                      placeholder="Shop Description/Details" 
                      style={{ borderRadius: '8px', borderColor: colors.neutral }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="shopLine1"
                    label={<span style={{ fontWeight: 500 }}>Shop Address Line 1</span>}
                    rules={[{ required: true, message: 'Please enter shop address' }]}
                  >
                    <Input 
                      prefix={<HomeOutlined style={{ color: '#bbb' }} />} 
                      placeholder="Shop Address Line 1" 
                      style={inputStyle}
                    />
                  </Form.Item>

                  <Form.Item
                    name="shopLine2"
                    label={<span style={{ fontWeight: 500 }}>Shop Address Line 2</span>}
                  >
                    <Input 
                      prefix={<HomeOutlined style={{ color: '#bbb' }} />} 
                      placeholder="Shop Address Line 2 (Optional)" 
                      style={inputStyle}
                    />
                  </Form.Item>

                  <Row gutter={24}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="shopCity"
                        label={<span style={{ fontWeight: 500 }}>Shop City</span>}
                        rules={[{ required: true, message: 'Please enter shop city' }]}
                      >
                        <Input 
                          placeholder="Shop City" 
                          style={inputStyle}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="shopState"
                        label={<span style={{ fontWeight: 500 }}>Shop State/Province</span>}
                        rules={[{ required: true, message: 'Please enter shop state' }]}
                      >
                        <Input 
                          placeholder="Shop State/Province" 
                          style={inputStyle}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="shopPostalCode"
                        label={<span style={{ fontWeight: 500 }}>Shop Postal Code</span>}
                        rules={[{ required: true, message: 'Please enter shop postal code' }]}
                      >
                        <Input 
                          placeholder="Shop Postal Code" 
                          style={inputStyle}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="shopCountry"
                        label={<span style={{ fontWeight: 500 }}>Shop Country</span>}
                        rules={[{ required: true, message: 'Please enter shop country' }]}
                      >
                        <Input 
                          prefix={<GlobalOutlined style={{ color: '#bbb' }} />} 
                          placeholder="Shop Country" 
                          style={inputStyle}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Panel>
            </Collapse>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ 
                width: '100%', 
                height: '48px', 
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '16px',
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                border: 'none',
                boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
                marginTop: '16px' 
              }}
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: '32px 0 24px', borderColor: colors.neutral }} />
      
        <div style={{ textAlign: 'center' }}>
          <Text style={{ fontSize: '15px', color: '#777' }}>
            Already registered?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: colors.primary }}>
              Sign in to your account
            </Link>
          </Text>
        </div>
      </div>
      
      <Text style={{ 
        display: 'block',
        textAlign: 'center', 
        marginTop: '24px', 
        color: '#777',
        fontSize: '13px'
      }}>
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
      </Text>
    </div>
  );
};

export default RegistrationForm;
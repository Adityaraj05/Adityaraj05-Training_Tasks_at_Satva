import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Card, Checkbox, Space, Spin, Alert } from 'antd';
import { MailOutlined, LockOutlined, LoginOutlined, UserOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
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
};

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const onFinish = (values: LoginFormValues) => {
    setLoading(true);
    setError(null);
    
    axios.post(`${apiUrl}/api/auth/login`, {
      email: values.email,
      password: values.password
    }, {
      withCredentials: true,
    })
    .then(response => {
      const accessToken = response.data.accessToken;
      const roles = response.data.roles;
      const name = response.data.name;
      const id = response.data.id;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("roles", JSON.stringify(roles));
      localStorage.setItem("name", name);
      localStorage.setItem("id", id);
      if (values.remember) {
        localStorage.setItem("rememberedEmail", values.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      message.success({
        content: "Login successful! Redirecting...",
        icon: <LoginOutlined />,
        duration: 2
      });
      
      setTimeout(() => {
        navigate('/app', { replace: true });
      }, 1000);
    })
    .catch(error => {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      form.setFieldsValue({ email: rememberedEmail, remember: true });
    }
  }, [form]);

  return (
    <div style={{
      width: '100%',
      maxWidth: '500px',
      margin: '0 auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: colors.background,
      backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(249,249,249,0.8) 100%)',
    }}>
      <Card
        bordered={false}
        style={{
          borderRadius: '12px',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)',
          backgroundColor: colors.light,
          overflow: 'hidden',
          border: `1px solid ${colors.neutral}`,
        }}
        bodyStyle={{ padding: '40px 32px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <div style={{ 
              width: '72px', 
              height: '72px', 
              borderRadius: '50%', 
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`, 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
            }}>
              <ShoppingOutlined style={{ fontSize: '36px', color: colors.light }} />
            </div>
            <Title level={2} style={{ margin: '10px 0 0 0', fontWeight: 700, color: colors.dark }}>
              Welcome Back
            </Title>
            <Text style={{ fontSize: '16px', color: '#777' }}>Sign in to your shopping account</Text>
          </Space>
        </div>

        {error && (
          <Alert
            message="Login Error"
            description={error}
            type="error"
            showIcon
            closable
            style={{ 
              marginBottom: '24px', 
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}
            onClose={() => setError(null)}
          />
        )}

        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ remember: false }}
          style={{ marginTop: '8px' }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
            style={{ marginBottom: '24px' }}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#bbb' }} />} 
              placeholder="Email" 
              size="large"
              autoComplete="email"
              style={{ 
                borderRadius: '8px', 
                height: '48px',
                backgroundColor: '#fafafa',
                borderColor: colors.neutral,
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
            style={{ marginBottom: '24px' }}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#bbb' }} />} 
              placeholder="Password" 
              size="large"
              autoComplete="current-password"
              style={{ 
                borderRadius: '8px', 
                height: '48px',
                backgroundColor: '#fafafa',
                borderColor: colors.neutral,
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox style={{ color: colors.dark }}>Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" style={{ color: colors.primary, fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>
          </Form.Item>

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
                boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
                background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
                border: 'none',
              }}
              icon={loading ? null : <LoginOutlined />}
              disabled={loading}
            >
              {loading ? <Spin size="small" /> : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '32px',
          paddingTop: '16px',
          borderTop: `1px solid ${colors.neutral}` 
        }}>
          <Text style={{ fontSize: '15px', color: '#777' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: colors.primary }}>
              Create account
            </Link>
          </Text>
        </div>
      </Card>
      
      <Text style={{ textAlign: 'center', marginTop: '30px', fontSize: '13px', color: '#777' }}>
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
      </Text>
    </div>
  );
};

export default LoginForm;
import { useState } from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"; 

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { name: string; email: string; password: string }) => {
    setLoading(true);

    setTimeout(async () => {
 
      const users = JSON.parse(localStorage.getItem("users") || "[]");

      // Check if the email already exists
      const existingUser = users.find((u: any) => u.email === values.email);
      if (existingUser) {
        message.error("User with this email already exists!");
        setLoading(false);
        return;
      }

      // ✅ Hash the password before storing
      const hashedPassword = await bcrypt.hash(values.password, 10);

      // Add new user to local storage with hashed password
      const newUser = { ...values, password: hashedPassword, createdAt: new Date().toISOString() };
      localStorage.setItem("users", JSON.stringify([...users, newUser]));

      message.success("Registration successful! Redirecting to login...");
      setLoading(false);

    
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    }, 1500);
  };

  return (
    <Card title="Register" style={{ width: 400, margin: "auto", marginTop: 50 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter your name" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter a password" }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Register
        </Button>
      </Form>

      {/* ✅ Login Link */}
      <Typography.Paragraph style={{ marginTop: 10, textAlign: "center" }}>
        Already have an account? <Link to="/login">Login here</Link>
      </Typography.Paragraph>
    </Card>
  );
};

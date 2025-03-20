import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"; 
import { generateToken } from "../utils/auth"; 

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setTimeout(async () => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");

    
      const user = users.find((u: any) => u.email === values.email);

      if (!user) {
        message.error("Invalid email or password!");
        setLoading(false);
        return;
      }

      const isMatch = await bcrypt.compare(values.password, user.password);
      if (!isMatch) {
        message.error("Invalid email or password!");
        setLoading(false);
        return;
      }

      // ✅ Generate JWT Token
      const token = await generateToken({ email: user.email, id: user.id });

      localStorage.setItem("token", token); // 

      message.success("Login successful!");
      navigate("/dashboard/products", { replace: true }); 
    }, 1000);
  };

  return (
    <Card title="Login" style={{ width: 400, margin: "auto", marginTop: 50 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email", message: "Please enter your email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Login
        </Button>
      </Form>
    </Card>
  );
};

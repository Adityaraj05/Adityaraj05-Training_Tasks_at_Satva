import { Form, Input, Button, message, Card, Typography } from "antd";
import { useDispatch } from "react-redux";
import { signUp } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { AppDispatch } from "../store/store"; 

const { Title, Text } = Typography;

const Signup = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await dispatch(signUp({ email: values.email, password: values.password })).unwrap();
      message.success("Signup successful! Please log in.");
      navigate("/login");
    } catch (error) {
      if (error === "Email already exists") {
        message.error("This email is already registered. Try logging in.");
      } else {
        message.error("Signup failed. Try again.");
      }
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card style={{ width: 400, padding: 20, textAlign: "center" }}>
        <Title level={2}>Sign Up</Title>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}>
            <Input placeholder="Enter your email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true, min: 6, message: "Password must be at least 6 characters!" }]}>
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Sign Up</Button>
          </Form.Item>
        </Form>
        <Text>
          Already have an account? <Link to="/login">Login</Link>
        </Text>
      </Card>
    </div>
  );
};

export default Signup;

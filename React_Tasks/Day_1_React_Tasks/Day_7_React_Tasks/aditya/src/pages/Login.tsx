import { Form, Input, Button, message, Card, Typography, Row, Col } from "antd";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { AppDispatch } from "../store/store";

const { Text } = Typography;

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // ✅ Form Submission
  const onFinish = async (values: { email: string; password: string }) => {
    try {
      await dispatch(login(values)).unwrap();
      message.success("Login successful!");
      navigate("/jobs"); // ✅ Redirect to jobs page
    } catch (error) {
      // Error handling is done in the thunk itself
    }
  };

  return (
    <Row justify="center" align="middle" style={{ height: "100vh", background: "#f5f5f5", padding: "20px" }}>
      <Col xs={24} sm={20} md={12} lg={8}>
        <Card title="Login" variant="outlined" style={{ borderRadius: "8px", padding: "20px", textAlign: "center", width: 400 }}>
          <Form layout="vertical" onFinish={onFinish}>
            {/* Email Input */}
            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email!" }]}>
              <Input placeholder="Enter your email" />
            </Form.Item>

            {/* Password Input */}
            <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password!" }]}>
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            {/* Login Button */}
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Login
              </Button>
            </Form.Item>
          </Form>

          {/* ✅ "Go to Signup" Link (Matches Signup Page) */}
          <Text>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </Text>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
import { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";
import { SignJWT } from "jose";
import styles from "./Auth.module.css";

const { Title, Text } = Typography;
const SECRET_KEY = "abcdefghjkl";
export interface UserType {
    name?: string;
    email: string;
    password: string;
    cpassword?: string;
}

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const createToken = async (payload: Record<string, unknown>) => {
        const secret = new TextEncoder().encode(SECRET_KEY);
        return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1h")
            .sign(secret);
    };

    const onFinish = async (values: UserType) => {
        setLoading(true);

        setTimeout(async () => {
            try {
                const users = JSON.parse(localStorage.getItem("users") || "[]");

                if (!isLogin) {
                    const { name, email, password, cpassword } = values;

                    if (password !== cpassword) {
                        message.error("Passwords do not match");
                        setLoading(false);
                        return;
                    }
                    if (users.some((u: UserType) => u.email === email)) {
                        message.error("User already exists!!");
                        setLoading(false);
                        return;
                    }

                    const hashedPassword = await bcrypt.hash(password, 10);
                    const newUser = { id: Date.now(), name, email, password: hashedPassword };
                    users.push(newUser);
                    localStorage.setItem("users", JSON.stringify(users));

                    const token = await createToken({ id: newUser.id, email });
                    localStorage.setItem("token", token);

                    message.success("Signup Successful!");
                    setIsLogin(true);
                } else {
                    const { email, password } = values;
                    const user = users.find((u: UserType) => u.email === email);

                    if (!user) {
                        message.error("Invalid Email or Password");
                    } else if (await bcrypt.compare(password, user.password)) {
                        const token = await createToken({ id: user.id, email });
                        localStorage.setItem("token", token);

                        message.success("Login Successful!");
                        navigate("/dashboard");
                    } else {
                        message.error("Invalid credentials");
                    }
                }

                form.resetFields();
                setIsLogin(true);
            } catch {
                message.error("Something went wrong!");
            } finally {
                setLoading(false);
            }
        }, 1000);
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        form.resetFields();
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
            <Card style={{ width: 400, textAlign: "center" }}>
                <Title level={3}>{isLogin ? "Login" : "Sign Up"}</Title>
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    {!isLogin && (
                        <Form.Item
                            label="Full Name"
                            name="name"
                            className={styles.customFormItem}
                            rules={[{ required: true, message: "Please enter your name" },
                            { max: 15, message: "Name should not exceed 15 characters" },
                            { min: 3, message: "Name should not be less than 3 characters" }
                            ]}
                        >
                            <Input placeholder="Enter your full name" />
                        </Form.Item>
                    )}

                    <Form.Item
                        label="Email"
                        name="email"
                        className={styles.customFormItem}
                        rules={[{ required: true, message: "Please enter your email" },
                        {
                            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                            message: "Invalid email format",
                        }]}
                    >
                        <Input type="email" placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        className={styles.customFormItem}
                        rules={[{ required: true, message: "Please enter your password" },
                        { min: 6, message: "Password must be at least 6 characters" },
                        { max: 12, message: "Password must be at most 12 characters" },


                        ]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    {!isLogin && (
                        <Form.Item
                            label="Confirm Password"
                            name="cpassword"
                            className={styles.customFormItem}
                            rules={[{ required: true, message: "Please confirm your password" }]}
                        >
                            <Input.Password placeholder="Enter your confirm password" />
                        </Form.Item>
                    )}

                    <Button type="primary" htmlType="submit" style={{ marginTop: 12 }} block loading={loading}>
                        {isLogin ? "Login" : "Sign Up"}
                    </Button>
                </Form>

                <Text style={{ display: "block", marginTop: 15 }}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <a onClick={toggleForm} style={{ cursor: "pointer" }}>
                        {isLogin ? "Sign up" : "Login"}
                    </a>
                </Text>
            </Card>
        </div>
    );
};

export default Auth;

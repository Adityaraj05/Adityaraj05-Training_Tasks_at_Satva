import React, { useState, useEffect } from 'react';
import img from "../../../public/Log-in-Vector.svg";
import {
    Layout,
    Row,
    Col,
    Typography,
    Form,
    Input,
    Button,
    message
} from 'antd';
import {
    MailOutlined,
    LockOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
    UserOutlined,
    PhoneOutlined,
    BankOutlined
} from '@ant-design/icons';
import styles from './Auth.module.scss';
import apiService from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;
const { Content } = Layout;

// Type definitions for form values
interface LoginFormValues {
    email: string;
    password: string;
}

interface SignupFormValues extends LoginFormValues {
    name: string;
    companyName: string;
    phoneNumber: string;
    confirmPassword: string;
}

interface AuthResponse {
    responseStatus: number;
    message: string;
    result?: {
        access_token: string;
        refreshToken: string;
        userDetails: {
            group: any;
            tenant: any;
            roleName: string;
            isActive: boolean;
        }
    }
}

const Auth: React.FC = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    useEffect(() => {
        form.resetFields();
    }, [isSignup, form]);

    const saveInfo = (data: any) => {
        if (!data) return;
        localStorage.setItem("BearerToken", data?.access_token || "");
        localStorage.setItem("GroupDetail", JSON.stringify(data?.userDetails?.group || {}));
        localStorage.setItem("RefreshToken", data?.refreshToken || "");
        localStorage.setItem("Tenant", JSON.stringify(data?.userDetails?.tenant || {}));
        localStorage.setItem("UserInfo", JSON.stringify(data?.userDetails || {}));
        localStorage.setItem("UserRole", data?.userDetails?.roleName || "");
        localStorage.setItem("emailVerified", JSON.stringify(data?.userDetails?.isActive || false));
    };

    const onFinish = async (values: LoginFormValues | SignupFormValues) => {
        try {
            if (isSignup) {
                console.log(values)
                const signupValues = values as SignupFormValues;
                const signupData = {
                    name: signupValues.name,
                    email: signupValues.email,
                    companyName: signupValues.companyName,
                    phoneNumber: signupValues.phoneNumber,
                    password: signupValues.password,
                    isAcceptTerms: true,
                    tenant: {
                        id: "67b786e1271881833469e504",
                        name: signupValues.companyName || "Satvaaa",
                        currency: {
                            name: "USD",
                            symbol: "$",
                            code: "USD",
                            price_precision: 2
                        }
                    }
                };
                const response = await apiService.post("/api/Authenticate/Register", signupData);
                console.log(response)
                if (response.responseStatus === 3) {
                    message.success(response?.message || "Registration Successful");
                    setIsSignup(false);
                    form.resetFields();
                } else {
                    message.error(response?.message || "Registration Failed");
                }
            } else {
                // Handle login
                const loginValues = values as LoginFormValues;
                const response = await apiService.post<AuthResponse>("/api/Authenticate/Login", loginValues);
                if (response.responseStatus === 3) {
                    saveInfo(response?.result);
                    message.success(response?.message || "Login Success");
                    navigate("/home");
                } else {
                    message.error(response?.message || "Login Failed");
                }
            }
        } catch (error) {
            console.error("Authentication error:", error);
            message.error("Authentication failed. Please try again later.");
        }
    };

    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Phone validation regex (simple version)
    const phoneRegex = /^\+?[0-9]{10,15}$/;

    return (
        <Layout className={styles.loginLayout}>
            <Content>
                <Row justify="center" align="middle" className={styles.loginContainer}>
                    <Col xs={0} sm={0} md={12} lg={12} xl={10} className={styles.leftSection}>
                        <div className={styles.illustrationContainer}>
                            <img
                                src={img}
                                alt="Login illustration"
                                className={styles.loginIllustration}
                            />
                        </div>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12} xl={14} className={styles.rightSection}>
                        <div className={styles.loginFormContainer}>
                            <div className={styles.logoContainer}>
                                <span className={styles.logoText}>
                                    <span className={styles.gatherText}>GATHER</span>
                                    <span className={styles.nexusText}>.nexus</span>
                                </span>
                            </div>

                            <Title level={2} className={styles.signInTitle}>
                                {isSignup ? "Sign up" : "Sign in"}
                            </Title>

                            <Text className={styles.welcomeText}>
                                Welcome to <strong>GATHER.nexus</strong>! Please Enter your Details.
                            </Text>

                            <Form
                                form={form}
                                name={isSignup ? "signup_form" : "login_form"}
                                className={styles.loginForm}
                                onFinish={onFinish}
                                layout="vertical"
                            >
                                {isSignup && (
                                    <div className={styles.inputGroup}>
                                        <Form.Item
                                            label={<span className={styles.formLabel}>Name<span className={styles.required}>*</span></span>}
                                            name="name"
                                            rules={[
                                                { required: true, message: 'Please enter your name' },
                                                { min: 2, message: 'Name must be at least 2 characters' }
                                            ]}
                                        >
                                            <Input
                                                placeholder="Enter your name"
                                                className={styles.inputField}
                                                prefix={<UserOutlined className={styles.siteFormItemIcon} />}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label={<span className={styles.formLabel}>Full Company Name<span className={styles.required}>*</span></span>}
                                            name="companyName"
                                            rules={[
                                                { required: true, message: 'Please enter your company name' },
                                                { min: 2, message: 'Company name must be at least 2 characters' }
                                            ]}
                                        >
                                            <Input
                                                placeholder="Enter your company name"
                                                className={styles.inputField}
                                                prefix={<BankOutlined className={styles.siteFormItemIcon} />}
                                            />
                                        </Form.Item>
                                    </div>
                                )}

                                <div className={styles.inputGroup}>
                                    <Form.Item
                                        label={<span className={styles.formLabel}>Email Address<span className={styles.required}>*</span></span>}
                                        name="email"
                                        rules={[
                                            { required: true, message: 'Please enter your email address' },
                                            {
                                                pattern: emailRegex,
                                                message: 'Please enter a valid email address'
                                            }
                                        ]}
                                    >
                                        <Input
                                            placeholder="Enter your email address"
                                            className={styles.inputField}
                                            style={{ width: !isSignup ? "415px" : "100%" }}
                                            prefix={<MailOutlined className={styles.siteFormItemIcon} />}
                                        />
                                    </Form.Item>

                                    {isSignup && (
                                        <Form.Item
                                            label={<span className={styles.formLabel}>Phone Number<span className={styles.required}>*</span></span>}
                                            name="phoneNumber"
                                            rules={[
                                                { required: true, message: 'Please enter your phone number' },
                                                {
                                                    pattern: phoneRegex,
                                                    message: 'Please enter a valid phone number'
                                                }
                                            ]}
                                        >
                                            <Input
                                                placeholder="Enter your phone number"
                                                className={styles.inputField}
                                                prefix={<PhoneOutlined className={styles.siteFormItemIcon} />}
                                            />
                                        </Form.Item>
                                    )}
                                </div>

                                <div className={styles.inputGroup}>
                                    <Form.Item
                                        label={<span className={styles.formLabel}>Password<span className={styles.required}>*</span></span>}
                                        name="password"
                                        rules={[
                                            { required: true, message: 'Please enter your password' },
                                            { min: 8, message: 'Password must be at least 8 characters' }
                                        ]}
                                    >
                                        <Input.Password
                                            placeholder="Type your password"
                                            className={styles.inputField}
                                            style={{ width: !isSignup ? "415px" : "100%" }}
                                            prefix={<LockOutlined className={styles.siteFormItemIcon} />}
                                            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                        />
                                    </Form.Item>

                                    {isSignup && (
                                        <Form.Item
                                            label={<span className={styles.formLabel}>Confirm Password<span className={styles.required}>*</span></span>}
                                            name="confirmPassword"
                                            dependencies={['password']}
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
                                                placeholder="Confirm your password"
                                                className={styles.inputField}
                                                prefix={<LockOutlined className={styles.siteFormItemIcon} />}
                                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                            />
                                        </Form.Item>
                                    )}
                                </div>

                                {!isSignup && (
                                    <div className={styles.forgotPasswordContainer}>
                                        <Link
                                            href="/auth/forgot-password"
                                            className={styles.forgotPasswordLink}
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>
                                )}

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className={styles.signInButton}
                                        block
                                    >
                                        {isSignup ? "Sign Up" : "Sign In"}
                                    </Button>
                                </Form.Item>

                                <div className={styles.signupSection}>
                                    <Text>{isSignup ? "Already have an account? " : "Don't have an account yet? "}</Text>
                                    <Link
                                        href="#"
                                        className={styles.signupLink}
                                        onClick={() => {
                                            setIsSignup(!isSignup);
                                        }}
                                    >
                                        {isSignup ? "Sign in" : "Sign up Today!"}
                                    </Link>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default Auth;
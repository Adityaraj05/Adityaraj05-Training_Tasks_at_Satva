import React from 'react';
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
import { MailOutlined } from '@ant-design/icons';
import styles from './../Auth/Auth.module.scss'; 
import apiService from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Link } = Typography;
const { Content } = Layout;

const ForgotPassword: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const handleForgotPassword = async (values: { email: string }) => {
        try {
            console.log("ss")
            const response = await apiService.post(`/api/Authenticate/ForgotPassword?email=${values.email}`, { email: values.email });
            console.log(values)
            if (response.responseStatus === 3) {
                message.success(response?.message || "Password reset instructions sent to your email");
                // Optionally redirect to login page after successful submission
                setTimeout(() => navigate("/"), 2000);
            } else {
                message.error(response?.message || "Failed to process password reset request");
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            message.error("Failed to process request. Please try again later.");
        }
    };

    return (
        <Layout className={styles.loginLayout}>
            <Content>
                <Row justify="center" align="middle" className={styles.loginContainer}>
                    <Col xs={0} sm={0} md={12} lg={12} xl={10} className={styles.leftSection}>
                        <div className={styles.illustrationContainer}>
                            <img
                                src={img}
                                alt="Forgot password illustration"
                                className={styles.loginIllustration}
                            />
                        </div>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12} xl={14} className={styles.rightSection}>
                        <div className={styles.loginFormContainer}>
                            <Title level={2} className={styles.signInTitle}>
                                Forgot Password
                            </Title>
                            
                            <Text className={styles.welcomeText}>
                                Please enter your registered email to reset password
                            </Text>

                            <Form
                                form={form}
                                name="forgot_password_form"
                                className={styles.loginForm}
                                onFinish={handleForgotPassword}
                                layout="vertical"
                            >
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
                                        placeholder="Enter your Email Address"
                                        // type='email'
                                        value={"sedocip109@jomspar.com"}
                                        className={styles.inputField}
                                        style={{ width: "415px" }}
                                        prefix={<MailOutlined className={styles.siteFormItemIcon} />}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        className={styles.signInButton}
                                        block
                                    >
                                        Submit
                                    </Button>
                                </Form.Item>

                                <div className={styles.signupSection}>
                                    <Text>Already a user? </Text>
                                    <Link 
                                        href="/" 
                                        className={styles.signupLink}
                                    >
                                        Log In
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

export default ForgotPassword;
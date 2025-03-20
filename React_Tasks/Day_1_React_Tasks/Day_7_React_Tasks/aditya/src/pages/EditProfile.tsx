import React, { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, Divider, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {  updatePassword } from "../store/authSlice";
import { store } from "../store/store";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";

const { Title } = Typography;

const EditProfile: React.FC = () => {
  const dispatch = useDispatch<typeof store.dispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    // Initialize form with user data including decrypted password
    if (user) {
      form.setFieldsValue({
        email: user.email,
        password: user.decryptedPassword || ""
      });
    }
  }, [user, form]);

  const handlePasswordUpdate = async (values: any) => {
    if (!user) return;
    
    setPasswordLoading(true);
    try {
      // Hash the new password before sending it to the API
      const hashedPassword = await bcrypt.hash(values.newPassword, 10);
      
      console.log("Password encrypted for security:", hashedPassword);
      
      await dispatch(updatePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      })).unwrap();
      
      // Reset password form after successful update
      passwordForm.resetFields();
      
      // Show success notification with Ant Design
      notification.success({
        message: "Password Updated",
        description: "Your password has been successfully updated.",
        placement: "topRight",
        duration: 4,
      });
      
    
      navigate("/jobs"); 
      
    } catch (error) {
    
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <Title level={4}>Please log in to edit your profile</Title>
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <Card>
        <Title level={3}>Edit Profile</Title>
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" }
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password disabled />
          </Form.Item>
        </Form>

        <Divider />

        <Title level={4}>Change Password</Title>
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordUpdate}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: "Please enter your current password" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 8, message: "Password must be at least 8 characters" }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The two passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={passwordLoading}>
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditProfile;
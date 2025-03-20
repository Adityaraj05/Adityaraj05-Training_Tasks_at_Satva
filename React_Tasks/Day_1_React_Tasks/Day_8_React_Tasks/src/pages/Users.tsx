import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Typography, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getUsers, createUser, updateUser, deleteUser } from '../api/api';
import { User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/auth';
import { hashPassword } from '../utils/auth';
import { useLocation } from 'react-router-dom'; // Import useLocation
import '../index.css'; // Import the CSS file

const { Title } = Typography;
const { Option } = Select;

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { permissions, user } = useAuth();
  const { message, modal } = App.useApp();
  const location = useLocation(); // Use useLocation

  const canAdd = hasPermission(permissions, 'users', 'add');
  const canEdit = hasPermission(permissions, 'users', 'edit');
  const canDelete = hasPermission(permissions, 'users', 'delete');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    if (email) {
      setSearchTerm(email);
    }
  }, [location.search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      // Remove password from display
      const usersWithoutPassword = data.map((user: User) => ({
        ...user,
        password: '********', // Mask password
      }));
      setUsers(usersWithoutPassword);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (user?: User) => {
    if (user) {
      setEditingId(user.id);
      form.setFieldsValue({
        ...user,
        password: '', // Clear password field for editing
      });
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const emailExists = (email: string) => {
    return users.some(user => user.email === email);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Check if email already exists
      if (!editingId && emailExists(values.email)) {
        message.error('Email already exists. Please use a different email.');
        return;
      }
      
      // Hash password if provided
      if (values.password) {
        values.password = await hashPassword(values.password);
      } else if (editingId) {
        // If editing and no password provided, remove password field
        delete values.password;
      }
      
      if (editingId) {
        await updateUser(editingId, values);
        message.success('User updated successfully');
      } else {
        if (!values.password) {
          message.error('Password is required for new users');
          return;
        }
        await createUser(values);
        message.success('User created successfully');
      }
      
      setModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      message.error('Failed to save user');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // Check if the user being deleted is the currently logged-in admin
      if (user?.id === id) {
        message.error('You cannot delete yourself.');
        return;
      }

      await deleteUser(id);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: User) => (
        <div className="flex space-x-2">
          {canEdit && (
            <Button 
              icon={<EditOutlined />} 
              onClick={() => showModal(record)}
              size="small"
            >
              Edit
            </Button>
          )}
          {canDelete && user?.id !== record.id && (
            <Button 
              danger 
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => {
                modal.confirm({
                  title: 'Are you sure you want to delete this user?',
                  onOk: () => handleDelete(record.id),
                  okText: 'Yes',
                  cancelText: 'No',
                });
              }}
            >
              Delete
            </Button>
          )}
        </div>
      ),
    },
  ];

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Users</Title>
        <div className="flex space-x-2">
          <Input
            placeholder="Search users"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: 200 }}
          />
          {canAdd && (
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => showModal()}
            >
              Add User
            </Button>
          )}
        </div>
      </div>
      
      <div className="scrollable-table-container">
        <Table 
          columns={columns} 
          dataSource={filteredUsers} 
          rowKey="id" 
          loading={loading}
        />
      </div>
      
      <Modal
        title={editingId ? 'Edit User' : 'Add User'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        okText={editingId ? 'Update' : 'Create'}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { 
                required: editingId ? false : true, 
                message: 'Please enter password' 
              }
            ]}
            extra={editingId ? "Leave blank to keep current password" : ""}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: 'Please select role' }]}
          >
            <Select>
              <Option value="Admin">Admin</Option>
              <Option value="HR">HR</Option>
              <Option value="Supervisor">Supervisor</Option>
              <Option value="Manager">Manager</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
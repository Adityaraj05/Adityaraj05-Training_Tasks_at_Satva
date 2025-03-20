import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Typography, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../api/api';
import { Employee } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/auth';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom'; // Import useLocation
import '../index.css'; // Import the CSS file

const { Title } = Typography;

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { permissions } = useAuth();
  const { message, modal } = App.useApp();
  const location = useLocation(); // Use useLocation

  const canAdd = hasPermission(permissions, 'employees', 'add');
  const canEdit = hasPermission(permissions, 'employees', 'edit');
  const canDelete = hasPermission(permissions, 'employees', 'delete');

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    if (email) {
      setSearchTerm(email);
    }
  }, [location.search]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      message.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (employee?: Employee) => {
    if (employee) {
      setEditingId(employee.id);
      form.setFieldsValue({
        ...employee,
        joinDate: dayjs(employee.joinDate),
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
  return employees.some(employee => employee.email === email);
};

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
       // Check if email already exists
    if (!editingId && emailExists(values.email)) {
      message.error('Email already exists. Please use a different email.');
      return;
    }
      
      // Format date
      if (values.joinDate) {
        values.joinDate = values.joinDate.format('YYYY-MM-DD');
      }
      
      if (editingId) {
        await updateEmployee(editingId, values);
        message.success('Employee updated successfully');
      } else {
        await createEmployee(values);
        message.success('Employee created successfully');
      }
      
      setModalVisible(false);
      form.resetFields();
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      message.error('Failed to save employee');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteEmployee(id);
      message.success('Employee deleted successfully');
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      message.error('Failed to delete employee');
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
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Employee) => (
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
          {canDelete && (
            <Button 
              danger 
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => {
                modal.confirm({
                  title: 'Are you sure you want to delete this employee?',
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

  const filteredEmployees = employees.filter(employee =>
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Employees</Title>
        <div className="flex space-x-2">
          <Input
            placeholder="Search employees"
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
              Add Employee
            </Button>
          )}
        </div>
      </div>
      
      <div className="scrollable-table-container">
        <Table 
          columns={columns} 
          dataSource={filteredEmployees} 
          rowKey="id" 
          loading={loading}
        />
      </div>
      
      <Modal
        title={editingId ? 'Edit Employee' : 'Add Employee'}
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
            name="position"
            label="Position"
            rules={[{ required: true, message: 'Please enter position' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: 'Please enter department' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="joinDate"
            label="Join Date"
            rules={[{ required: true, message: 'Please select join date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;
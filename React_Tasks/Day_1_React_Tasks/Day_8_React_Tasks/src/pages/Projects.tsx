import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, Typography, App } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getProjects, createProject, updateProject, deleteProject } from '../api/api';
import { Project } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/auth';
import dayjs from 'dayjs';
import '../index.css'; // Import the CSS file

const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { permissions } = useAuth();
  const { message, modal } = App.useApp();

  const canAdd = hasPermission(permissions, 'projects', 'add');
  const canEdit = hasPermission(permissions, 'projects', 'edit');
  const canDelete = hasPermission(permissions, 'projects', 'delete');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      message.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const showModal = (project?: Project) => {
    if (project) {
      setEditingId(project.id);
      form.setFieldsValue({
        ...project,
        dateRange: [dayjs(project.startDate), dayjs(project.endDate)],
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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Extract dates from range picker
      const [startDate, endDate] = values.dateRange;
      const projectData = {
        ...values,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      };
      
      // Remove dateRange field
      delete projectData.dateRange;
      
      if (editingId) {
        await updateProject(editingId, projectData);
        message.success('Project updated successfully');
      } else {
        await createProject(projectData);
        message.success('Project created successfully');
      }
      
      setModalVisible(false);
      form.resetFields();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      message.error('Failed to save project');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProject(id);
      message.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      message.error('Failed to delete project');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Project) => (
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
                  title: 'Are you sure you want to delete this project?',
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

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={2}>Projects</Title>
        <div className="flex space-x-2">
          <Input
            placeholder="Search projects"
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
              Add Project
            </Button>
          )}
        </div>
      </div>
      
      <div className="scrollable-table-container">
        <Table 
          columns={columns} 
          dataSource={filteredProjects} 
          rowKey="id" 
          loading={loading}
        />
      </div>
      
      <Modal
        title={editingId ? 'Edit Project' : 'Add Project'}
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
            label="Project Name"
            rules={[{ required: true, message: 'Please enter project name' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          
          <Form.Item
            name="dateRange"
            label="Project Duration"
            rules={[{ required: true, message: 'Please select project duration' }]}
          >
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Option value="Planning">Planning</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="On Hold">On Hold</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Projects;
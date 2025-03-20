import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography, message } from 'antd';
import { UserOutlined, TeamOutlined, ProjectOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { getUsersCount, getEmployeesCount, getProjectsCount, getRolesCount } from '../api/api'; // Assume these API functions are defined

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [usersCount, setUsersCount] = useState<number>(0);
  const [employeesCount, setEmployeesCount] = useState<number>(0);
  const [projectsCount, setProjectsCount] = useState<number>(0);
  const [rolesCount, setRolesCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [users, employees, projects, roles] = await Promise.all([
          getUsersCount(),
          getEmployeesCount(),
          getProjectsCount(),
          getRolesCount(),
        ]);
        setUsersCount(users);
        setEmployeesCount(employees);
        setProjectsCount(projects);
        setRolesCount(roles);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <p className="mb-6">Welcome, {user?.name}! You are logged in as <strong>{user?.role}.</strong></p>
      
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} style={{ backgroundColor: '#f0f2f5' }}>
            <Statistic
              title="Users"
              value={usersCount}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} style={{ backgroundColor: '#f0f2f5' }}>
            <Statistic
              title="Employees"
              value={employeesCount}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} style={{ backgroundColor: '#f0f2f5' }}>
            <Statistic
              title="Projects"
              value={projectsCount}
              prefix={<ProjectOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card loading={loading} style={{ backgroundColor: '#f0f2f5' }}>
            <Statistic
              title="Roles"
              value={rolesCount}
              prefix={<SettingOutlined style={{ color: '#eb2f96' }} />}
            />
          </Card>
        </Col>
      </Row>
      
      <Card style={{ marginTop: 16, backgroundColor: '#e6f7ff' }}>
        <Title level={4}>Looking for the best workplace experience.</Title>
      </Card>
    </div>
  );
};

export default Dashboard;
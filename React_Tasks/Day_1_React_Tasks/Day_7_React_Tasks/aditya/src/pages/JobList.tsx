import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchJobs, deleteJob } from "../store/jobsSlice";
import { RootState, AppDispatch } from "../store/store";
import { Card, Typography, Input, Select, Row, Col, Space, Button, Pagination, Modal } from "antd";
import { EditOutlined, DeleteOutlined, MoneyCollectOutlined, EnvironmentOutlined, UserOutlined, FileTextOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const JobList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const jobs = useSelector((state: RootState) => state.jobs.jobs);
  const loggedInUser = useSelector((state: RootState) => state.auth.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const formatSalary = (salary: string | number) => `₹ ${new Intl.NumberFormat("en-IN").format(Number(salary))}`;

  const filteredJobs = jobs.filter((job) => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) && (filterType ? job.type === filterType : true)
  );

  const paginatedJobs = filteredJobs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = (jobId: string) => {
    confirm({
      title: "Are you sure you want to delete this job?",
      content: "This action cannot be undone.",
      onOk() {
        dispatch(deleteJob(jobId));
      },
    });
  };

  return (
    <div style={{ padding: "10px", maxWidth: "1200px", margin: "auto" }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>Job Listings</Title>
      
      <Row gutter={[16, 16]} justify="center" style={{ marginBottom: "30px" }}>
        <Col xs={24} sm={12} md={8}>
          <Search
            placeholder="Search job title..."
            allowClear
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%" }}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            placeholder="Filter by type"
            allowClear
            onChange={(value) => setFilterType(value)}
            style={{ width: "100%" }}
          >
            <Option value="Full-time">Full-time</Option>
            <Option value="Part-time">Part-time</Option>
            <Option value="Remote">Remote</Option>
          </Select>
        </Col>
      </Row>

      <Row gutter={[16, 16]} justify="center">
        {paginatedJobs.map((job) => {
          const isOwner = String(loggedInUser?.id) === job.createdById;
          return (
            <Col xs={24} sm={12} md={8} key={job.id}>
              <Card
                title={<Text strong>{job.title}</Text>}
                hoverable
                style={{ width: "90%", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}
              >
                <Space direction="vertical" size="small">
                  <Text><MoneyCollectOutlined style={{ color: "#52c41a" }} /> <strong>Salary:</strong> {formatSalary(job.salary)}</Text>
                  <Text><FileTextOutlined style={{ color: "#52c41a" }} /> <strong>Description:</strong> {job.description}</Text>
                  <Text><EnvironmentOutlined style={{ color: "#1890ff" }} /> <strong>Location:</strong> {job.location}</Text>
                  <Text><UserOutlined style={{ color: "#ff4d4f" }} /> <strong>Added by:</strong> {job.addedBy}</Text>
                  <Text><strong>Type:</strong> {job.type}</Text>
                  <Space>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/edit-job/${job.id}`)} disabled={!isOwner}>Edit</Button>
                    <Button danger icon={<DeleteOutlined />} onClick={() => job.id !== undefined && handleDelete(job.id)} disabled={!isOwner}>Delete</Button>
                  </Space>
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Row justify="center" style={{ marginTop: "20px" }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={filteredJobs.length}
          onChange={(page) => setCurrentPage(page)}
        />
      </Row>
    </div>
  );
};

export default JobList;

import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Form, Input, Button, Select, InputNumber, message, Spin } from "antd";
import { fetchJobs, updateJob } from "../store/jobsSlice";
import { RootState, AppDispatch } from "../store/store";

const { Option } = Select;

const EditJob: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [form] = Form.useForm();
  const loggedInUser = useSelector((state: RootState) => state.auth.user);

  const job = useSelector((state: RootState) =>
    state.jobs.jobs.find((j) => j.id === id)
  );

  useEffect(() => {
    if (!job) {
      dispatch(fetchJobs());
    } else {
      form.setFieldsValue(job);
    }
  }, [dispatch, job, form]);

  // Prevent unauthorized users from accessing the edit page
  if (!job) return <Spin />;
  if (String(loggedInUser?.id) !== job.createdById) {
    message.error("You are not allowed to edit this job.");
    navigate("/jobs");
    return null;
  }

  const handleSubmit = (values: any) => {
    const updatedJob = { ...job, ...values };
    dispatch(updateJob({ id: job.id, updatedJob }))
      .unwrap()
      .then(() => {
        message.success("Job updated successfully!");
        navigate("/jobs");
      })
      .catch(() => {
        message.error("Failed to update job.");
      });
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "30px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", borderRadius: "10px", background: "#fff" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Job</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={job}
      >
        <Form.Item
          label="Job Title"
          name="title"
          rules={[{ required: true, message: "Please enter job title" }]}
        >
          <Input placeholder="Enter job title" />
        </Form.Item>

        <Form.Item
          label="Job Description"
          name="description"
          rules={[{ required: true, message: "Please enter job description" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter job description" />
        </Form.Item>

        <Form.Item
          label="Salary"
          name="salary"
          rules={[{ required: true, message: "Please enter salary amount" }]}
        >
          <InputNumber style={{ width: "100%" }} placeholder="Enter salary" min={0} />
        </Form.Item>

        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please enter job location" }]}
        >
          <Input placeholder="Enter location" />
        </Form.Item>

        <Form.Item
          label="Job Type"
          name="type"
          rules={[{ required: true, message: "Please select job type" }]}
        >
          <Select placeholder="Select job type">
            <Option value="Full-time">Full-time</Option>
            <Option value="Part-time">Part-time</Option>
            <Option value="Remote">Remote</Option>
          </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Update Job
        </Button>
      </Form>
    </div>
  );
};

export default EditJob;

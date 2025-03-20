import { Form, Input, Button, Select, message, Card, InputNumber } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addJob } from "../store/jobsSlice";
import { RootState, AppDispatch } from "../store/store";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs

const { Option } = Select;

const AddJob = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const formatCurrency = (value: number | string | undefined) => {
    if (!value) return "";
    return Number(value).toString();
  };

  const parseCurrency = (value: string | undefined) => {
    if (!value) return 0;
    return Number(value);
  };

  const onFinish = async (values: { title: string; description: string; salary: string; location: string; type: string }) => {
    try {
      console.log("📝 Form submitted with values:", values); // Debug statement 1

      if (!user) {
        message.error("You must be logged in to add a job.");
        console.error("🚨 User is not logged in!"); // Debug statement 2
        return;
      }

      const newJob = {
        id: uuidv4(), // Generate a unique ID
        ...values,
        salary: parseCurrency(values.salary), // Convert salary to number
        addedBy: user.email,
        createdById: user.id ? user.id.toString() : "", // Ensure createdById is always set
      };

      console.log("🚀 Dispatching new job:", newJob); // Debug statement 3

      await dispatch(addJob(newJob)).unwrap();
      message.success("✅ Job added successfully!");
      console.log("🎉 Job added successfully!"); // Debug statement 4
      navigate("/jobs");
    } catch (error) {
      message.error("❌ Failed to add job.");
      console.error("❌ Error adding job:", error); // Debug statement 5
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card style={{ width: 500, padding: 20 }}>
        <h2>Add a New Job</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: "Please enter job title!" }]}>
            <Input placeholder="Enter job title" />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: "Please enter job description!" }]}>
            <Input.TextArea rows={4} placeholder="Enter job description" />
          </Form.Item>
          <Form.Item label="Salary (INR ₹)" name="salary" rules={[{ required: true, message: "Please enter salary!" }]}>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              formatter={formatCurrency}
              parser={parseCurrency}
              placeholder="Enter salary in ₹"
            />
          </Form.Item>
          <Form.Item label="Location" name="location" rules={[{ required: true, message: "Please enter location!" }]}>
            <Input placeholder="Enter location" />
          </Form.Item>
          <Form.Item label="Job Type" name="type" rules={[{ required: true, message: "Please select job type!" }]}>
            <Select placeholder="Select job type">
              <Option value="Full-time">Full-time</Option>
              <Option value="Part-time">Part-time</Option>
              <Option value="Remote">Remote</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Job
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddJob;

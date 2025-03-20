import { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import axios from "axios";

const DataDisplay = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users"); 
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
        <Spin size="large" />
      </div>
    );

  return (
    <Table dataSource={data} rowKey="id" pagination={{ pageSize: 5 }}>
      <Table.Column title="ID" dataIndex="id" key="id" />
      <Table.Column title="Name" dataIndex="name" key="name" />
      <Table.Column title="Username" dataIndex="username" key="username" />
      <Table.Column title="Email" dataIndex="email" key="email" />
    </Table>
  );
};

export default DataDisplay;

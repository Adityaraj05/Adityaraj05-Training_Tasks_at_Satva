import { useEffect, useState } from "react";
import { Table, Card } from "antd";

interface User {
  name: string;
  email: string;
  createdAt: string; // ✅ Match this with "Register.tsx"
}

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Load users from local storage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(storedUsers);
  }, []);

  return (
    <Card title="Registered Users" style={{ maxWidth: "800px", margin: "auto", marginTop: "20px" }}>
      <Table dataSource={users} rowKey="email" pagination={{ pageSize: 5 }}>
        <Table.Column title="Name" dataIndex="name" />
        <Table.Column title="Email" dataIndex="email" />
        {/* ✅ Properly formatted date */}
        <Table.Column
          title="Registered Date"
          dataIndex="createdAt"
          render={(date: string) => new Date(date).toLocaleDateString()}
        />
      </Table>
    </Card>
  );
};

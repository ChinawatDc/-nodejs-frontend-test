"use client";
import { Table, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const { Title } = Typography;
const baseEndpoint = process.env.NEXT_PUBLIC_BASEURL_API;
interface User {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    console.log("baseEndpoint", baseEndpoint);
    axios.get(`${baseEndpoint}/users`).then((res) => setUsers(res.data));
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>User List</Title>
      <Table dataSource={users} columns={columns} rowKey="id" />
    </div>
  );
}

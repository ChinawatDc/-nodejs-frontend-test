"use client";
import { UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Space, Table, Typography } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const { Title } = Typography;
const baseEndpoint = process.env.NEXT_PUBLIC_BASEURL_API;

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserFormValues {
  name: string;
  email: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    axios.get(`${baseEndpoint}/users`).then((res) => {
      setUsers(res.data.body);
    });
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Actions",
      key: "actions",
      render: (_: undefined, user: User) => (
        <Space>
          <Button onClick={() => handleEdit(user)}>Edit</Button>
          <Button danger onClick={() => handleDelete(user.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreate = async (values: UserFormValues) => {
    try {
      const { name, email } = values;
      const response = await axios.post(`${baseEndpoint}/users`, {
        name,
        email,
      });
      setUsers([...users, response.data.body]);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Failed to create user", error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleUpdate = async (values: UserFormValues) => {
    if (!editingUser) return;

    try {
      const { name, email } = values;
      const response = await axios.put(
        `${baseEndpoint}/users/${editingUser.id}`,
        { name, email }
      );
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? response.data.body : user
        )
      );
      setIsModalVisible(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Failed to update user", error);
    }
  };

  const handleDelete = async (userId: number) => {
    try {
      await axios.delete(`${baseEndpoint}/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  const modalFooter = [
    <Button key="cancel" onClick={handleCancel}>
      Cancel
    </Button>,
    <Button key="submit" type="primary" onClick={() => form.submit()}>
      Submit
    </Button>,
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>User List</Title>
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Add User
      </Button>
      <Table dataSource={users} columns={columns} rowKey="id" />
      <Modal
        title={editingUser ? "Edit User" : "Create User"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={modalFooter}
      >
        <Form
          form={form}
          onFinish={editingUser ? handleUpdate : handleCreate}
          initialValues={editingUser || { name: "", email: "" }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input the email!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

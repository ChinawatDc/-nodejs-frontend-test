"use client";
import { UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Space, Table, Typography } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
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

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const admin = userData?.email === "chinawat.dc@gmail.com";
        setIsAdmin(admin);
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, []);
  useEffect(() => {
    axios.get(`${baseEndpoint}/users`).then((res) => {
      setUsers(res.data.body);
    });
  }, []);

  const columns = [
    { title: "ลำดับ", dataIndex: "id", key: "id" },
    { title: "ชื่อ", dataIndex: "name", key: "name" },
    { title: "E-mail", dataIndex: "email", key: "email" },
    {
      title: "วันที่สร้าง",
      dataIndex: "created_at",
      key: "created_at",
      render: (text: string) => moment(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "วันที่แก้ไข",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text: string) => moment(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: undefined, user: User) => (
        <Space>
          {isAdmin && (
            <React.Fragment>
              <Button onClick={() => onEdit(user)}>Edit</Button>
              <Button danger onClick={() => onDelete(user.id)}>
                Delete
              </Button>
            </React.Fragment>
          )}
        </Space>
      ),
    },
  ].filter(Boolean); // ลบค่า `undefined` ถ้าไม่ใช่ admin

  const onCreate = async (values: UserFormValues) => {
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

  const onEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const onUpdate = async (values: UserFormValues) => {
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

  const onDelete = async (userId: number) => {
    try {
      await axios.delete(`${baseEndpoint}/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  const onCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  const modalFooter = [
    <Button key="cancel" onClick={onCancel}>
      Cancel
    </Button>,
    <Button key="submit" type="primary" onClick={() => form.submit()}>
      Submit
    </Button>,
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>ผู้ใช้งาน</Title>
      {isAdmin && (
        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          Add User
        </Button>
      )}
      <Table dataSource={users} columns={columns} rowKey="id" />
      <Modal
        title={editingUser ? "Edit User" : "Create User"}
        open={isModalVisible}
        onCancel={onCancel}
        footer={modalFooter}
      >
        <Form
          form={form}
          onFinish={editingUser ? onUpdate : onCreate}
          initialValues={{ name: "", email: "" }}
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

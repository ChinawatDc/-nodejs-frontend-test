"use client";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, MenuProps, Space } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// เมนูหลัก
const menuItems = [
  { key: "home", label: "หน้าหลัก", url: "/" },
  { key: "users", label: "ผู้ใช้งาน", url: "/users" },
  { key: "config", label: "การจัดการ", url: "/configs" },
];

export default function AppMenu() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    image: "",
    position: "",
  });

  // ดึงข้อมูลจาก localStorage เมื่อ component โหลด
  useEffect(() => {
    const storedUser = localStorage.getItem("user_data");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserProfile({
          name: userData.name || "ไม่ทราบชื่อ",
          email: userData.email || "ไม่มีอีเมล",
          image: userData.image || "https://via.placeholder.com/40",
          position: userData.position || "ไม่มีข้อมูลตำแหน่ง",
        });
      } catch (error) {
        console.error("Error parsing user data from localStorage", error);
      }
    }
  }, []);

  // เมนูโปรไฟล์
  const profileMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <Space>
          <Avatar src={userProfile.image} size={40} />
          <div>
            <div style={{ fontWeight: "bold" }}>{userProfile.name}</div>
            <div style={{ fontSize: "12px", color: "#888" }}>
              {userProfile.email}
            </div>
            <div style={{ fontSize: "12px", color: "#888" }}>
              {userProfile.position}
            </div>
          </div>
        </Space>
      ),
      disabled: true,
    },
    { type: "divider" }, // เส้นแบ่ง
    {
      key: "logout",
      label: "ออกจากระบบ",
      icon: <LogoutOutlined />,
      onClick: () => {
        localStorage.removeItem("user_data"); // ลบข้อมูลออก
        router.push("/login");
      },
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* เมนูหลัก */}
      <Menu
        mode="horizontal"
        theme="light"
        selectedKeys={[]}
        items={menuItems.map((item) => ({
          key: item.key,
          label: item.label,
          onClick: () => router.push(item.url),
        }))}
      />

      {/* เมนูโปรไฟล์ */}
      <Dropdown menu={{ items: profileMenuItems }} trigger={["click"]}>
        <Space
          style={{
            cursor: "pointer",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ddd",
          }}
        >
          <Avatar src={userProfile.image} size={32} icon={<UserOutlined />} />
          <span>{userProfile.name}</span>
        </Space>
      </Dropdown>
    </div>
  );
}

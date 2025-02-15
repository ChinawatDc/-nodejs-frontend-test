"use client";
import { Card, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaCog, FaUser } from "react-icons/fa";

const { Title, Text } = Typography;

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    const updateDate = () => {
      const yearBE = moment().year() + 543;
      setCurrentDate(moment().format(`dddd, DD MMMM ${yearBE} HH:mm:ss`));
    };

    updateDate();
    const interval = setInterval(updateDate, 1000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    { title: "ผู้ใช้งาน", icon: <FaUser size={24} />, link: "/users" },
    { title: "การจัดการ", icon: <FaCog size={24} />, link: "/configs" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <Card className="w-full max-w-lg text-center shadow-lg bg-white rounded-xl">
        <Title level={2} className="text-gray-800">
          ยินดีตอนรับเข้าสู่เว็บทดสอบ !
        </Title>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <FaCalendarAlt size={20} />
          <Text className="text-lg font-medium">{currentDate}</Text>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {features.map((feature, index) => (
          <a key={index} href={feature.link} className="block">
            <Card
              hoverable
              className="p-6 flex flex-col items-center justify-center text-gray-700 rounded-lg shadow-md"
            >
              <div className="mb-2 flex items-center justify-center w-full h-full">
                {feature.icon}
              </div>
              <Title level={4} className="text-center">
                {feature.title}
              </Title>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}

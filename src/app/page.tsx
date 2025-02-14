"use client";
import { Layout, Button } from "antd";
import { useRouter } from "next/router";

const { Header, Content } = Layout;

export default function HomePage() {
  const router = useRouter();

  const navigateToUsers = () => {
    router.push("/users");
  };

  return (
    <Layout>
      <Header style={{ padding: 0, background: "#fff" }}>
        <Button type="primary" onClick={navigateToUsers}>
          Go to Users Page
        </Button>
      </Header>
      <Content style={{ padding: "20px" }}>
        <h2>Welcome to the Home Page!</h2>
      </Content>
    </Layout>
  );
}

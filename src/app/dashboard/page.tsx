"use client";

import {
  Button,
  Card,
  Col,
  Row,
  Statistic,
  List,
  Typography,
  Space,
} from "antd";
import { useRouter } from "next/navigation";
import {
  ClockCircleOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

export default function DashboardPage() {
  const router = useRouter();

  // Mock data for upcoming trainings
  const upcomingTrainings = [
    { id: 1, title: "Yoga Class", date: "2025-12-26", time: "10:00" },
    { id: 2, title: "Pilates", date: "2025-12-27", time: "14:00" },
    { id: 3, title: "Strength Training", date: "2025-12-28", time: "16:00" },
  ];

  // Mock statistics
  const stats = {
    totalCustomers: 150,
    totalVisits: 1200,
    revenue: 50000,
  };

  return (
    <Space size={16} direction="vertical" style={{ width: "100%" }}>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Всего клиентов"
              value={stats.totalCustomers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Всего визитов"
              value={stats.totalVisits}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Доход"
              value={stats.revenue}
              prefix={<DollarOutlined />}
              suffix="RUB"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Быстрые действия" style={{ height: "100%" }}>
            <Button
              type="primary"
              size="large"
              onClick={() => router.push("/schedule/quick-visit")}
              style={{ marginBottom: 16 }}
            >
              Отметить визит
            </Button>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Ближайшие тренировки" style={{ height: "100%" }}>
            <List
              dataSource={upcomingTrainings}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={`${item.date} в ${item.time}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
}

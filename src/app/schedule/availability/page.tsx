"use client";

import { List } from "@refinedev/antd";
import { ClockCircleOutlined } from "@ant-design/icons";

import AvailabilityManager from "@/components/schedule/AvailabilityManager";

export default function AvailabilityPage() {
  return (
    <List
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ClockCircleOutlined />
          {"Расписание работы зала"}
        </div>
      }
    >
      <AvailabilityManager />
    </List>
  );
}

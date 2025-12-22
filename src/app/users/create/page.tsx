"use client";

import { Create } from "@refinedev/antd";
import { Form, Input } from "antd";

export default function UserCreate() {
  return (
    <Create>
      <Form layout="vertical">
        <Form.Item label="Name" name="name">
          <Input />
        </Form.Item>
      </Form>
    </Create>
  );
}
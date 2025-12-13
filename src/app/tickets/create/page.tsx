"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { Form, Select } from "antd";

export default function TicketCreate() {
  const { formProps, saveButtonProps, form } = useForm({
    resource: "tickets",
    action: "create",
    submitOnEnter: true,
    onMutationSuccess: () => {
      formProps.form?.resetFields();
    },
    successNotification: {
      message: "Абонемент успешно создан",
      type: "success",
    },
    errorNotification: {
      message: "Ошибка при создании абонемента",
      type: "error",
    },
  });

  const selectedPlanUuid = Form.useWatch("ticket_plan_uuid", form);

  const { selectProps: customerSelectProps } = useSelect({
    resource: "customers",
    optionLabel: "full_name",
    optionValue: "uuid",
  });

  const { selectProps: ticketPlanSelectProps } = useSelect({
    resource: "tickets/plans",
    optionLabel: "name",
    optionValue: "uuid",
  });

  const { selectProps: ticketPlanPackageSelectProps } = useSelect({
    resource: selectedPlanUuid
      ? `tickets/plans/${selectedPlanUuid}/packages`
      : "",
    queryOptions: {
      enabled: !!selectedPlanUuid,
    },
    optionLabel: (item) => {
      const duration = item.duration_days ? `${item.duration_days} дней` : "";
      const sessions = item.total_sessions
        ? `${item.total_sessions} занятий`
        : "";
      const price = item.price ? `${item.price} ₽` : "";

      return `${duration}${sessions ? ", " + sessions : ""}${
        price ? " - " + price : ""
      }`;
    },
    optionValue: "uuid",
  });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Клиент"}
          name={["customer_uuid"]}
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите клиента",
            },
          ]}
        >
          <Select
            {...customerSelectProps}
            showSearch
            filterOption={(input, option) =>
              (option?.label?.toString() ?? "")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            placeholder="Выберите клиента"
          />
        </Form.Item>

        <Form.Item
          label={"План абонемента"}
          name={["ticket_plan_uuid"]}
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите план абонемента",
            },
          ]}
        >
          <Select
            {...ticketPlanSelectProps}
            onChange={() => {
              form?.setFieldValue("package_uuid", undefined);
            }}
            placeholder="Выберите план абонемента"
          />
        </Form.Item>

        <Form.Item
          label={"Пакет абонемента"}
          name={["package_uuid"]}
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите пакет абонемента",
            },
          ]}
        >
          <Select
            {...ticketPlanPackageSelectProps}
            disabled={!selectedPlanUuid}
            placeholder={
              selectedPlanUuid
                ? "Выберите пакет абонемента"
                : "Сначала выберите план абонемента"
            }
          />
        </Form.Item>
      </Form>
    </Create>
  );
}

"use client";

import { Create, useForm, useSelect } from "@refinedev/antd";
import { Customer } from "@/types/customer";
import { TicketPlan, TicketPlanPackage } from "@/types/ticket";
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

  const selectedPlanID = Form.useWatch("ticket_plan_id", form);

  const { selectProps: customerSelectProps } = useSelect<Customer>({
    resource: "customers",
    optionLabel: "full_name",
    optionValue: "id",
  });

  const { selectProps: ticketPlanSelectProps } = useSelect<TicketPlan>({
    resource: "tickets/plans",
    optionLabel: "name",
    optionValue: "id",
  });

  const { selectProps: ticketPlanPackageSelectProps } =
    useSelect<TicketPlanPackage>({
      resource: selectedPlanID
        ? `tickets/plans/${selectedPlanID}/packages`
        : "",
      queryOptions: {
        enabled: !!selectedPlanID,
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
      optionValue: "id",
    });

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label={"Клиент"}
          name={["customer_id"]}
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
          name={["ticket_plan_id"]}
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
              form?.setFieldValue("package_id", undefined);
            }}
            placeholder="Выберите план абонемента"
          />
        </Form.Item>

        <Form.Item
          label={"Пакет абонемента"}
          name={["package_id"]}
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите пакет абонемента",
            },
          ]}
        >
          <Select
            {...ticketPlanPackageSelectProps}
            disabled={!selectedPlanID}
            placeholder={
              selectedPlanID
                ? "Выберите пакет абонемента"
                : "Сначала выберите план абонемента"
            }
          />
        </Form.Item>
      </Form>
    </Create>
  );
}

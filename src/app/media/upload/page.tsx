"use client";

import { Create, useForm } from "@refinedev/antd";
import { Button, Form, Upload } from "antd";
import ReactJson from "react-json-view";
import { useCallback, useMemo } from "react";

export default function MediaUpload() {
  const { formProps, saveButtonProps } = useForm({
    resource: "media/upload",
    meta: {
      isFormData: true,
    },
    onMutationSuccess: () => {
      formProps.form?.resetFields();
    },
  });

  const handleMetadataChange = (newValue: any) => {
    formProps.form?.setFieldsValue({
      metadata: newValue.updated_src,
    });
  };

  const handleBeforeUpload = useCallback((): boolean => {
    return false;
  }, []);

  const modifiedFormProps = useMemo(
    () => ({
      ...formProps,
      onFinish: async (values: any) => {
        const fileList = values.files?.fileList;
    
        if (!fileList || fileList.length === 0) {
          return;
        }

        const formData = new FormData();

        fileList.forEach((file: any) => {
          if (file.originFileObj) {
            formData.append("files", file.originFileObj);
          }
        });

        if (values.metadata) {
          formData.append("metadata", JSON.stringify(values.metadata));
        }

        try {
          await formProps.onFinish?.(formData);
        } catch (error) {
          console.error("Upload failed:", error);
        }
      },
    }),
    [formProps]
  );

  return (
    <Create saveButtonProps={saveButtonProps} title={"Загрузить"}>
      <Form {...modifiedFormProps} layout="vertical">
        <Form.Item
          label={"Файл"}
          name={["files"]}
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите файл",
            },
          ]}
        >
          <Upload beforeUpload={handleBeforeUpload} maxCount={1}>
            <Button>Выбрать файл</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Create>
  );
}

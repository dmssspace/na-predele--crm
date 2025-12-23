"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function TrainerEditRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (params?.id) {
      router.replace(`/trainers?id=${params.id}`);
    } else {
      router.replace("/trainers");
    }
  }, [params, router]);

  return null;
}
          <Select
            options={[
              { value: "box", label: "Бокс" },
              { value: "thai", label: "Тайский бокс" },
              { value: "kickboxing", label: "Кикбоксинг" },
              { value: "mma", label: "ММА" },
              { value: "women_martial_arts", label: "Женские единоборства" },
            ]}
            style={{ width: 240 }}
          />
        </Form.Item>
        <Form.Item
          label={"Дата начала практики тренера"}
          name={["training_exp_start_on"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <DatePicker maxDate={dayjs()} />
        </Form.Item>
        <Form.Item label={"Регалии"} rules={[{ required: true }]}>
          <Form.List name="regalia">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name]}
                      rules={[{ required: true, message: "Введите регалию" }]}
                      style={{ marginBottom: 0 }}
                    >
                      <Input placeholder="Регалия" style={{ width: 400 }} />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Добавить регалию
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item
          label={"Описание особенностей подхода"}
          name={["approach"]}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <MDEditor data-color-mode="light" />
        </Form.Item>
        <Form.Item
          label={"Изображение профиля"}
          name={["avatar_media_id"]}
          rules={[
            {
              // required: true, // TODO:...
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={"Изображение профиля"}
          name={["intro_media_id"]}
          rules={[
            {
              // required: true, // TODO:...
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Edit>
  );
}

import { EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Flex, Typography } from "antd";
import { ReactNode } from "react";
import styles from "@/app/customers/customers.module.css";

const { Text } = Typography;

interface EditableFieldProps {
  icon: ReactNode;
  label: string;
  fieldKey: string;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  displayValue: ReactNode;
  editComponent: ReactNode;
}

export const EditableField = ({
  icon,
  label,
  fieldKey,
  isEditing,
  onToggleEdit,
  onSave,
  onCancel,
  displayValue,
  editComponent,
}: EditableFieldProps) => {
  return (
    <div className={styles.fieldCard}>
      <div className={styles.fieldHeader}>
        <div className={styles.fieldLabel}>
          <span className={styles.fieldIcon}>{icon}</span>
          <Text type="secondary">{label}</Text>
        </div>
        {!isEditing ? (
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={onToggleEdit}
          />
        ) : (
          <Flex gap={4}>
            <Button
              type="text"
              size="small"
              icon={<CheckOutlined />}
              onClick={onSave}
              style={{ color: "#52c41a" }}
            />
            <Button
              type="text"
              size="small"
              icon={<CloseOutlined />}
              onClick={onCancel}
              style={{ color: "#ff4d4f" }}
            />
          </Flex>
        )}
      </div>
      {isEditing ? editComponent : displayValue}
    </div>
  );
};
